/**
 * Shared formatting utilities for currency, numbers, and other display values.
 *
 * @module lib/format
 */

// =============================================================================
// CURRENCY FORMATTING
// =============================================================================

export interface FormatCurrencyOptions {
  /** Number of decimal places (default: 0) */
  decimals?: 0 | 2
  /** Use compact notation (e.g., "$1.5k") for large numbers */
  compact?: boolean
}

/**
 * Format a number as USD currency.
 *
 * @example
 * ```ts
 * formatCurrency(1234)           // "$1,234"
 * formatCurrency(1234.56, { decimals: 2 })  // "$1,234.56"
 * formatCurrency(1500, { compact: true })   // "$1.5k"
 * ```
 */
export function formatCurrency(
  value: number,
  options: FormatCurrencyOptions = {}
): string {
  const { decimals = 0, compact = false } = options

  // Compact format: $1.5k, $2.3M
  if (compact && value >= 1000) {
    if (value >= 1_000_000) {
      const formatted = (value / 1_000_000).toFixed(value % 1_000_000 === 0 ? 0 : 1)
      return `$${formatted}M`
    }
    const formatted = (value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)
    return `$${formatted}k`
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

/**
 * Format currency for invoice display (always 2 decimal places).
 * Re-exported for backwards compatibility with invoices/types.ts
 */
export function formatInvoiceCurrency(amount: number): string {
  return formatCurrency(amount, { decimals: 2 })
}

/**
 * Format currency in compact notation (e.g., $1.5k).
 * Used for cards and summaries where space is limited.
 */
export function formatCompactCurrency(value: number): string {
  return formatCurrency(value, { compact: true })
}
