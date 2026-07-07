const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim());
}

export function normalizeCode(code: string): string {
  return code.trim().toUpperCase().replace(/[\s-]/g, "");
}

export function getValidCodes(): string[] {
  const raw = process.env.RAFFLE_CODES ?? "";
  return raw
    .split(",")
    .map((c) => normalizeCode(c))
    .filter(Boolean);
}

export function isValidCode(code: string): boolean {
  return getValidCodes().includes(normalizeCode(code));
}

export function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain) return email;
  const first = local.charAt(0) || "*";
  return `${first}***@${domain}`;
}
