import type { Meta, StoryObj } from '@storybook/react'
import { ExportButton, ExportOptions } from './ExportButton'
import { ATOM_META, atomDescription } from '@/stories/_infrastructure'

const meta: Meta<typeof ExportButton> = {
  title: 'Partner/Components/ExportButton',
  component: ExportButton,
  ...ATOM_META,
  parameters: {
    ...ATOM_META.parameters,
    docs: {
      description: {
        component: atomDescription('Dropdown button for exporting lead data in various formats (CSV, Excel, JSON, PDF).'),
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="p-4 flex gap-4">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof ExportButton>

const handleExport = async (options: ExportOptions) => {
  console.log('Exporting with options:', options)
  await new Promise((resolve) => setTimeout(resolve, 1500))
  console.log('Export complete!')
}

export const Default: Story = {
  args: {
    onExport: handleExport,
    totalCount: 100,
  },
}

export const WithSelection: Story = {
  args: {
    onExport: handleExport,
    selectedCount: 15,
    totalCount: 100,
  },
}

export const AllFormats: Story = {
  args: {
    onExport: handleExport,
    totalCount: 50,
    formats: ['csv', 'xlsx', 'json', 'pdf'],
  },
}

export const CsvOnly: Story = {
  args: {
    onExport: handleExport,
    totalCount: 50,
    formats: ['csv'],
  },
}

export const SmallSize: Story = {
  args: {
    onExport: handleExport,
    totalCount: 100,
    size: 'sm',
  },
}

export const GhostVariant: Story = {
  args: {
    onExport: handleExport,
    totalCount: 100,
    variant: 'ghost',
  },
}

export const Disabled: Story = {
  args: {
    onExport: handleExport,
    totalCount: 0,
    disabled: true,
  },
}
