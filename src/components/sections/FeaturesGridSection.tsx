import { GridBlobBackground } from '@/components/ui/GridBlobCanvas'

// =============================================================================
// TYPES
// =============================================================================

interface FeatureCardData {
  title: string
  subtitle: string
  description: string
}

// =============================================================================
// DATA
// =============================================================================

const FEATURES: FeatureCardData[] = [
  {
    title: 'API-First',
    subtitle: 'Integrator Agents',
    description:
      'Supports seamless enterprise integration using open APIs enabling Integrator Agents to synchronize data across SAP, Teams, and other systems – eliminating fragmentation and manual reconciliation.',
  },
  {
    title: 'Cloud-Native',
    subtitle: 'No Upgrades',
    description:
      'Ensures continuous, frictionless rolling updates. Eliminate the disruption of "version upgrades" forever.',
  },
  {
    title: 'Headless',
    subtitle: 'Engager Agents',
    description:
      'Supports Engager Agents for highly intuitive, mobile-first design, driving user adoption and data quality.',
  },
]

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

function FeatureGridCard({ title, subtitle, description }: FeatureCardData) {
  return (
    <div
      className="flex flex-col gap-4 p-6 rounded-xl border border-dashed border-default bg-page"
      data-element="feature-grid-card"
    >
      {/* Title Block */}
      <div className="flex flex-col gap-1">
        <h3 className="font-display font-bold text-2xl sm:text-[28px] leading-[1.2] tracking-[-0.02em] text-primary">
          {title}
        </h3>
        <span className="font-display font-medium text-lg sm:text-xl leading-[1.3] text-accent">
          {subtitle}
        </span>
      </div>

      {/* Description */}
      <p className="font-sans text-sm leading-[1.7] tracking-[-0.01em] text-secondary">
        {description}
      </p>
    </div>
  )
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function FeaturesGridSection() {
  return (
    <section
      className="py-8 sm:py-12 lg:py-16 relative"
      data-element="features-grid-section"
    >
      <GridBlobBackground scale={1.5} />
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 relative z-[1]">
        {/* Header */}
        <div className="flex flex-col items-start lg:items-center gap-4 mb-10">
          <h2 className="text-2xl sm:text-3xl lg:text-[32px] font-display font-bold leading-[1.2] text-left lg:text-center text-primary">
            The Monolith is Dead. Architecture Matters.
          </h2>
          <p className="text-sm sm:text-base lg:text-lg font-display font-medium text-accent text-left lg:text-center max-w-[672px]">
            We replace outdated, monolithic EHS systems with a modern M-MACH-1
            infrastructure.
          </p>
        </div>

        {/* Features Grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-16"
          data-element="features-grid"
        >
          {FEATURES.map((feature) => (
            <FeatureGridCard
              key={feature.title}
              title={feature.title}
              subtitle={feature.subtitle}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
