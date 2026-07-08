import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthorized } from "@/lib/admin-auth";
import { addTagToCustomer, extractCodeFromNote, getAllRegistrants, hasTag } from "@/lib/shopify";
import { fisherYatesShuffle } from "@/lib/shuffle";
import { claimRaffleLock, getRaffleResult, releaseRaffleLock, setRaffleResult } from "@/lib/kv";
import { sendWinnerEmail } from "@/lib/email";
import { maskEmail } from "@/lib/validation";
import { isRaffleDateReached } from "@/lib/date";
import { WinnerRecord } from "@/lib/types";

export const dynamic = "force-dynamic";

function getWinnerCount(): number {
  const parsed = Number(process.env.WINNER_COUNT ?? "1");
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
}

export async function POST(request: NextRequest) {
  try {
    if (!isAdminAuthorized(request)) {
      return NextResponse.json({ error: "unauthorized" }, { status: 403 });
    }

    const existingResult = await getRaffleResult();
    if (existingResult) {
      return NextResponse.json({ error: "raffle_already_run" }, { status: 409 });
    }

    const force = request.nextUrl.searchParams.get("force") === "true";
    const raffleDate = process.env.RAFFLE_DATE;
    if (!force && !isRaffleDateReached(raffleDate)) {
      return NextResponse.json(
        { error: "raffle_not_ready", raffle_date: raffleDate },
        { status: 425 }
      );
    }

    const locked = await claimRaffleLock();
    if (!locked) {
      return NextResponse.json({ error: "raffle_already_run" }, { status: 409 });
    }

    try {
      const registrants = (await getAllRegistrants()).filter(
        (c) => !hasTag(c.tags ?? "", "prisma-ganador")
      );
      const winnerCount = getWinnerCount();
      const shuffled = fisherYatesShuffle(registrants);
      const winningCustomers = shuffled.slice(0, winnerCount);

      const winners: WinnerRecord[] = [];
      for (const customer of winningCustomers) {
        await addTagToCustomer(customer, "prisma-ganador");
        winners.push({
          name: customer.first_name ?? "",
          email: customer.email,
          email_masked: maskEmail(customer.email),
          code: extractCodeFromNote(customer.note),
          email_sent: false,
        });
      }

      // Send before persisting so the stored result reflects actual
      // delivery status instead of always claiming success.
      for (const winner of winners) {
        try {
          await sendWinnerEmail({
            name: winner.name,
            email: winner.email,
            code: winner.code,
          });
          winner.email_sent = true;
        } catch (emailError) {
          console.error("Failed to send winner email:", emailError);
        }
      }

      await setRaffleResult({ winners, run_at: new Date().toISOString() });

      return NextResponse.json(
        {
          winners: winners.map((w) => ({
            name: w.name,
            email_masked: w.email_masked,
            email_sent: w.email_sent,
          })),
        },
        { status: 200 }
      );
    } catch (innerError) {
      await releaseRaffleLock();
      throw innerError;
    }
  } catch (error) {
    console.error("raffle error:", error);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
