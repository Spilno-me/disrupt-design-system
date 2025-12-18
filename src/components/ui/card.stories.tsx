import type { Meta, StoryObj } from '@storybook/react'
import { Check } from 'lucide-react'
import {
  MOLECULE_META,
  moleculeDescription,
} from '@/stories/_infrastructure'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from './card'
import { Button } from './button'

// =============================================================================
// META CONFIGURATION
// =============================================================================

const meta: Meta<typeof Card> = {
  title: 'Core/Card (Website Only)',
  component: Card,
  ...MOLECULE_META,
  parameters: {
    ...MOLECULE_META.parameters,
    docs: {
      description: {
        component: moleculeDescription(
          'Container component with header, content, and footer sections. Includes CardHeader, CardTitle, CardDescription, CardContent, and CardFooter sub-components. Primarily used for website pricing cards.'
        ),
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['pricing', 'pricingHighlight'],
      description: 'Card variant style (website pricing only)',
    },
    shadow: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'xl', 'elevated'],
      description: 'Shadow elevation level (elevated = natural light from above)',
    },
  },
}

export default meta
type Story = StoryObj<typeof Card>

// =============================================================================
// PRICING CARD DATA (Matches Website)
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

const PRICING_CARD_TIERS: PricingCardTier[] = [
  {
    name: 'Viewer',
    price: '$10/mo',
    description: 'Field workers, contractors, employees. Report observations, receive training.',
    includesFrom: "What's included:",
    features: [
      { label: 'Core EHS Modules', description: 'Incidents, Observations, Risk, Training' },
      { label: 'Tier 1: Time Saver Agents', description: 'Photo/Voice → Data' },
    ],
  },
  {
    name: 'Contributor',
    price: '$30/mo',
    description: 'Department heads, supervisors. Full incident entry, workflow approvals.',
    includesFrom: 'Everything in Viewer, plus:',
    features: [
      { label: 'Safety Essentials Bundle', description: 'Inspections & Audits' },
      { label: 'Tier 2: Process Agents', description: 'Workflow Orchestration' },
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
      { label: 'Enterprise Disruptor Bundle', description: 'Permit to Work, Contractor & Chemical' },
      { label: 'Tier 3: Analytical Agents', description: 'Predictive Risk Scoring' },
    ],
  },
  {
    name: 'Creator',
    price: '$150/mo',
    description: 'Core EHS team, administrators. All model building, system configuration.',
    includesFrom: 'Everything in Power User, plus:',
    features: [
      { label: 'Agent Master Suite', description: 'Full Autonomy - Builder, Integrator, Engager Agents' },
    ],
  },
]

// =============================================================================
// PRICING CARD COMPONENT
// =============================================================================

function FeatureListItem({ feature, isHighlighted }: { feature: TierFeature; isHighlighted?: boolean }) {
  return (
    <div className="flex items-start gap-3">
      <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isHighlighted ? 'text-accent' : 'text-muted'}`} />
      <div className="flex-1">
        <span className={`font-sans text-sm leading-[1.625] ${isHighlighted ? 'text-primary' : 'text-muted'}`}>
          {feature.label}
          {feature.description && <span className="opacity-80"> - {feature.description}</span>}
        </span>
      </div>
    </div>
  )
}

function PricingCardComponent({ tier }: { tier: PricingCardTier }) {
  return (
    <div className="relative h-full">
      {/* Badge - positioned outside the card with white mask to cover border */}
      {tier.badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
          {/* White mask to cover the dashed border */}
          <div className="absolute inset-0 -inset-x-2 bg-white" />
          {/* Badge content */}
          <div className="relative px-3 py-1 rounded-full font-sans text-xs font-semibold text-white whitespace-nowrap bg-error">
            {tier.badge}
          </div>
        </div>
      )}

      <Card
        variant={tier.isHighlighted ? 'pricingHighlight' : 'pricing'}
        shadow="sm"
        className="h-full"
      >
        <div className="flex flex-col gap-6 pt-2">
          <div className="flex flex-col gap-3">
            <h3 className="font-sans font-bold text-xl text-primary">{tier.name}</h3>
            <p className="font-sans text-sm text-muted">{tier.description}</p>
          </div>

          <div className="flex items-end gap-1">
            <span className="font-display font-bold text-3xl text-primary">
              {tier.price.replace('/mo', '')}
            </span>
            <span className="font-sans text-base text-muted pb-1">/month</span>
          </div>

          <Button variant="contact" className="w-full">Get Started</Button>
        </div>

        <div className="flex flex-col gap-4 mt-8 pt-6 border-t border-default">
          <span className="font-sans font-semibold text-sm text-primary">{tier.includesFrom}</span>
          {tier.features.map((feature, idx) => (
            <FeatureListItem key={idx} feature={feature} isHighlighted={tier.isHighlighted} />
          ))}
        </div>
      </Card>
    </div>
  )
}

// =============================================================================
// STORIES - Website Pricing Cards Only
// =============================================================================
//
// ⚠️ IMPORTANT: This component is FROZEN for website use only.
// For in-app cards, see AppCard component (app-card.stories.tsx).
//
// =============================================================================

// Pricing card variants
export const PricingVariants: Story = {
  render: () => (
    <div className="flex gap-6">
      <Card variant="pricing" shadow="sm" className="w-[280px]">
        <CardHeader>
          <CardTitle>Standard Pricing</CardTitle>
          <CardDescription>Basic plan for individuals</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">$30/mo</p>
        </CardContent>
      </Card>
      <Card variant="pricingHighlight" shadow="sm" className="w-[280px]">
        <CardHeader>
          <CardTitle>Highlighted Pricing</CardTitle>
          <CardDescription>Most popular choice</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">$60/mo</p>
        </CardContent>
      </Card>
    </div>
  ),
}

// All 4 Pricing Cards Grid (matches website)
export const AllPricingTiers: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl">
      {PRICING_CARD_TIERS.map((tier) => (
        <PricingCardComponent key={tier.name} tier={tier} />
      ))}
    </div>
  ),
}

