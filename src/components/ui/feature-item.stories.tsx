import type { Meta, StoryObj } from '@storybook/react'
import {
  MOLECULE_META,
  moleculeDescription,
} from '@/stories/_infrastructure'
import { FeatureItem } from './FeatureItem'
import { COLORS } from '../../constants/designTokens'
import { Shield, BookOpen, BarChart3, Scale, Zap, Users, Globe, Lock } from 'lucide-react'

// =============================================================================
// META CONFIGURATION
// =============================================================================

const meta: Meta<typeof FeatureItem> = {
  title: 'Website/FeatureItem',
  component: FeatureItem,
  ...MOLECULE_META,
  parameters: {
    ...MOLECULE_META.parameters,
    docs: {
      description: {
        component: moleculeDescription(
          'Horizontal feature display with icon, title, and description. Used in sections like Strategic Advisory to display individual features/capabilities.'
        ),
      },
    },
  },
  argTypes: {
    icon: {
      control: false,
      description: 'Lucide icon component',
    },
    iconColor: {
      control: 'color',
      description: 'Icon stroke color',
    },
    titleColor: {
      control: 'color',
      description: 'Title text color',
    },
    descriptionColor: {
      control: 'color',
      description: 'Description text color',
    },
    iconBgColor: {
      control: 'color',
      description: 'Icon background color',
    },
  },
}

export default meta
type Story = StoryObj<typeof FeatureItem>

// =============================================================================
// STORIES
// =============================================================================

// Default - Compliance Advisor
export const Default: Story = {
  args: {
    icon: Shield,
    title: 'Compliance Advisor',
    description: 'Real-time regulatory interpretation and gap analysis for EU/OSHA directives.',
  },
}

// Regulatory Reporter
export const RegulatoryReporter: Story = {
  args: {
    icon: BookOpen,
    title: 'Regulatory Reporter',
    description: 'Auto-generate CSRD/ESG reports, OSHA 300 logs, and RIDDOR forms.',
  },
}

// Benchmark Analyst
export const BenchmarkAnalyst: Story = {
  args: {
    icon: BarChart3,
    title: 'Benchmark Analyst',
    description: 'Compare your incident rates and safety culture against industry peers instantly.',
  },
}

// Legal Risk Advisor
export const LegalRiskAdvisor: Story = {
  args: {
    icon: Scale,
    title: 'Legal Risk Advisor',
    description: 'Proactive liability assessment and litigation risk prediction.',
  },
}

// Custom Colors
export const CustomColors: Story = {
  args: {
    icon: Zap,
    title: 'Power Feature',
    description: 'A feature with custom teal color scheme.',
    iconColor: COLORS.teal,
    titleColor: COLORS.teal,
  },
}

// All Strategic Advisory Features
export const StrategicAdvisoryGrid: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl p-6 bg-white rounded-lg">
      <FeatureItem
        icon={Shield}
        title="Compliance Advisor"
        description="Real-time regulatory interpretation and gap analysis for EU/OSHA directives."
      />
      <FeatureItem
        icon={BookOpen}
        title="Regulatory Reporter"
        description="Auto-generate CSRD/ESG reports, OSHA 300 logs, and RIDDOR forms."
      />
      <FeatureItem
        icon={BarChart3}
        title="Benchmark Analyst"
        description="Compare your incident rates and safety culture against industry peers instantly."
      />
      <FeatureItem
        icon={Scale}
        title="Legal Risk Advisor"
        description="Proactive liability assessment and litigation risk prediction."
      />
    </div>
  ),
}

// Multiple Color Variants
export const ColorVariants: Story = {
  render: () => (
    <div className="space-y-6 p-6">
      <FeatureItem
        icon={Shield}
        title="Purple (Default)"
        description="Using default darkPurple color scheme."
      />
      <FeatureItem
        icon={Zap}
        title="Teal Accent"
        description="Using teal color for emphasis."
        iconColor={COLORS.teal}
        titleColor={COLORS.teal}
      />
      <FeatureItem
        icon={Users}
        title="Dark Theme"
        description="Using dark primary color."
        iconColor={COLORS.dark}
        titleColor={COLORS.dark}
      />
      <FeatureItem
        icon={Globe}
        title="Blue Feature"
        description="Using blue accent color."
        iconColor={COLORS.circleBlue}
        titleColor={COLORS.circleBlue}
      />
      <FeatureItem
        icon={Lock}
        title="Red Alert"
        description="Using red for important features."
        iconColor={COLORS.circleRed}
        titleColor={COLORS.circleRed}
      />
    </div>
  ),
}
