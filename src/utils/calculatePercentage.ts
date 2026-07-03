/**
 * Calculates what percentage `part` is of `whole`.
 * Returns "Cannot divide by zero" when whole is 0.
 * Strips trailing zeros from the percentage value.
 */
export function calculatePercentage(part: number, whole: number): string {
  if (whole === 0) {
    return 'Cannot divide by zero'
  }
  const pct = parseFloat(((part / whole) * 100).toFixed(2))
  return `${pct}%`
}
