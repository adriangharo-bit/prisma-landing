import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthorized } from "@/lib/admin-auth";
import { addTagToCustomer, extractCodeFromNote, getAllRegistrants } from "@/lib/shopify";
import { fisherYatesShuffle } from "@/lib/shuffle";
import { getRaffleResult, setRaffleResult } from "@/lib/kv";
import { sendWinnerEmail } from "@/lib/email";
import { maskEmail } from "@/lib/validation";
import { WinnerRecord } from "@/lib/types";

export const dynamic = "force-dynamic";

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
    if (!force && raffleDate && new Date() < new Date(raffleDate)) {
      return NextResponse.json(
        { error: "raffle_not_ready", raffle_date: raffleDate },
        { status: 425 }
      );
    }

    const registrants = await getAllRegistrants();
    const winnerCount = Number(process.env.WINNER_COUNT ?? "1");
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
      });
    }

    await setRaffleResult({ winners, run_at: new Date().toISOString() });

    for (const winner of winners) {
      try {
        await sendWinnerEmail({
          name: winner.name,
          email: winner.email,
          code: winner.code,
        });
      } catch (emailError) {
        console.error("Failed to send winner email:", emailError);
      }
    }

    return NextResponse.json(
      { winners: winners.map((w) => ({ name: w.name, email_masked: w.email_masked })) },
      { status: 200 }
    );
  } catch (error) {
    console.error("raffle error:", error);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
