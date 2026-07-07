import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const password = typeof body?.password === "string" ? body.password : "";
  const expected = process.env.ADMIN_PASSWORD;

  if (!expected || password !== expected) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ success: true });
}
