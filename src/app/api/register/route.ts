import { NextRequest, NextResponse } from "next/server";
import {
  addTagToCustomer,
  buildRegistrationNote,
  createCustomer,
  findCustomerByEmail,
  hasTag,
} from "@/lib/shopify";
import { sendConfirmationEmail } from "@/lib/email";
import { checkRateLimit } from "@/lib/kv";
import { isValidCode, isValidEmail, normalizeCode } from "@/lib/validation";

export const dynamic = "force-dynamic";

function getClientIp(request: NextRequest): string | null {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  const realIp = request.headers.get("x-real-ip");
  return realIp?.trim() || null;
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    if (ip) {
      const allowed = await checkRateLimit(ip);
      if (!allowed) {
        return NextResponse.json({ error: "rate_limited" }, { status: 429 });
      }
    }

    const body = await request.json().catch(() => null);
    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const email = typeof body?.email === "string" ? body.email.trim() : "";
    const codeRaw = typeof body?.code === "string" ? body.code : "";

    if (!name || !email || !codeRaw) {
      return NextResponse.json({ error: "missing_fields" }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "invalid_email" }, { status: 400 });
    }

    const code = normalizeCode(codeRaw);
    if (!isValidCode(code)) {
      return NextResponse.json({ error: "invalid_code" }, { status: 400 });
    }

    const existing = await findCustomerByEmail(email);

    if (existing) {
      if (hasTag(existing.tags ?? "", "prisma-sorteo")) {
        return NextResponse.json(
          { error: "already_registered" },
          { status: 409 }
        );
      }
      await addTagToCustomer(existing, "prisma-sorteo", buildRegistrationNote(code));
    } else {
      await createCustomer({ name, email, code });
    }

    try {
      await sendConfirmationEmail({ name, email });
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("register error:", error);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
