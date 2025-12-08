import { ALIAS, SHADOWS } from '@/constants/designTokens'
import { Check } from 'lucide-react'
import { Button } from '../ui/button'
import { ElectricButtonWrapper } from '@/components/ui/ElectricInput'
import { scrollToElement } from '@/utils/navigation'
import { GridBlobBackground } from '@/components/ui/GridBlobCanvas'

// =============================================================================
// TYPES
// =============================================================================

interface TierFeature {
  label: string
  description?: string
}

interface PricingCardTier {
  name: string
  price: string
  description: string
  isHighlighted?: boolean
  badge?: string
  features: TierFeature[]
  includesFrom: string
}

// =============================================================================
// DATA (Exact from PlatformTiersSection.tsx tables)
// =============================================================================

const PRICING_CARD_TIERS: PricingCardTier[] = [
  {
    name: 'Viewer',
    price: '$10/mo',
    description: 'Field workers, contractors, employees. Report observations, receive training.',
    includesFrom: "What's included:",
    features: [
      {
        label: 'Always Included Modules',
        description: 'Incidents, Observations, Actions Tracking, Risk, JHA, Bow-ties, Safety Meetings, Training Management, Doc Control, Basic Reporting',
      },
      {
        label: 'Tier 1: Time Saver Agents',
        description: 'Photo/Voice → Data',
      },
    ],
  },
  {
    name: 'Contributor',
    price: '$30/mo',
    description: 'Department heads, supervisors. Full incident entry, workflow approvals.',
    includesFrom: 'Everything in Viewer, plus:',
    features: [
      {
        label: 'Safety Essentials Bundle',
        description: 'Inspections & Audits',
      },
      {
        label: 'Tier 2: Process Agents',
        description: 'Workflow Orchestration',
      },
    ],
  },
  {
    name: 'Power User',
    price: '$60/mo',
    description: 'EHS Specialists, managers. Advanced data analysis, report building.',
    isHighlighted: true,
    badge: 'Most popular',
    includesFrom: 'Everything in Contributor, plus:',
    features: [
      {
        label: 'Enterprise Disruptor Bundle',
        description: 'Permit to Work (LOTO), Contractor & Chemical Management',
      },
      {
        label: 'Tier 3: Analytical Agents',
        description: 'Predictive Risk Scoring',
      },
    ],
  },
  {
    name: 'Creator',
    price: '$150/mo',
    description: 'Core EHS team, administrators. All model building, system configuration.',
    includesFrom: 'Everything in Power User, plus:',
    features: [
      {
        label: 'Agent Master Suite',
        description: 'Full Autonomy - Builder, Integrator, Engager Agents',
      },
    ],
  },
]

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

function PricingComponentCard({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="flex-1 p-6 bg-white rounded-[14px] border border-dashed border-slate-300">
      <h3
        className="font-sans font-bold text-lg mb-2"
        style={{ color: ALIAS.text.primary }}
      >
        {title}
      </h3>
      <p
        className="font-sans text-sm leading-relaxed"
        style={{ color: ALIAS.text.secondary }}
      >
        {description}
      </p>
    </div>
  )
}

function FeatureListItem({ feature }: { feature: TierFeature }) {
  return (
    <div className="flex items-start gap-3">
      <Check
        className="w-5 h-5 flex-shrink-0 mt-0.5"
        style={{ color: ALIAS.brand.secondary }}
      />
      <div className="flex-1">
        <span
          className="font-sans text-sm leading-[1.625] tracking-[-0.01em]"
          style={{ color: ALIAS.text.secondary }}
        >
          {feature.label}
        </span>
        {feature.description && (
          <span
            className="font-sans text-sm leading-[1.625] tracking-[-0.01em] block opacity-80"
            style={{ color: ALIAS.text.secondary }}
          >
            {feature.description}
          </span>
        )}
      </div>
    </div>
  )
}

