import { COLORS } from '@/constants/designTokens'
import { GridBlobBackground } from '@/components/ui/GridBlobCanvas'

// =============================================================================
// TYPES
// =============================================================================

interface FeatureCardData {
  title: string
  description: string
}

// =============================================================================
// DATA
// =============================================================================

const FEATURES: FeatureCardData[] = [
  {
    title: 'API-First (Integrator Agents)',
    description:
      'Enables Integrator Agents for seamless sync with enterprise systems (SAP, Teams), eliminating data fragmentation.',
  },
  {
    title: 'Cloud-Native (No Upgrades)',
    description:
      'Ensures continuous, frictionless rolling updates. Eliminate the disruption of "version upgrades" forever.',
  },
  {
    title: 'Headless (Engager Agents)',
    description:
      'Supports Engager Agents for highly intuitive, mobile-first design, driving user adoption and data quality.',
  },
]

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

function FeatureGridCard({ title, description }: FeatureCardData) {
  return (
    <div
      className="flex flex-col gap-6 p-6 rounded-xl border border-dashed border-slate-300 bg-cream"
      data-element="feature-grid-card"
    >
      <div className="flex flex-col gap-4">
        <h3
          className="font-sans font-bold text-xl leading-[1.4] tracking-[-0.02em]"
          style={{ color: COLORS.dark }}
        >
          {title}
        </h3>
      </div>
      <p
        className="font-sans text-sm leading-[1.625] tracking-[-0.01em]"
        style={{ color: COLORS.muted }}
      >
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
          <h2 className="text-2xl sm:text-3xl lg:text-[32px] font-display font-bold leading-[1.2] text-left lg:text-center text-dark">
            The Monolith is Dead. Architecture Matters.
          </h2>
          <p className="text-sm sm:text-base lg:text-lg font-display font-medium text-teal text-left lg:text-center max-w-[672px]">
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
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
