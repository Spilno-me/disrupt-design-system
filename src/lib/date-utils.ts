/**
 * Date Utilities
 *
 * Common date formatting and manipulation functions.
 */

/**
 * Format age in days to human-readable string
 *
 * @param days - Number of days
 * @returns Human-readable age string
 *
 * @example
 * formatAge(0)   // "Today"
 * formatAge(1)   // "1 day"
 * formatAge(5)   // "5 days"
 * formatAge(7)   // "1 week"
 * formatAge(14)  // "2 weeks"
 * formatAge(30)  // "1 month"
 * formatAge(90)  // "3 months"
 */
export function formatAge(days: number): string {
  if (days === 0) return 'Today'
  if (days === 1) return '1 day'
  if (days < 7) return `${days} days`
  if (days < 14) return '1 week'
  if (days < 30) return `${Math.floor(days / 7)} weeks`
  if (days < 60) return '1 month'
  return `${Math.floor(days / 30)} months`
}

/**
 * Get aging style classes based on days elapsed
 *
 * @param days - Number of days
 * @returns Tailwind CSS classes for visual age indication
 */
export function getAgingStyles(days: number): string {
  if (days <= 1) {
    // Fresh: normal weight, success color (green)
    return 'font-normal text-success-strong dark:text-success'
  }
  if (days <= 3) {
    // Aging: medium weight, warning color (amber)
    return 'font-medium text-warning-dark dark:text-warning'
  }
  if (days <= 6) {
    // Urgent: semibold, aging color (orange)
    return 'font-semibold text-aging-dark dark:text-aging'
  }
  // Old (7+ days): bold, error color
  return 'font-bold text-error'
}
