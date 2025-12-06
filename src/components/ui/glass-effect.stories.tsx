import type { Meta, StoryObj } from '@storybook/react';
import { ElectricButtonWrapper, GlassInputWrapper } from './GlassEffect';
import { Input } from './input';
import { COLORS } from '../../constants/designTokens';

const meta = {
  title: 'Website/Components/Glass Effects',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Animated glass border effects for buttons and inputs - signature Disrupt interactive elements.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// Electric Button Wrapper - Default
const ElectricButtonDefault = () => (
  <div style={{ padding: '48px' }}>
    <h3 style={{ marginBottom: '24px', fontSize: '18px', fontWeight: '600' }}>Hover to see the effect</h3>
    <ElectricButtonWrapper>
      <button
        style={{
          padding: '12px 32px',
          background: COLORS.teal,
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          fontSize: '14px',
          fontWeight: '500',
          cursor: 'pointer',
          fontFamily: 'Fixel, system-ui, sans-serif',
        }}
      >
        Get Started
      </button>
    </ElectricButtonWrapper>
  </div>
);

export const ElectricButtonDefaultStory: Story = {
  name: 'Electric Button - Default',
  render: () => <ElectricButtonDefault />,
};

// Electric Button - Always Active
const ElectricButtonActive = () => (
  <div style={{ padding: '48px' }}>
    <h3 style={{ marginBottom: '24px', fontSize: '18px', fontWeight: '600' }}>Always active (no hover needed)</h3>
    <ElectricButtonWrapper isActive={true}>
      <button
        style={{
          padding: '12px 32px',
          background: COLORS.dark,
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          fontSize: '14px',
          fontWeight: '500',
          cursor: 'pointer',
          fontFamily: 'Fixel, system-ui, sans-serif',
        }}
      >
        Contact Us
      </button>
    </ElectricButtonWrapper>
  </div>
);

export const ElectricButtonActiveStory: Story = {
  name: 'Electric Button - Always Active',
  render: () => <ElectricButtonActive />,
};

// Multiple Buttons
const MultipleButtons = () => (
  <div style={{ padding: '48px', display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
    <ElectricButtonWrapper>
      <button
        style={{
          padding: '12px 32px',
          background: COLORS.teal,
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          fontSize: '14px',
          fontWeight: '500',
          cursor: 'pointer',
        }}
      >
        Primary Action
      </button>
    </ElectricButtonWrapper>

    <ElectricButtonWrapper>
      <button
        style={{
          padding: '12px 32px',
          background: COLORS.dark,
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          fontSize: '14px',
          fontWeight: '500',
          cursor: 'pointer',
        }}
      >
        Secondary Action
      </button>
    </ElectricButtonWrapper>

    <ElectricButtonWrapper>
      <button
        style={{
          padding: '12px 32px',
          background: COLORS.ferrariRed,
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          fontSize: '14px',
          fontWeight: '500',
          cursor: 'pointer',
        }}
      >
        Destructive Action
      </button>
    </ElectricButtonWrapper>
  </div>
);

export const MultipleButtonsStory: Story = {
  name: 'Multiple Buttons',
  render: () => <MultipleButtons />,
};

// Glass Input Wrapper
const GlassInputExample = () => (
  <div style={{ padding: '48px', width: '400px' }}>
    <h3 style={{ marginBottom: '24px', fontSize: '18px', fontWeight: '600' }}>Click to focus</h3>
    <div style={{ marginBottom: '24px' }}>
      <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: COLORS.dark }}>
        Email Address
      </label>
      <GlassInputWrapper>
        <Input type="email" placeholder="you@example.com" />
      </GlassInputWrapper>
    </div>
    <div>
      <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: COLORS.dark }}>
        Password
      </label>
      <GlassInputWrapper>
        <Input type="password" placeholder="••••••••" />
      </GlassInputWrapper>
    </div>
  </div>
);

export const GlassInputExampleStory: Story = {
  name: 'Glass Input Effect',
  render: () => <GlassInputExample />,
};

// Combined Form
const CombinedForm = () => (
  <div style={{ padding: '48px', width: '500px' }}>
    <div style={{
      background: COLORS.cream,
      border: `1px dashed ${COLORS.slate}`,
      borderRadius: '8px',
      padding: '32px',
    }}>
      <h3 style={{ fontSize: '20px', fontWeight: '700', color: COLORS.dark, marginBottom: '24px' }}>
        Contact Form with Glass Effects
      </h3>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: COLORS.dark }}>
          Name
        </label>
        <GlassInputWrapper>
          <Input placeholder="John Doe" />
        </GlassInputWrapper>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: COLORS.dark }}>
          Email
        </label>
        <GlassInputWrapper>
          <Input type="email" placeholder="john@example.com" />
        </GlassInputWrapper>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: COLORS.dark }}>
          Company
        </label>
        <GlassInputWrapper>
          <Input placeholder="Acme Corp" />
        </GlassInputWrapper>
      </div>

      <ElectricButtonWrapper className="w-full">
        <button
          style={{
            width: '100%',
            padding: '12px',
            background: COLORS.teal,
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
          }}
        >
          Submit Form
        </button>
      </ElectricButtonWrapper>
    </div>
  </div>
);

export const CombinedFormStory: Story = {
  name: 'Combined Form Example',
  render: () => <CombinedForm />,
};
