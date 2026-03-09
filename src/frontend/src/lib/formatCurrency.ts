/**
 * Format a number as Indonesian Rupiah currency
 * @param amount - The amount to format
 * @returns Formatted currency string (e.g., "Rp. 17.500,-")
 */
export function formatCurrency(amount: number): string {
  // Format with thousand separators using dots
  const formatted = amount.toLocaleString("id-ID", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return `Rp. ${formatted},-`;
}
