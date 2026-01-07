/**
 * CardSkeleton - Loading skeleton for pricing cards
 *
 * @module partners/PricingCalculator/components/CardSkeleton
 */

/** Loading skeleton placeholder for cards */
export function CardSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-6 bg-muted-bg rounded w-1/2" />
      <div className="h-12 bg-muted-bg rounded" />
    </div>
  )
}
