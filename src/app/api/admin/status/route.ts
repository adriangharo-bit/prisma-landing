import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthorized } from "@/lib/admin-auth";
import { getAllRegistrants } from "@/lib/shopify";
import { getRaffleResult } from "@/lib/kv";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    if (!isAdminAuthorized(request)) {
      return NextResponse.json({ error: "unauthorized" }, { status: 403 });
    }

    const raffleDate = process.env.RAFFLE_DATE ?? "";
    const [registrants, result] = await Promise.all([
      getAllRegistrants(),
      getRaffleResult(),
    ]);

    const status = result ? "done" : new Date() >= new Date(raffleDate) ? "ready" : "waiting";

    return NextResponse.json({
      count: registrants.length,
      raffle_date: raffleDate,
      status,
      winners: result
        ? result.winners.map((w) => ({ name: w.name, email_masked: w.email_masked }))
        : [],
    });
  } catch (error) {
    console.error("admin status error:", error);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
