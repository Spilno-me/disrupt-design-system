import type { Meta, StoryObj } from '@storybook/react'
import { FeaturesSection, Feature } from './FeaturesSection'
import { Workflow, BrainCircuit, LayoutDashboard, TrendingUp, Shield, Zap, Users } from 'lucide-react'
import { ORGANISM_META, organismDescription } from '@/stories/_infrastructure'

const meta: Meta<typeof FeaturesSection> = {
  title: 'Website/Sections/FeaturesSection',
  component: FeaturesSection,
  ...ORGANISM_META,
  parameters: {
    ...ORGANISM_META.parameters,
    docs: {
      description: {
        component: organismDescription('Features grid section with icon cards. Supports 2, 3, or 4 column layouts.'),
      },
    },
  },
  argTypes: {
    columns: {
      control: 'select',
      options: [2, 3, 4],
      description: 'Number of columns on desktop',
    },
    background: {
      control: 'select',
      options: ['white', 'cream'],
      description: 'Background color',
    },
    centeredHeader: {
      control: 'boolean',
      description: 'Center the header text',
    },
  },
}

export default meta
type Story = StoryObj<typeof FeaturesSection>

// Default 4-column layout (matches website WhatDisruptDoesSection)
const defaultFeatures: Feature[] = [
  {
    icon: <Workflow className="w-8 h-8 text-white" />,
    title: 'Automate',
    description: 'Streamline compliance workflows with intelligent automation that reduces manual tasks by up to 70%.',
    iconBgColor: '#2D6FE9',
  },
  {
    icon: <BrainCircuit className="w-8 h-8 text-white" />,
    title: 'AI-Powered Advice',
    description: 'Get real-time recommendations and insights powered by advanced machine learning algorithms.',
    iconBgColor: '#E94242',
  },
  {
    icon: <LayoutDashboard className="w-8 h-8 text-white" />,
    title: 'Adapt',
    description: 'Customize forms, workflows, and dashboards to match your unique business requirements.',
    iconBgColor: '#F5B731',
  },
  {
    icon: <TrendingUp className="w-8 h-8 text-white" />,
    title: 'Scale',
    description: 'Grow confidently with enterprise-grade infrastructure that scales with your business.',
    iconBgColor: '#29B356',
  },
]

export const Default: Story = {
  args: {
    title: 'What Disrupt Does',
    subtitle: 'Four pillars of intelligent compliance management',
    features: defaultFeatures,
    columns: 4,
    background: 'white',
    centeredHeader: true,
  },
}

// 3-column layout
const threeColumnFeatures: Feature[] = [
  {
    icon: <Shield className="w-8 h-8 text-white" />,
    title: 'Security First',
    description: 'Enterprise-grade security with SOC 2 Type II certification and end-to-end encryption.',
    iconBgColor: '#2D6FE9',
  },
  {
    icon: <Zap className="w-8 h-8 text-white" />,
    title: 'Lightning Fast',
    description: 'Optimized for speed with response times under 100ms globally.',
    iconBgColor: '#F5B731',
  },
  {
    icon: <Users className="w-8 h-8 text-white" />,
    title: 'Team Collaboration',
    description: 'Built for teams with real-time collaboration and role-based access controls.',
    iconBgColor: '#29B356',
  },
]

export const ThreeColumns: Story = {
  args: {
    title: 'Why Choose Us',
    subtitle: 'The tools you need to succeed',
    features: threeColumnFeatures,
    columns: 3,
    background: 'white',
    centeredHeader: true,
  },
}

// 2-column layout
const twoColumnFeatures: Feature[] = [
  {
    icon: <TrendingUp className="w-8 h-8 text-white" />,
    title: 'Save Time',
    description: 'Automate repetitive tasks and focus on what matters most. Our users save an average of 15 hours per week.',
    iconBgColor: '#2D6FE9',
  },
  {
    icon: <Shield className="w-8 h-8 text-white" />,
    title: 'Reduce Costs',
    description: 'Cut operational expenses by streamlining workflows and eliminating manual processes.',
    iconBgColor: '#29B356',
  },
]

export const TwoColumns: Story = {
  args: {
    title: 'Key Benefits',
    subtitle: 'How we help your business grow',
    features: twoColumnFeatures,
    columns: 2,
    background: 'cream',
    centeredHeader: true,
  },
}
