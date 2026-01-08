/**
 * StatsCard - Re-export from shared location
 * @module leads/StatsCard
 *
 * @deprecated Import from `@dds/design-system/core` or `../shared/StatsCard` instead.
 * This re-export will be removed in v3.
 *
 * Migration:
 * ```tsx
 * // Before
 * import { StatsCard } from '../leads/StatsCard'
 *
 * // After
 * import { StatsCard } from '@dds/design-system/core'
 * // or
 * import { StatsCard } from '../shared/StatsCard'
 * ```
 */

export { StatsCard, type StatsCardProps, type TrendDirection } from '../shared/StatsCard'
export { default } from '../shared/StatsCard'
