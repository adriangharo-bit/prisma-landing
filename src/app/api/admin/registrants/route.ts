import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthorized } from "@/lib/admin-auth";
import { extractCodeFromNote, getAllRegistrants } from "@/lib/shopify";

export const dynamic = "force-dynamic";

function csvField(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export async function GET(request: NextRequest) {
  try {
    if (!isAdminAuthorized(request)) {
      return NextResponse.json({ error: "unauthorized" }, { status: 403 });
    }

    const registrants = await getAllRegistrants();

    const rows = [
      ["nombre", "email", "codigo", "fecha_registro"],
      ...registrants.map((c) => [
        c.first_name ?? "",
        c.email,
        extractCodeFromNote(c.note),
        c.created_at ? c.created_at.slice(0, 10) : "",
      ]),
    ];

    const csv = rows.map((row) => row.map(csvField).join(",")).join("\n");

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="prisma-registrados.csv"',
      },
    });
  } catch (error) {
    console.error("registrants export error:", error);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
