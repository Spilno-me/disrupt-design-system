import type { Meta, StoryObj } from '@storybook/react'
import { Check } from 'lucide-react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from './card'
import { Button } from './button'

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Card>

// =============================================================================
// PRICING CARD TYPES & DATA (From PricingCardsSection.tsx)
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
// PRICING CARD COMPONENT (Exact from PricingCardsSection.tsx)
// =============================================================================

function FeatureListItem({ feature, isHighlighted }: { feature: TierFeature; isHighlighted?: boolean }) {
  return (
    <div className="flex items-start gap-3">
      <Check
        className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isHighlighted ? 'text-teal' : 'text-teal'}`}
      />
      <div className="flex-1">
        <span className={`font-sans text-sm leading-[1.625] tracking-[-0.01em] ${isHighlighted ? 'text-dark' : 'text-muted'}`}>
          {feature.label}
          {feature.description && (
            <span className="opacity-80">{feature.description}</span>
          )}
        </span>
      </div>
    </div>
  )
}

function PricingCardComponent({ tier }: { tier: PricingCardTier }) {
  return (
    <div
      className={`relative flex flex-col p-6 h-full rounded-lg border border-dashed ${
        tier.isHighlighted
          ? 'border-teal bg-white shadow-lg'
          : 'border-slate-300 bg-white'
      }`}
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
          <h3 className="font-sans font-bold text-xl leading-[1.4] tracking-[-0.02em] text-dark">
            {tier.name}
          </h3>
          <p className="font-sans text-sm leading-[1.625] tracking-[-0.01em] text-muted">
            {tier.description}
          </p>
        </div>

        {/* Price */}
        <div className="flex items-end gap-1">
          <span className="font-display font-bold text-3xl lg:text-4xl leading-[1.1] text-dark">
            {tier.price.replace('/mo', '')}
          </span>
          <span className="font-sans text-base leading-[1.5] pb-1 text-muted">
            /month
          </span>
        </div>

        {/* CTA Button */}
        <div className="w-full">
          <button
            className={`w-full py-3 px-4 font-sans text-sm font-medium cursor-pointer transition-all rounded-sm text-white ${
              tier.isHighlighted
                ? 'bg-primary hover:bg-red-500'
                : 'bg-teal-800 hover:bg-teal-900'
            }`}
          >
            Get Started
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div className="flex flex-col gap-4 mt-8 pt-6 border-t border-slate-200">
        <span className="font-sans font-semibold text-sm text-dark">
          {tier.includesFrom}
        </span>
        {tier.features.map((feature, idx) => (
          <FeatureListItem key={idx} feature={feature} isHighlighted={tier.isHighlighted} />
        ))}
      </div>
    </div>
  )
}

// =============================================================================
// STORIES - Using Your Actual Pricing Card Design
// =============================================================================

// Basic card
export const Default: Story = {
  render: () => (
    <Card className="w-[380px] border-dashed border-slate-300">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted leading-relaxed">
          This is the main content area of the card. You can place any content here.
        </p>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button variant="outline" size="sm">Cancel</Button>
        <Button size="sm" className="bg-teal-800 hover:bg-teal-900">Confirm</Button>
      </CardFooter>
    </Card>
  ),
}

// Pricing card - Viewer tier
export const PricingViewer: Story = {
  render: () => <PricingCardComponent tier={PRICING_CARD_TIERS[0]} />,
}

// Pricing card - Contributor tier
export const PricingContributor: Story = {
  render: () => <PricingCardComponent tier={PRICING_CARD_TIERS[1]} />,
}

// Pricing card - Power User (Most Popular)
export const PricingPowerUser: Story = {
  render: () => <PricingCardComponent tier={PRICING_CARD_TIERS[2]} />,
}

// Pricing card - Creator tier
export const PricingCreator: Story = {
  render: () => <PricingCardComponent tier={PRICING_CARD_TIERS[3]} />,
}

// All 4 Pricing Cards Grid
export const AllPricingTiers: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-7xl">
      {PRICING_CARD_TIERS.map((tier) => (
        <PricingCardComponent key={tier.name} tier={tier} />
      ))}
    </div>
  ),
}

// Card with action button
export const WithAction: Story = {
  render: () => (
    <Card className="w-[380px] border-dashed border-slate-300">
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>You have 3 unread messages</CardDescription>
        <CardAction>
          <Button variant="ghost" size="sm">Mark all read</Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="p-2 bg-[#FBFBF3] rounded-sm">New message from John</div>
          <div className="p-2 bg-[#FBFBF3] rounded-sm">Task assigned to you</div>
          <div className="p-2 bg-[#FBFBF3] rounded-sm">Weekly report ready</div>
        </div>
      </CardContent>
    </Card>
  ),
}

// Simple content card
export const SimpleContent: Story = {
  render: () => (
    <Card className="w-[350px] border-dashed border-slate-300">
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
        <CardDescription>Enter your details to get started</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-dark">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-dark">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-sm"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full bg-teal-800 hover:bg-teal-900">Sign Up</Button>
      </CardFooter>
    </Card>
  ),
}

// Card without footer
export const NoFooter: Story = {
  render: () => (
    <Card className="w-[380px] border-dashed border-slate-300">
      <CardHeader>
        <CardTitle>Simple Card</CardTitle>
        <CardDescription>This card has no footer</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted leading-relaxed">
          Cards are flexible and don't require all sections. Use only what you need.
        </p>
      </CardContent>
    </Card>
  ),
}
