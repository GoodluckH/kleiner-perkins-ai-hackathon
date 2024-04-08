export function formatNumber(n: number): string {
  return Number(Math.round(n)).toLocaleString("en", {
    minimumFractionDigits: 0,
  });
}

export function convertToNumber(s: string): number {
  return Number(s.replace(/,/g, ""));
}
