/**
 * Shared animation utility functions.
 * Eliminates duplication across animation handlers.
 */

export const randomInRange = (min: number, max: number): number => {
  return min + Math.random() * (max - min)
}

export const randomCentered = (maxAbsValue: number): number => {
  return (Math.random() - 0.5) * maxAbsValue
}

export const randomDirection = (): 1 | -1 => {
  return Math.random() > 0.5 ? 1 : -1
}

/**
 * Check if an element is a form input (input, textarea, or select).
 */
export const isFormInput = (element: Element | null): element is HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement => {
  return element instanceof HTMLInputElement ||
         element instanceof HTMLTextAreaElement ||
         element instanceof HTMLSelectElement
}

/**
 * Selector for elements that should trigger the repel effect.
 * Includes: explicit data attribute, links, buttons, checkboxes, radios, and their labels.
 */
export const REPEL_ELEMENT_SELECTOR = [
  '[data-cursor-repel="true"]',
  'a',
  'button',
  '[role="button"]',
  'input[type="checkbox"]',
  'input[type="radio"]',
  'label:has(input[type="checkbox"])',
  'label:has(input[type="radio"])',
].join(', ')

/**
 * Check if an element or its ancestors should trigger repel effect.
 * Handles edge cases that CSS selectors can't cover (e.g., labels containing checkboxes).
 */
export const shouldTriggerRepel = (target: Element | null): boolean => {
  if (!target) return false

  // Check if target or any ancestor matches the selector
  if (target.closest(REPEL_ELEMENT_SELECTOR)) return true

  // Handle label elements containing checkbox/radio inputs
  // (fallback for browsers where :has() might not work perfectly)
  if (target instanceof HTMLLabelElement) {
    const hasCheckboxOrRadio = target.querySelector('input[type="checkbox"], input[type="radio"]')
    if (hasCheckboxOrRadio) return true
  }

  return false
}
