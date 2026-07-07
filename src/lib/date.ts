export function formatRaffleDate(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return "una fecha por confirmar";
  }
  return new Intl.DateTimeFormat("es-MX", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(date);
}

export function isRaffleDateReached(raffleDate?: string): boolean {
  if (!raffleDate) return true;
  const date = new Date(raffleDate);
  if (Number.isNaN(date.getTime())) return true;
  return new Date() >= date;
}
