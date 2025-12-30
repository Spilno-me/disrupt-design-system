/**
 * Date utilities for partner components
 * @module partners/utils/date.utils
 */

/**
 * Formats a date in MM/DD/YYYY format
 *
 * @param date - Date to format
 * @returns Formatted date string
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  })
}
