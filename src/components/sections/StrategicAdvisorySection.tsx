import { Shield, BookOpen, BarChart3, Scale } from 'lucide-react'

// =============================================================================
// TYPES
// =============================================================================

interface AdvisoryFeature {
  icon: React.ElementType
  title: string
  description: string
}

// =============================================================================
// DATA
// =============================================================================

const ADVISORY_FEATURES: AdvisoryFeature[] = [
  {
    icon: Shield,
    title: 'Compliance Advisor',
    description: 'Real-time regulatory interpretation and gap analysis for EU/OSHA directives.',
  },
  {
    icon: BookOpen,
    title: 'Regulatory Reporter',
    description: 'Auto-generate CSRD/ESG reports, OSHA 300 logs, and RIDDOR forms.',
  },
  {
    icon: BarChart3,
    title: 'Benchmark Analyst',
    description: 'Compare your incident rates and safety culture against industry peers instantly.',
  },
  {
    icon: Scale,
    title: 'Legal Risk Advisor',
    description: 'Proactive liability assessment and litigation risk prediction.',
  },
]

// =============================================================================
// FEATURE ITEM COMPONENT
// =============================================================================

function FeatureItem({ icon: Icon, title, description }: AdvisoryFeature) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center bg-secondary/10">
        <Icon className="w-6 h-6 text-secondary" strokeWidth={2} />
      </div>
      <div className="flex flex-col gap-1">
        <h4 className="font-sans font-bold text-base tracking-tight text-primary">
          {title}
        </h4>
        <p className="font-sans text-sm leading-[1.43] tracking-tight text-secondary">
          {description}
        </p>
      </div>
    </div>
  )
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function StrategicAdvisorySection() {
  return (
    <section
      className="py-8 sm:py-12 lg:py-16 bg-page border-y-dashed-figma"
      data-element="strategic-advisory-section"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 flex justify-center relative z-[1]">
        {/* Card */}
        <div className="max-w-[894px] w-full bg-surface rounded-[14px] border border-dashed border-muted relative">
          {/* Badge */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <span className="px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold text-white whitespace-nowrap bg-featureRed">
              STRATEGIC ADVISORY ADD-ON
            </span>
          </div>

          {/* Content */}
          <div className="p-6 pt-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6 mb-6">
              <div className="flex flex-col gap-2">
                <h3 className="text-xl sm:text-2xl font-display font-bold uppercase tracking-wide text-primary">
                  Expert Agents
                </h3>
                <p className="font-sans text-sm max-w-[320px] text-secondary">
                  Your virtual board of directors, available 24/7.
                </p>
              </div>
              <div className="flex flex-col gap-1 md:text-right">
                <span className="font-display font-bold text-2xl text-error">
                  $7500/mo
                </span>
                <span className="font-sans text-sm text-secondary">
                  Replaces €100k–500k/yr consulting spend
                </span>
              </div>
            </div>

            {/* Separator */}
            <div className="w-full h-px bg-surface-hover mb-6" />

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ADVISORY_FEATURES.map((feature) => (
                <FeatureItem key={feature.title} {...feature} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