function PricingCard({ tier }: { tier: PricingCardTier }) {
  return (
    <div
      className="relative flex flex-col h-full"
      data-element="pricing-card"
    >
      {/* Badge - positioned outside the card with white mask to cover border */}
      {tier.badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
          {/* White mask to cover the dashed border */}
          <div className="absolute inset-0 -inset-x-2 bg-white" />
          {/* Badge content */}
          <div
            className="relative px-3 py-1 rounded-full font-sans text-xs font-semibold text-white whitespace-nowrap"
            style={{ backgroundColor: ALIAS.feature.advice }}
          >
            {tier.badge}
          </div>
        </div>
      )}

      {/* Card container */}
      <div
        className={`flex flex-col flex-1 p-6 rounded-[14px] border border-dashed ${
          tier.isHighlighted
            ? 'border-teal bg-white'
            : 'border-slate-300 bg-white'
        }`}
        style={{
          boxShadow: tier.isHighlighted ? SHADOWS.image : SHADOWS.buttonDefault,
        }}
      >
        {/* Top Section */}
        <div className="flex flex-col gap-6">
          {/* Tier Info */}
          <div className="flex flex-col gap-3 pt-2">
            <h3
              className="font-sans font-bold text-xl leading-[1.4] tracking-[-0.02em]"
              style={{ color: ALIAS.text.primary }}
            >
              {tier.name}
            </h3>
            <p
              className="font-sans text-sm leading-[1.625] tracking-[-0.01em]"
              style={{ color: ALIAS.text.secondary }}
            >
              {tier.description}
            </p>
          </div>

          {/* Price */}
          <div className="flex items-end gap-1">
            <span
              className="font-display font-bold text-3xl lg:text-4xl leading-[1.1]"
              style={{ color: ALIAS.text.primary }}
            >
              {tier.price.replace('/mo', '')}
            </span>
            <span
              className="font-sans text-base leading-[1.5] pb-1"
              style={{ color: ALIAS.text.secondary }}
            >
              /month
            </span>
          </div>

          {/* CTA Button */}
          <div className="w-full">
            <ElectricButtonWrapper className="!w-full [&>div]:w-full">
              <Button
                onClick={() => scrollToElement('contact')}
                className={`w-full ${tier.isHighlighted ? 'bg-primary hover:bg-primary/90' : 'bg-teal hover:bg-teal/90'}`}
              >
                Get Started
              </Button>
            </ElectricButtonWrapper>
          </div>
        </div>

        {/* Features Section */}
        <div className="flex flex-col gap-4 mt-8 pt-6 border-t border-slate-200">
          <span
            className="font-sans font-semibold text-sm"
            style={{ color: ALIAS.text.primary }}
          >
            {tier.includesFrom}
          </span>
          {tier.features.map((feature, idx) => (
            <FeatureListItem key={idx} feature={feature} />
          ))}
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function PricingCardsSection() {
  return (
    <section
      className="py-8 sm:py-12 lg:py-16 relative"
      data-element="pricing-cards-section"
    >
      <GridBlobBackground scale={1.5} />
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 relative z-[1]">
        {/* Header */}
        <div className="flex flex-col items-start lg:items-center gap-4 mb-10">
          <h2
            className="text-2xl sm:text-3xl lg:text-[32px] font-display font-bold leading-[1.2] text-left lg:text-center text-dark"
          >
            Platform Tiers: Foundational EHS & Agentic AI
          </h2>
          <p
            className="text-sm sm:text-base lg:text-lg font-display font-medium text-teal text-left lg:text-center max-w-[672px]"
          >
            Pricing is structured with two components
          </p>
        </div>

        {/* Pricing Structure Cards */}
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <PricingComponentCard
            title="A: Base Platform Fee"
            description="Annual cost, quoted based on total employee count to cover core engine, API, security and hosting"
          />
          <PricingComponentCard
            title="B: Per-User Fee"
            description="Monthly cost dependent on the access level required (Viewer, Contributor, etc)"
          />
        </div>

        {/* Annual Platform Fee Row */}
        <div className="bg-white rounded-[14px] border border-dashed border-slate-300 p-4 sm:p-6 mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h4
                className="font-sans font-bold text-base"
                style={{ color: ALIAS.text.primary }}
              >
                Annual Platform Fee
              </h4>
              <p
                className="font-sans text-sm"
                style={{ color: ALIAS.text.secondary }}
              >
                Quoted based on total business size
              </p>
            </div>
            <ElectricButtonWrapper>
              <Button
                variant="contact"
                onClick={() => scrollToElement('contact')}
              >
                Get Custom Quote
              </Button>
            </ElectricButtonWrapper>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
          data-element="pricing-cards-grid"
        >
          {PRICING_CARD_TIERS.map((tier) => (
            <PricingCard key={tier.name} tier={tier} />
          ))}
        </div>
      </div>
    </section>
  )
}
