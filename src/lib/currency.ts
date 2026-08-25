export function formatSalaryAmount(
  amount: number,
  currency?: string | null,
): string {
  const normalizedCurrency = /^[A-Z]{3}$/.test(currency || "")
    ? currency!
    : "USD";

  try {
    return new Intl.NumberFormat("en", {
      style: "currency",
      currency: normalizedCurrency,
      currencyDisplay: "narrowSymbol",
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return new Intl.NumberFormat("en", {
      style: "currency",
      currency: "USD",
      currencyDisplay: "narrowSymbol",
      maximumFractionDigits: 0,
    }).format(amount);
  }
}
