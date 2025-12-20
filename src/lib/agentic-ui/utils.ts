/**
 * Utility functions for Agentic UI
 */

/**
 * Generate a simple UUID v4
 * (Lightweight implementation for prototype - use uuid package in production)
 */
export function v4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

/**
 * Deep merge objects
 */
export function deepMerge<T extends Record<string, unknown>>(target: T, source: Partial<T>): T {
  const output = { ...target }

  for (const key in source) {
    if (source[key] !== undefined) {
      if (
        typeof source[key] === 'object' &&
        source[key] !== null &&
        !Array.isArray(source[key])
      ) {
        output[key] = deepMerge(
          (target[key] || {}) as Record<string, unknown>,
          source[key] as Record<string, unknown>
        ) as T[typeof key]
      } else {
        output[key] = source[key] as T[typeof key]
      }
    }
  }

  return output
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  return function(...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

/**
 * Class name builder (simple implementation)
 */
export function cx(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}
