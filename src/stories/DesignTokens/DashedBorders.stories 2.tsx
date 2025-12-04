import type { Meta, StoryObj } from '@storybook/react';
import { COLORS } from '../../constants/designTokens';

const meta = {
  title: 'Design Tokens/Dashed Borders',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Custom dashed border pattern (4px dash, 4px gap) - a signature design element of Disrupt.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// Dashed Border Examples
const DashedBorderExamples = () => (
  <div>
    <h2 style={{ marginBottom: '24px', fontSize: '24px', fontWeight: '700' }}>Dashed Border Pattern</h2>
    <p style={{ fontSize: '16px', color: COLORS.text.secondary, marginBottom: '32px', maxWidth: '600px' }}>
      The Disrupt design system uses a custom 4px-4px dashed border pattern for a distinctive, stitched appearance.
    </p>

    <div style={{ display: 'grid', gap: '32px' }}>
      {/* Slate Dashed */}
      <div>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Slate Dashed (Default)</h3>
        <div
          style={{
            width: '400px',
            height: '120px',
            background: COLORS.surface,
            border: '1px dashed #CBD5E1',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span style={{ fontSize: '14px', color: COLORS.text.secondary }}>border-dashed border-slate-300</span>
        </div>
        <div style={{ marginTop: '8px', fontSize: '13px', fontFamily: 'monospace', color: COLORS.text.disabled }}>
          border: 1px dashed #CBD5E1
        </div>
      </div>

      {/* Teal Dashed */}
      <div>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Teal Dashed (Highlighted)</h3>
        <div
          style={{
            width: '400px',
            height: '120px',
            background: COLORS.surface,
            border: `1px dashed ${COLORS.teal[500]}`,
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: COLORS.shadow?.lg || '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          }}
        >
          <span style={{ fontSize: '14px', color: COLORS.text.secondary }}>border-dashed border-teal</span>
        </div>
        <div style={{ marginTop: '8px', fontSize: '13px', fontFamily: 'monospace', color: COLORS.text.disabled }}>
          border: 1px dashed {COLORS.teal[500]}
        </div>
      </div>

      {/* All Sides */}
      <div>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Pricing Card Example</h3>
        <div
          style={{
            width: '350px',
            background: COLORS.surface,
            border: `1px dashed ${COLORS.dark[200]}`,
            borderRadius: '8px',
            padding: '24px',
          }}
        >
          <h4 style={{ fontSize: '20px', fontWeight: '700', color: COLORS.text.primary, marginBottom: '8px' }}>
            Pro Plan
          </h4>
          <p style={{ fontSize: '14px', color: COLORS.text.secondary, marginBottom: '16px' }}>
            Perfect for growing teams
          </p>
          <div style={{ marginBottom: '16px' }}>
            <span style={{ fontSize: '36px', fontWeight: '700', fontFamily: 'Pilat Extended, Arial, sans-serif', color: COLORS.text.primary }}>
              $29
            </span>
            <span style={{ fontSize: '16px', color: COLORS.text.secondary }}>/month</span>
          </div>
          <button
            style={{
              width: '100%',
              padding: '12px',
              background: COLORS.teal[800],
              color: COLORS.text.inverse,
              border: 'none',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
            }}
          >
            Get Started
          </button>
        </div>
      </div>

      {/* Custom Dashed Border Utility Classes */}
      <div>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Custom Dashed Border Utilities</h3>
        <div style={{
          background: COLORS.surface,
          border: `1px dashed ${COLORS.dark[200]}`,
          borderRadius: '8px',
          padding: '24px',
        }}>
          <p style={{ fontSize: '14px', color: COLORS.text.secondary, marginBottom: '16px', lineHeight: '1.6' }}>
            The design system includes custom CSS utilities for precise 4px-4px dashed borders:
          </p>
          <div style={{ fontFamily: 'monospace', fontSize: '13px', color: COLORS.text.primary, lineHeight: '2' }}>
            <div>• <code>border-custom-dash</code> - All sides</div>
            <div>• <code>border-custom-dash-t</code> - Top only</div>
            <div>• <code>border-custom-dash-b</code> - Bottom only</div>
            <div>• <code>border-custom-dash-left</code> - Left only</div>
            <div>• <code>border-custom-dash-right</code> - Right only</div>
            <div>• <code>border-dashed-sides</code> - Left and right</div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const DashedBorderExamplesStory: Story = {
  name: 'Dashed Border Examples',
  render: () => <DashedBorderExamples />,
};

// Dashed Border Variations
const DashedBorderVariations = () => (
  <div>
    <h2 style={{ marginBottom: '24px', fontSize: '24px', fontWeight: '700' }}>Dashed Border Variations</h2>

    <div style={{ display: 'grid', gap: '24px' }}>
      <div
        className="border-custom-dash"
        style={{
          width: '300px',
          height: '100px',
          background: COLORS.surface,
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{ fontSize: '14px', color: COLORS.text.secondary }}>border-custom-dash</span>
      </div>

      <div
        className="border-custom-dash-t"
        style={{
          width: '300px',
          height: '100px',
          background: COLORS.surface,
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{ fontSize: '14px', color: COLORS.text.secondary }}>border-custom-dash-t</span>
      </div>

      <div
        className="border-custom-dash-b"
        style={{
          width: '300px',
          height: '100px',
          background: COLORS.surface,
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{ fontSize: '14px', color: COLORS.text.secondary }}>border-custom-dash-b</span>
      </div>

      <div
        className="border-dashed-sides"
        style={{
          width: '300px',
          height: '100px',
          background: COLORS.surface,
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{ fontSize: '14px', color: COLORS.text.secondary }}>border-dashed-sides</span>
      </div>
    </div>
  </div>
);

export const DashedBorderVariationsStory: Story = {
  name: 'Dashed Border Variations',
  render: () => <DashedBorderVariations />,
};
