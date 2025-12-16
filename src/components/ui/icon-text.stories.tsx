import type { Meta, StoryObj } from '@storybook/react'
import { Info, AlertCircle, CheckCircle, Settings, User, Mail, Bell, Palette } from 'lucide-react'
import { IconText, IconHeading1, IconHeading2, IconHeading3, IconLabel } from './IconText'
import { DEEP_CURRENT, ABYSS, CORAL, HARBOR } from '../../constants/designTokens'

const meta: Meta<typeof IconText> = {
  title: 'Core/IconText',
  component: IconText,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
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
        iconColor={DEEP_CURRENT[500]}
        textColor={ABYSS[500]}
      >
        Info Message
      </IconText>
      <IconText
        icon={<AlertCircle />}
        size="lg"
        iconColor={CORAL[500]}
        textColor={CORAL[700]}
      >
        Error Message
      </IconText>
      <IconText
        icon={<CheckCircle />}
        size="lg"
        iconColor={HARBOR[500]}
        textColor={HARBOR[700]}
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
      <div className="p-4 bg-slate-100 rounded-lg">
        <p className="text-sm text-slate-500 mb-4">With optical adjustment (default):</p>
        <IconText icon={<Info />} size="lg" weight="semibold">
          Perfectly Aligned Text
        </IconText>
      </div>
      <div className="p-4 bg-slate-100 rounded-lg">
        <p className="text-sm text-slate-500 mb-4">Without optical adjustment:</p>
        <IconText icon={<Info />} size="lg" weight="semibold" disableOpticalAdjust>
          Text Sits Higher (Mathematical Center)
        </IconText>
      </div>
    </div>
  ),
}

export const InContext: Story = {
  render: () => (
    <div className="bg-white rounded-lg border border-slate-200 p-6 max-w-md">
      <IconText
        icon={<Info />}
        as="h2"
        size="lg"
        weight="semibold"
        iconColor={DEEP_CURRENT[500]}
        textColor={ABYSS[500]}
        className="mb-4"
      >
        Why We Moved
      </IconText>
      <p className="text-sm text-slate-600">
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
      <IconText icon={<Bell />} size="sm" iconColor={DEEP_CURRENT[500]}>
        New message from John
      </IconText>
      <IconText icon={<CheckCircle />} size="sm" iconColor={HARBOR[500]}>
        Task completed successfully
      </IconText>
      <IconText icon={<AlertCircle />} size="sm" iconColor={CORAL[500]}>
        Payment failed
      </IconText>
    </div>
  ),
}
