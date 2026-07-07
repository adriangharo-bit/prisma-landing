import { NextResponse } from "next/server";
import { getRaffleResult } from "@/lib/kv";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const raffleDate = process.env.RAFFLE_DATE ?? "";

    if (raffleDate && new Date() < new Date(raffleDate)) {
      return NextResponse.json({ status: "pending", raffle_date: raffleDate });
    }

    const result = await getRaffleResult();
    if (!result) {
      return NextResponse.json({ status: "pending", raffle_date: raffleDate });
    }

    return NextResponse.json({
      status: "complete",
      winners: result.winners.map((w) => ({
        name: w.name,
        email_masked: w.email_masked,
      })),
    });
  } catch (error) {
    console.error("winners error:", error);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
