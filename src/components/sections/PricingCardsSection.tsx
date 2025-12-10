import { ALIAS } from '@/constants/designTokens'
import { Button } from '../ui/button'
import { Card, CardTitle, CardDescription } from '../ui/card'
import { ElectricButtonWrapper } from '@/components/ui/ElectricInput'
import { scrollToElement } from '@/utils/navigation'
import { GridBlobBackground } from '@/components/ui/GridBlobCanvas'
import { PricingConnector } from '@/components/ui/pricing-connector'
import { AnimatedCheck } from '@/components/ui/AnimatedCheck'

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
  subtitle?: string
  description: string
  isHighlighted?: boolean
  badge?: string
  features: TierFeature[]
  includesFrom: string
}

// =============================================================================
// DATA (Synced from Website)
// =============================================================================

const PRICING_CARD_TIERS: PricingCardTier[] = [
  {
    name: 'Viewer',
    price: '$10/mo',
    subtitle: 'Field Workers & Personnel.',
    description: 'Report observations, access assigned training.',
    includesFrom: "What's included:",
    features: [
      {
        label: 'Limited Access to Core EHS Modules',
        description: 'Observations, Incidents, Actions, Risk, Training & Basic Reporting',
      },
      {
        label: 'Read/Write Access',
        description: 'Observations, Incidents, Risk and Actions',
      },
      {
        label: 'Training Management',
        description: 'View & Take Assigned Courses',
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
    subtitle: 'Supervisors & Line Management.',
    description: 'Full incident/event management, workflow approvals.',
    includesFrom: 'Everything in Viewer, plus Full Module Control:',
    features: [
      {
        label: 'Full Create/Edit/Manage',
        description: 'of all Core Modules',
      },
      {
        label: 'Safety Essentials:',
        description: 'Inspections, Audits, Checklists',
      },
      {
        label: 'Full Workflow Approval',
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
    subtitle: 'EHS Specialists & Managers.',
    description: 'Advanced data analysis, proactive risk scoring, complete module access.',
    isHighlighted: true,
    badge: 'Most popular',
    includesFrom: 'Everything in Contributor, plus Advanced EHS & Analytics:',
    features: [
      {
        label: 'Complete Access',
        description: 'to ALL EHS Modules',
      },
      {
        label: 'Enterprise Bundle:',
        description: 'Permit to Work (LOTO), Contractor, Chemical Management',
      },
      {
        label: 'Advanced Analytics',
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
    subtitle: 'Core EHS Team & Administrators.',
    description: 'Platform configuration, data modeling, agent development.',
    includesFrom: 'Everything in Power User, plus System Administration & AI Development:',
    features: [
      {
        label: 'Full Administrator Permissions',
      },
      {
        label: 'System Configuration',
      },
      {
        label: 'Agent Master Suite:',
        description: 'Tools for Building & Deploying Agents',
      },
    ],
  },
]

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

interface PricingComponentSection {
  header: string
  items?: string[]
  text?: string
}

interface PricingComponentCardProps {
  title: string
  subtitle: string
  sections: PricingComponentSection[]
}

function PricingComponentCard({
  title,
  subtitle,
  sections,
}: PricingComponentCardProps) {
  return (
    <Card variant="pricingHighlight" shadow="sm" className="flex-1">
      <CardTitle className="font-sans font-bold text-2xl mb-1 text-primary">
        {title}
      </CardTitle>
      <p className="font-sans text-base leading-relaxed mb-6 text-secondary">
        {subtitle}
      </p>

      {sections.map((section, idx) => (
        <div key={idx} className={idx > 0 ? 'mt-6' : ''}>
          <h4 className="font-sans font-bold text-base mb-2 text-primary">
            {section.header}
          </h4>
          {section.items && (
            <ul className="space-y-1.5">
              {section.items.map((item, itemIdx) => (
                <li
                  key={itemIdx}
                  className="font-sans text-base leading-relaxed flex items-start gap-3 text-secondary"
                >
                  <span className="mt-[9px] w-1.5 h-1.5 rounded-full flex-shrink-0 bg-inverse-bg" />
                  {item}
                </li>
              ))}
            </ul>
          )}
          {section.text && (
            <p className="font-sans text-base leading-relaxed text-secondary">
              {section.text}
            </p>
          )}
        </div>
      ))}
    </Card>
  )
}

function FeatureListItem({ feature, index = 0 }: { feature: TierFeature; index?: number }) {
  return (
    <div className="flex items-start gap-3">
      <AnimatedCheck
        className="w-5 h-5 flex-shrink-0 mt-0.5"
        index={index}
      />
      <div className="flex-1">
        <span className="font-sans text-sm leading-[1.625] tracking-[-0.01em] text-primary font-medium">
          {feature.label}
        </span>
        {feature.description && (
          <span className="font-sans text-sm leading-[1.625] tracking-[-0.01em] block mt-0.5 text-secondary font-light">
            {feature.description}
          </span>
        )}
      </div>
    </div>
  )
}

function PricingCard({ tier }: { tier: PricingCardTier }) {
  return (
    <Card
      variant="pricing"
      shadow="sm"
      className="relative"
      data-element="pricing-card"
    >
      {/* Badge */}
      {tier.badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full font-sans text-xs font-semibold text-white whitespace-nowrap bg-ferrari-red">
          {tier.badge}
        </div>
      )}

      {/* Top Section */}
      <div className="flex flex-col gap-6">
        {/* Tier Info */}
        <div className="flex flex-col gap-3 pt-2">
          <h3 className="font-sans font-bold text-xl leading-[1.4] tracking-[-0.02em] text-primary">
            {tier.name}
          </h3>
          <div className="font-sans text-sm leading-[1.625] tracking-[-0.01em] text-secondary">
            {tier.subtitle && (
              <span className="font-bold block text-primary">{tier.subtitle}</span>
            )}
            {tier.description}
          </div>
        </div>

        {/* Price */}
        <div className="flex items-end gap-1">
          <span className="font-display font-bold text-3xl lg:text-4xl leading-[1.1] text-primary">
            {tier.price.replace('/mo', '')}
          </span>
          <span className="font-sans text-base leading-[1.5] pb-1 text-muted">
            /month
          </span>
        </div>

        {/* CTA Button */}
        <div className="w-full">
          <ElectricButtonWrapper className="!w-full [&>div]:w-full">
            <Button
              onClick={() => scrollToElement('contact')}
              className="w-full"
              style={{
                backgroundColor: tier.isHighlighted ? ALIAS.text.primary : ALIAS.brand.secondary,
                color: 'white'
              }}
            >
              Get Started
            </Button>
          </ElectricButtonWrapper>
        </div>
      </div>

      {/* Features Section */}
      <div className="flex flex-col gap-4 mt-8 pt-6 border-t border-default">
        <span className="font-sans font-semibold text-sm text-primary">
          {tier.includesFrom}
        </span>
        {tier.features.map((feature, idx) => (
          <FeatureListItem key={idx} feature={feature} index={idx} />
        ))}
      </div>
    </Card>
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
      <div className="max-w-container mx-auto px-4 sm:px-6 relative z-[1]">
        {/* Header */}
        <div className="flex flex-col items-start lg:items-center gap-4 mb-10">
          <h2 className="text-2xl sm:text-3xl lg:text-3xl font-display font-bold leading-[1.2] text-left lg:text-center text-primary">
            Platform Tiers: Foundational EHS & Agentic AI
          </h2>
          <p className="text-sm sm:text-base lg:text-lg font-display font-medium text-accent text-left lg:text-center max-w-[672px]">
            Pricing is structured with two components
          </p>
        </div>

        {/* Pricing Structure Cards */}
        <div className="flex flex-col md:flex-row items-stretch gap-4 md:gap-6 mb-8">
          <PricingComponentCard
            title="A: Base Platform Fee"
            subtitle="Annual subscription covering the core platform"
            sections={[
              {
                header: 'Includes:',
                items: [
                  'Core Engine',
                  'API Access',
                  'Security & Compliance',
                  'Hosting & Infrastructure',
                  'Continuous Updates',
                ],
              },
              {
                header: 'Pricing Model:',
                text: 'Quoted annually, based on total employee count.',
              },
            ]}
          />
          {/* Plus sign connector */}
          <PricingConnector spinInterval={3000} />
          <PricingComponentCard
            title="B: Per-User Fee"
            subtitle="Monthly billing tied to active users"
            sections={[
              {
                header: 'Access Levels:',
                items: [
                  'Viewer',
                  'Contributor',
                  'Manager / Admin',
                  'Power User (optional)',
                ],
              },
            ]}
          />
        </div>

        {/* Annual Platform Fee Row */}
        <Card variant="pricing" shadow="sm" className="p-4 sm:p-6 mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="font-sans font-bold text-base text-primary">
                Annual Platform Fee
              </CardTitle>
              <CardDescription className="font-sans text-sm text-secondary">
                Quoted based on total business size
              </CardDescription>
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
        </Card>

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
