import type { Meta, StoryObj } from '@storybook/react'
import { Info, AlertCircle, CheckCircle, Settings, User, Mail, Bell, Palette } from 'lucide-react'
import {
  MOLECULE_META,
  moleculeDescription,
} from '@/stories/_infrastructure'
import { IconText, IconHeading1, IconHeading2, IconHeading3, IconLabel } from './IconText'

// =============================================================================
// META CONFIGURATION
// =============================================================================

const meta: Meta<typeof IconText> = {
  title: 'Core/IconText',
  component: IconText,
  ...MOLECULE_META,
  parameters: {
    ...MOLECULE_META.parameters,
    docs: {
      description: {
        component: moleculeDescription(
          'Icon and text combination with consistent spacing and alignment. Includes IconHeading1, IconHeading2, IconHeading3, and IconLabel variants.'
        ),
      },
    },
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl'],
    },
    weight: {
      control: 'select',
      options: ['normal', 'medium', 'semibold', 'bold'],
    },
    as: {
      control: 'select',
      options: ['div', 'span', 'h1', 'h2', 'h3', 'h4', 'p', 'label'],
    },
  },
}

export default meta
type Story = StoryObj<typeof IconText>

// =============================================================================
// STORIES
// =============================================================================

export const Default: Story = {
  args: {
    icon: <Info />,
    children: 'Default Icon Text',
    size: 'base',
  },
}

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <IconText icon={<Info />} size="xs">Extra Small (12px)</IconText>
      <IconText icon={<Info />} size="sm">Small (14px)</IconText>
      <IconText icon={<Info />} size="base">Base (16px)</IconText>
      <IconText icon={<Info />} size="lg">Large (18px)</IconText>
      <IconText icon={<Info />} size="xl">Extra Large (20px)</IconText>
      <IconText icon={<Info />} size="2xl">2XL (24px)</IconText>
      <IconText icon={<Info />} size="3xl">3XL (30px)</IconText>
    </div>
  ),
}

export const PresetHeadings: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <IconHeading1 icon={<Palette />}>Page Title (H1)</IconHeading1>
      <IconHeading2 icon={<Info />}>Section Title (H2)</IconHeading2>
      <IconHeading3 icon={<Settings />}>Card Title (H3)</IconHeading3>
      <IconLabel icon={<Mail />}>Form Label</IconLabel>
    </div>
  ),
}

export const WithColors: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <IconText
        icon={<Info />}
        size="lg"
        iconClassName="text-accent"
        textClassName="text-primary"
      >
        Info Message
      </IconText>
      <IconText
        icon={<AlertCircle />}
        size="lg"
        iconClassName="text-error"
        textClassName="text-error"
      >
        Error Message
      </IconText>
      <IconText
        icon={<CheckCircle />}
        size="lg"
        iconClassName="text-success"
        textClassName="text-success"
      >
        Success Message
      </IconText>
    </div>
  ),
}

export const AsHeadings: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <IconText icon={<Palette />} as="h1" size="3xl" weight="bold">
        Main Page Title
      </IconText>
      <IconText icon={<Info />} as="h2" size="lg" weight="semibold">
        Why We Moved
      </IconText>
      <IconText icon={<Settings />} as="h3" size="base" weight="semibold">
        Settings Section
      </IconText>
    </div>
  ),
}

export const WithCustomGap: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <IconText icon={<User />} size="lg" gap={4}>Gap: 4px</IconText>
      <IconText icon={<User />} size="lg" gap={8}>Gap: 8px</IconText>
      <IconText icon={<User />} size="lg" gap={12}>Gap: 12px (default for lg)</IconText>
      <IconText icon={<User />} size="lg" gap={16}>Gap: 16px</IconText>
      <IconText icon={<User />} size="lg" gap={24}>Gap: 24px</IconText>
    </div>
  ),
}

export const OpticalAdjustmentComparison: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="p-4 bg-muted-bg rounded-lg">
        <p className="text-sm text-muted mb-4">With optical adjustment (default):</p>
        <IconText icon={<Info />} size="lg" weight="semibold">
          Perfectly Aligned Text
        </IconText>
      </div>
      <div className="p-4 bg-muted-bg rounded-lg">
        <p className="text-sm text-muted mb-4">Without optical adjustment:</p>
        <IconText icon={<Info />} size="lg" weight="semibold" disableOpticalAdjust>
          Text Sits Higher (Mathematical Center)
        </IconText>
      </div>
    </div>
  ),
}

export const InContext: Story = {
  render: () => (
    <div className="bg-white rounded-lg border border-default p-6 max-w-md">
      <IconText
        icon={<Info />}
        as="h2"
        size="lg"
        weight="semibold"
        iconClassName="text-accent"
        textClassName="text-primary"
        className="mb-4"
      >
        Why We Moved
      </IconText>
      <p className="text-sm text-muted">
        We&apos;ve upgraded our color documentation to a comprehensive,
        token-synced system. All colors now import directly from the
        single source of truth.
      </p>
    </div>
  ),
}

export const NotificationList: Story = {
  render: () => (
    <div className="flex flex-col gap-3 max-w-sm">
      <IconText icon={<Bell />} size="sm" iconClassName="text-accent">
        New message from John
      </IconText>
      <IconText icon={<CheckCircle />} size="sm" iconClassName="text-success">
        Task completed successfully
      </IconText>
      <IconText icon={<AlertCircle />} size="sm" iconClassName="text-error">
        Payment failed
      </IconText>
    </div>
  ),
}
