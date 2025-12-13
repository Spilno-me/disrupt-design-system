import type { Meta, StoryObj } from '@storybook/react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from './select';

const meta = {
  title: 'Core/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof Select>;

// Default Select
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

// With Groups
export const WithGroups: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[250px]">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Fruits</SelectLabel>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="orange">Orange</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Vegetables</SelectLabel>
          <SelectItem value="carrot">Carrot</SelectItem>
          <SelectItem value="broccoli">Broccoli</SelectItem>
          <SelectItem value="spinach">Spinach</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
};

// Language Selector
export const LanguageSelector: Story = {
  render: () => (
    <div style={{ width: '300px' }}>
      <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
        Language
      </label>
      <Select defaultValue="en">
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select language" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="en">English</SelectItem>
          <SelectItem value="es">Español</SelectItem>
          <SelectItem value="fr">Français</SelectItem>
          <SelectItem value="it">Italiano</SelectItem>
          <SelectItem value="ar">العربية</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};

// All States (Visual Matrix - No interaction needed)
export const AllStates: Story = {
  render: () => (
    <div className="w-[600px] space-y-8 p-6">
      <div>
        <h4 className="text-sm font-semibold text-primary mb-4">Default State</h4>
        <Select>
          <SelectTrigger className="w-[300px]" aria-label="Default">
            <SelectValue placeholder="Select option" />
          </SelectTrigger>
        </Select>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-primary mb-4">Hover State (Simulated)</h4>
        <Select>
          <SelectTrigger className="w-[300px] hover:bg-input/50" aria-label="Hover" style={{ backgroundColor: 'rgba(var(--color-input), 0.3)' }}>
            <SelectValue placeholder="Hover state" />
          </SelectTrigger>
        </Select>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-primary mb-4">Focus State (Simulated)</h4>
        <Select>
          <SelectTrigger
            className="w-[300px] !border-accent !ring-4 !ring-accent/50"
            aria-label="Focused"
          >
            <SelectValue placeholder="Focus state" />
          </SelectTrigger>
        </Select>
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
