import type { Meta, StoryObj } from '@storybook/react'
import {
  MOLECULE_META,
  moleculeDescription,
} from '@/stories/_infrastructure'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from './select'

// =============================================================================
// META CONFIGURATION
// =============================================================================

const meta: Meta<typeof Select> = {
  title: 'Core/Select',
  component: Select,
  ...MOLECULE_META,
  parameters: {
    ...MOLECULE_META.parameters,
    docs: {
      description: {
        component: moleculeDescription(
          'Dropdown selection component built on Radix UI Select. Includes SelectTrigger, SelectContent, SelectItem, SelectGroup, and SelectLabel sub-components.'
        ),
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Select>

// Default Select (for Controls panel)
export const Default: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select option" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="option1">Option 1</SelectItem>
        <SelectItem value="option2">Option 2</SelectItem>
        <SelectItem value="option3">Option 3</SelectItem>
      </SelectContent>
    </Select>
  ),
};

// Open Menu - Review Colors
export const OpenMenu: Story = {
  render: () => (
    <Select defaultOpen>
      <SelectTrigger className="w-[300px]">
        <SelectValue placeholder="Select option" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Common Options</SelectLabel>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
          <SelectItem value="option3">Option 3</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>More Options</SelectLabel>
          <SelectItem value="option4">Option 4</SelectItem>
          <SelectItem value="option5" disabled>Option 5 (Disabled)</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
};

// All States (Visual Matrix - No interaction needed)
export const AllStates: Story = {
  render: () => (
    <div className="w-[500px] space-y-8 p-6">
      <div>
        <h4 className="text-sm font-semibold text-primary mb-4">Default State</h4>
        <Select>
          <SelectTrigger className="w-[300px]" aria-label="Default">
            <SelectValue placeholder="Select option" />
          </SelectTrigger>
        </Select>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-primary mb-4">Focus State (Real Component Behavior - Tab to See)</h4>
        <Select>
          <SelectTrigger
            className="w-[300px]"
            aria-label="Focused select"
            autoFocus
          >
            <SelectValue placeholder="Focus state" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="demo">Demo option</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-secondary mt-2">Focus ring: Teal border + 4px teal ring (--ring variable)</p>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-primary mb-4">With Value Selected</h4>
        <Select defaultValue="option2">
          <SelectTrigger className="w-[300px]" aria-label="With value">
            <SelectValue placeholder="Select option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
            <SelectItem value="option2">Option 2 (Selected)</SelectItem>
            <SelectItem value="option3">Option 3</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-primary mb-4">Disabled State</h4>
        <Select disabled>
          <SelectTrigger className="w-[300px]" aria-label="Disabled">
            <SelectValue placeholder="Disabled select" />
          </SelectTrigger>
        </Select>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-primary mb-4">Error State (aria-invalid)</h4>
        <Select>
          <SelectTrigger className="w-[300px]" aria-invalid="true" aria-label="Error">
            <SelectValue placeholder="Invalid selection" />
          </SelectTrigger>
        </Select>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-primary mb-4">Small Size</h4>
        <Select>
          <SelectTrigger className="w-[300px]" size="sm" aria-label="Small size">
            <SelectValue placeholder="Small select" />
          </SelectTrigger>
        </Select>
      </div>
    </div>
  ),
};
