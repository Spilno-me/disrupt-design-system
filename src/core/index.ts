/**
 * Core Design System Components
 *
 * Shared components, utilities, and tokens used across ALL products.
 * This is the default export for the design system.
 *
 * @usage
 * ```tsx
 * import { Button, Card, Input } from '@adrozdenko/design-system/core'
 * // or
 * import { Button, Card, Input } from '@adrozdenko/design-system'
 * ```
 */

// Re-export utilities
export { cn } from './utils/cn'

// Re-export tokens from constants (source of truth)
export * from '../constants/designTokens'
