import type { Meta, StoryObj } from '@storybook/react';
import { Separator } from './separator';

const meta = {
  title: 'Core/Separator',
  component: Separator,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof Separator>;

// Horizontal Separator (Solid)
export const Horizontal: Story = {
  render: () => (
    <div style={{ width: '400px' }}>
      <p style={{ marginBottom: '16px' }}>Section above</p>
      <Separator />
      <p style={{ marginTop: '16px' }}>Section below</p>
    </div>
  ),
};

// Dashed Separator (Disrupt Style)
export const Dashed: Story = {
  render: () => (
    <div style={{ width: '400px' }}>
      <p style={{ marginBottom: '16px' }}>Section above</p>
      <div className="separator-dashed" />
      <p style={{ marginTop: '16px' }}>Section below (4px-4px dashed pattern)</p>
    </div>
  ),
};

// Vertical Separator
export const Vertical: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', height: '100px', gap: '16px' }}>
      <span>Item 1</span>
      <Separator orientation="vertical" />
      <span>Item 2</span>
      <Separator orientation="vertical" />
      <span>Item 3</span>
    </div>
  ),
};

// Card with Sections (Solid Separator)
export const CardWithSections: Story = {
  render: () => (
    <div style={{
      width: '400px',
      background: '#FFFFFF',
      border: '1px dashed #CBD5E1',
      borderRadius: '8px',
      padding: '24px',
    }}>
      <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>Card Title</h3>
      <p style={{ fontSize: '14px', color: '#5E4F7E', marginBottom: '16px' }}>First section content</p>

      <Separator className="my-6" />

      <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>Details</h4>
      <p style={{ fontSize: '14px', color: '#5E4F7E' }}>Second section content with solid separator</p>
    </div>
  ),
};

// Card with Dashed Separator (Disrupt Style)
export const CardWithDashedSeparator: Story = {
  render: () => (
    <div style={{
      width: '400px',
      background: '#FFFFFF',
      border: '1px dashed #CBD5E1',
      borderRadius: '8px',
      padding: '24px',
    }}>
      <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>Pricing Card</h3>
      <p style={{ fontSize: '14px', color: '#5E4F7E', marginBottom: '16px' }}>Plan description</p>

      <div className="separator-dashed my-6" />

      <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>Features</h4>
      <ul style={{ fontSize: '14px', color: '#5E4F7E', lineHeight: '1.8' }}>
        <li>Feature 1</li>
        <li>Feature 2</li>
        <li>Feature 3</li>
      </ul>
    </div>
  ),
};

// Comparison
export const Comparison: Story = {
  render: () => (
    <div style={{ width: '500px', display: 'grid', gap: '48px' }}>
      <div>
        <h4 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: '600' }}>Solid Separator (Default Radix)</h4>
        <Separator />
      </div>
      <div>
        <h4 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: '600' }}>Dashed Separator (Disrupt Style - 4px dash, 4px gap)</h4>
        <div className="separator-dashed" />
        <p style={{ marginTop: '8px', fontSize: '12px', fontFamily: 'monospace', color: '#9FA5B0' }}>
          className="separator-dashed"
        </p>
      </div>
    </div>
  ),
};
