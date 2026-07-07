export function formatRaffleDate(isoDate: string): string {
  const date = new Date(isoDate);
  return new Intl.DateTimeFormat("es-MX", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(date);
}
