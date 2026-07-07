import { NextRequest } from "next/server";

export function isAdminAuthorized(request: NextRequest): boolean {
  const expectedPassword = process.env.ADMIN_PASSWORD;
  if (!expectedPassword) return false;

  const authHeader = request.headers.get("authorization");
  return authHeader === `Bearer ${expectedPassword}`;
}
