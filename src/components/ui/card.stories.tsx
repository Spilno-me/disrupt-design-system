import type { Meta, StoryObj } from '@storybook/react'
import { Check } from 'lucide-react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from './card'
import { Button } from './button'

const meta: Meta<typeof Card> = {
  title: 'Core/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'pricing', 'pricingHighlight', 'elevated'],
      description: 'Card variant style',
    },
    shadow: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'xl'],
      description: 'Shadow elevation level',
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
      <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isHighlighted ? 'text-accent' : 'text-accent'}`} />
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
// STORIES
// =============================================================================

// Basic card with header/content/footer
export const Default: Story = {
  render: () => (
    <Card className="w-[380px]" shadow="sm">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted leading-relaxed">
          This is the main content area of the card.
        </p>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button variant="outline" size="sm">Cancel</Button>
        <Button size="sm" variant="contact">Confirm</Button>
      </CardFooter>
    </Card>
  ),
}

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

// Shadow levels
export const ShadowLevels: Story = {
  render: () => (
    <div className="flex gap-6">
      <Card shadow="none" className="w-[150px] p-4">
        <p className="text-sm text-center">none</p>
      </Card>
      <Card shadow="sm" className="w-[150px] p-4">
        <p className="text-sm text-center">sm</p>
      </Card>
      <Card shadow="md" className="w-[150px] p-4">
        <p className="text-sm text-center">md</p>
      </Card>
      <Card shadow="lg" className="w-[150px] p-4">
        <p className="text-sm text-center">lg</p>
      </Card>
      <Card shadow="xl" className="w-[150px] p-4">
        <p className="text-sm text-center">xl</p>
      </Card>
    </div>
  ),
}

// =============================================================================
// ELEVATED CARD STORIES (For in-app use across Flow/Market/Partner)
// =============================================================================

// Elevated card - gradient background with gradient border
export const Elevated: Story = {
  render: () => (
    <Card variant="elevated" className="w-[408px] h-[199px]">
      <CardHeader className="p-0">
        <CardTitle className="text-primary text-lg">Card Title</CardTitle>
        <CardDescription>Card description goes here</CardDescription>
      </CardHeader>
      <CardContent className="p-0 mt-4">
        <p className="text-sm text-muted leading-relaxed">
          The elevated card variant features a gradient background transitioning from white to light gray,
          with a subtle gradient border effect for added depth. Ideal for in-app content cards.
        </p>
      </CardContent>
    </Card>
  ),
}

// Elevated card examples for different app contexts
export const ElevatedInAppCards: Story = {
  render: () => (
    <div className="flex gap-6">
      <Card variant="elevated" className="w-[408px]">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
            <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-primary">Active Incidents</h3>
            <p className="text-sm text-muted">12 open items</p>
          </div>
        </div>
        <p className="text-sm text-muted mt-4">
          Track and manage active safety incidents across all facilities.
        </p>
      </Card>
      <Card variant="elevated" className="w-[408px]">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-circleBlue/10 flex items-center justify-center">
            <svg className="w-6 h-6 text-circleBlue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-primary">Compliance Score</h3>
            <p className="text-sm text-muted">94% compliant</p>
          </div>
        </div>
        <p className="text-sm text-muted mt-4">
          Monitor regulatory compliance across your organization.
        </p>
      </Card>
    </div>
  ),
}

// All card variants comparison
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <h3 className="text-sm font-medium text-muted mb-4">Default</h3>
        <Card variant="default" className="w-[300px]">
          <CardHeader>
            <CardTitle>Default Card</CardTitle>
            <CardDescription>Standard card style</CardDescription>
          </CardHeader>
          <CardContent>Content area</CardContent>
        </Card>
      </div>
      <div>
        <h3 className="text-sm font-medium text-muted mb-4">Elevated (In-App)</h3>
        <Card variant="elevated" className="w-[300px]">
          <CardHeader className="p-0">
            <CardTitle>Elevated Card</CardTitle>
            <CardDescription>Gradient background & border</CardDescription>
          </CardHeader>
          <CardContent className="p-0 mt-4">Content area</CardContent>
        </Card>
      </div>
      <div>
        <h3 className="text-sm font-medium text-muted mb-4">Pricing</h3>
        <Card variant="pricing" className="w-[300px]">
          <CardHeader className="p-0">
            <CardTitle>Pricing Card</CardTitle>
            <CardDescription>Dashed border style</CardDescription>
          </CardHeader>
          <CardContent className="p-0 mt-4">Content area</CardContent>
        </Card>
      </div>
      <div>
        <h3 className="text-sm font-medium text-muted mb-4">Pricing Highlight</h3>
        <Card variant="pricingHighlight" className="w-[300px]">
          <CardHeader className="p-0">
            <CardTitle>Highlighted Card</CardTitle>
            <CardDescription>Animated border</CardDescription>
          </CardHeader>
          <CardContent className="p-0 mt-4">Content area</CardContent>
        </Card>
      </div>
    </div>
  ),
}
