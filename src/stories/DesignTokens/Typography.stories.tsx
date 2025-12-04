import type { Meta, StoryObj } from '@storybook/react';
import { TYPOGRAPHY } from '../../constants/designTokens';

const meta = {
  title: 'Design Tokens/Typography',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Typography system showcasing Pilat Extended (display) and Fixel (body/UI) fonts with comprehensive type scales, weights, and spacing.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// Font Families Component
const FontFamilies = () => (
  <div>
    <h2 style={{ marginBottom: '32px', fontSize: '24px', fontWeight: '700' }}>Font Families</h2>

    <div style={{ marginBottom: '48px' }}>
      <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Pilat Extended (Display)</h3>
      <p style={{ fontSize: '14px', color: '#5E4F7E', marginBottom: '16px' }}>
        Used for headings, hero text, and display elements
      </p>
      <div style={{
        fontFamily: TYPOGRAPHY.fontFamily.display,
        fontSize: '48px',
        fontWeight: 'bold',
        color: '#2D3142',
        marginBottom: '16px'
      }}>
        Disrupt Inc.
      </div>
      <div style={{
        fontFamily: TYPOGRAPHY.fontFamily.display,
        fontSize: '36px',
        color: '#2D3142'
      }}>
        Effortless Action
      </div>
    </div>

    <div style={{ marginBottom: '48px' }}>
      <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Fixel (Body & UI)</h3>
      <p style={{ fontSize: '14px', color: '#5E4F7E', marginBottom: '16px' }}>
        Used for body text, UI components, and interactive elements
      </p>
      <div style={{ fontFamily: TYPOGRAPHY.fontFamily.sans, fontSize: '18px', color: '#2D3142', marginBottom: '12px' }}>
        Fixel is our primary body font, designed for optimal readability at all sizes.
      </div>
      <div style={{ fontFamily: TYPOGRAPHY.fontFamily.sans, fontSize: '16px', fontWeight: '400', color: '#2D3142', marginBottom: '8px' }}>
        Regular (400): Standard body text
      </div>
      <div style={{ fontFamily: TYPOGRAPHY.fontFamily.sans, fontSize: '16px', fontWeight: '500', color: '#2D3142', marginBottom: '8px' }}>
        Medium (500): UI labels and emphasis
      </div>
      <div style={{ fontFamily: TYPOGRAPHY.fontFamily.sans, fontSize: '16px', fontWeight: '700', color: '#2D3142' }}>
        Bold (700): Strong emphasis
      </div>
    </div>
  </div>
);

export const FontFamiliesStory: Story = {
  name: 'Font Families',
  render: () => <FontFamilies />,
};

// Font Sizes Component
const FontSizes = () => {
  const sizes = [
    { name: '9xl', size: TYPOGRAPHY.fontSize['9xl'], usage: 'Extra large hero text' },
    { name: '8xl', size: TYPOGRAPHY.fontSize['8xl'], usage: 'Hero headings' },
    { name: '7xl', size: TYPOGRAPHY.fontSize['7xl'], usage: 'Large headings' },
    { name: '6xl', size: TYPOGRAPHY.fontSize['6xl'], usage: 'Section headings' },
    { name: '5xl', size: TYPOGRAPHY.fontSize['5xl'], usage: 'Page titles' },
    { name: '4xl', size: TYPOGRAPHY.fontSize['4xl'], usage: 'Major headings (h1)' },
    { name: '3xl', size: TYPOGRAPHY.fontSize['3xl'], usage: 'Subheadings (h2)' },
    { name: '2xl', size: TYPOGRAPHY.fontSize['2xl'], usage: 'Section titles (h3)' },
    { name: 'xl', size: TYPOGRAPHY.fontSize.xl, usage: 'Large body text' },
    { name: 'lg', size: TYPOGRAPHY.fontSize.lg, usage: 'Lead paragraphs' },
    { name: 'base', size: TYPOGRAPHY.fontSize.base, usage: 'Body text (default)' },
    { name: 'sm', size: TYPOGRAPHY.fontSize.sm, usage: 'Small UI text' },
    { name: 'xs', size: TYPOGRAPHY.fontSize.xs, usage: 'Captions, labels' },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: '24px', fontSize: '24px', fontWeight: '700' }}>Font Sizes</h2>
      {sizes.map(({ name, size, usage }) => (
        <div
          key={name}
          style={{
            marginBottom: '16px',
            paddingBottom: '16px',
            borderBottom: '1px solid #E8EAED'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px', marginBottom: '8px' }}>
            <span style={{ fontSize: '14px', fontWeight: '600', minWidth: '60px' }}>{name}</span>
            <span style={{ fontSize: '14px', color: '#5E4F7E', minWidth: '50px' }}>{size}</span>
            <span style={{ fontSize: size, color: '#2D3142' }}>The quick brown fox</span>
          </div>
          <div style={{ fontSize: '12px', color: '#9FA5B0', paddingLeft: '126px' }}>
            {usage}
          </div>
        </div>
      ))}
    </div>
  );
};

export const FontSizesStory: Story = {
  name: 'Font Sizes',
  render: () => <FontSizes />,
};

// Font Weights Component
const FontWeights = () => {
  const weights = [
    { name: 'thin', weight: TYPOGRAPHY.fontWeight.thin },
    { name: 'extralight', weight: TYPOGRAPHY.fontWeight.extralight },
    { name: 'light', weight: TYPOGRAPHY.fontWeight.light },
    { name: 'normal', weight: TYPOGRAPHY.fontWeight.normal },
    { name: 'medium', weight: TYPOGRAPHY.fontWeight.medium },
    { name: 'semibold', weight: TYPOGRAPHY.fontWeight.semibold },
    { name: 'bold', weight: TYPOGRAPHY.fontWeight.bold },
    { name: 'extrabold', weight: TYPOGRAPHY.fontWeight.extrabold },
    { name: 'black', weight: TYPOGRAPHY.fontWeight.black },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: '24px', fontSize: '24px', fontWeight: '700' }}>Font Weights</h2>
      {weights.map(({ name, weight }) => (
        <div
          key={name}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '12px',
            paddingBottom: '12px',
            borderBottom: '1px solid #E8EAED'
          }}
        >
          <span style={{ fontSize: '14px', fontWeight: '600', minWidth: '100px' }}>{name}</span>
          <span style={{ fontSize: '14px', color: '#5E4F7E', minWidth: '50px' }}>{weight}</span>
          <span style={{ fontSize: '18px', fontWeight: weight, fontFamily: TYPOGRAPHY.fontFamily.sans }}>
            The quick brown fox jumps over the lazy dog
          </span>
        </div>
      ))}
    </div>
  );
};

export const FontWeightsStory: Story = {
  name: 'Font Weights',
  render: () => <FontWeights />,
};

// Line Heights Component
const LineHeights = () => {
  const lineHeights = [
    { name: 'none', value: TYPOGRAPHY.lineHeight.none, usage: 'Very tight spacing' },
    { name: 'tight', value: TYPOGRAPHY.lineHeight.tight, usage: 'Headlines' },
    { name: 'snug', value: TYPOGRAPHY.lineHeight.snug, usage: 'Subheadings' },
    { name: 'normal', value: TYPOGRAPHY.lineHeight.normal, usage: 'Body text (default)' },
    { name: 'relaxed', value: TYPOGRAPHY.lineHeight.relaxed, usage: 'Comfortable reading' },
    { name: 'loose', value: TYPOGRAPHY.lineHeight.loose, usage: 'Very spacious' },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: '24px', fontSize: '24px', fontWeight: '700' }}>Line Heights</h2>
      {lineHeights.map(({ name, value, usage }) => (
        <div
          key={name}
          style={{
            marginBottom: '24px',
            paddingBottom: '24px',
            borderBottom: '1px solid #E8EAED'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
            <span style={{ fontSize: '14px', fontWeight: '600', minWidth: '80px' }}>{name}</span>
            <span style={{ fontSize: '14px', color: '#5E4F7E', minWidth: '50px' }}>{value}</span>
            <span style={{ fontSize: '12px', color: '#9FA5B0' }}>{usage}</span>
          </div>
          <p style={{
            fontFamily: TYPOGRAPHY.fontFamily.sans,
            fontSize: '16px',
            lineHeight: value,
            margin: 0,
            maxWidth: '600px'
          }}>
            The quick brown fox jumps over the lazy dog. Typography is the art and technique of arranging type to make written language legible, readable, and appealing when displayed.
          </p>
        </div>
      ))}
    </div>
  );
};

export const LineHeightsStory: Story = {
  name: 'Line Heights',
  render: () => <LineHeights />,
};

// Heading Hierarchy Component
const HeadingHierarchy = () => (
  <div style={{ maxWidth: '800px' }}>
    <h2 style={{ marginBottom: '32px', fontSize: '24px', fontWeight: '700' }}>Heading Hierarchy</h2>

    <h1 style={{
      fontFamily: TYPOGRAPHY.fontFamily.display,
      fontSize: TYPOGRAPHY.fontSize['4xl'],
      fontWeight: 'bold',
      color: '#2D3142',
      marginBottom: '16px',
      lineHeight: TYPOGRAPHY.lineHeight.tight
    }}>
      H1: Effortless Action
    </h1>

    <h2 style={{
      fontFamily: TYPOGRAPHY.fontFamily.display,
      fontSize: TYPOGRAPHY.fontSize['3xl'],
      fontWeight: 'bold',
      color: '#2D3142',
      marginBottom: '16px',
      lineHeight: TYPOGRAPHY.lineHeight.tight
    }}>
      H2: Strategic Advisory Services
    </h2>

    <h3 style={{
      fontFamily: TYPOGRAPHY.fontFamily.sans,
      fontSize: TYPOGRAPHY.fontSize['2xl'],
      fontWeight: '700',
      color: '#2D3142',
      marginBottom: '16px',
      lineHeight: TYPOGRAPHY.lineHeight.snug
    }}>
      H3: Our Approach to Innovation
    </h3>

    <h4 style={{
      fontFamily: TYPOGRAPHY.fontFamily.sans,
      fontSize: TYPOGRAPHY.fontSize.xl,
      fontWeight: '600',
      color: '#2D3142',
      marginBottom: '16px',
      lineHeight: TYPOGRAPHY.lineHeight.snug
    }}>
      H4: Key Features and Benefits
    </h4>

    <p style={{
      fontFamily: TYPOGRAPHY.fontFamily.sans,
      fontSize: TYPOGRAPHY.fontSize.base,
      fontWeight: '400',
      color: '#5E4F7E',
      lineHeight: TYPOGRAPHY.lineHeight.normal,
      marginBottom: '16px'
    }}>
      Body: This is the standard body text used throughout the application. It maintains excellent readability with Fixel's clean letterforms and comfortable line height.
    </p>

    <p style={{
      fontFamily: TYPOGRAPHY.fontFamily.sans,
      fontSize: TYPOGRAPHY.fontSize.sm,
      fontWeight: '400',
      color: '#9FA5B0',
      lineHeight: TYPOGRAPHY.lineHeight.normal
    }}>
      Small: Used for captions, metadata, and secondary information.
    </p>
  </div>
);

export const HeadingHierarchyStory: Story = {
  name: 'Heading Hierarchy',
  render: () => <HeadingHierarchy />,
};

// Usage Guidelines Component
const UsageGuidelines = () => (
  <div style={{ maxWidth: '800px' }}>
    <h2 style={{ marginBottom: '24px', fontSize: '24px', fontWeight: '700' }}>Usage Guidelines</h2>

    <div style={{ marginBottom: '32px' }}>
      <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>When to Use Pilat Extended</h3>
      <ul style={{ fontSize: '16px', lineHeight: '1.6', color: '#2D3142' }}>
        <li>Hero sections with large display text</li>
        <li>Page headings (H1 and H2)</li>
        <li>Section titles and major dividers</li>
        <li>Call-to-action emphasis</li>
      </ul>
    </div>

    <div style={{ marginBottom: '32px' }}>
      <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>When to Use Fixel</h3>
      <ul style={{ fontSize: '16px', lineHeight: '1.6', color: '#2D3142' }}>
        <li>All paragraph and long-form content</li>
        <li>UI elements (buttons, forms, labels, navigation)</li>
        <li>Subheadings (H3, H4, and below)</li>
        <li>Data display (tables, lists, structured information)</li>
      </ul>
    </div>

    <div style={{ marginBottom: '32px' }}>
      <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>Best Practices</h3>
      <ol style={{ fontSize: '16px', lineHeight: '1.6', color: '#2D3142' }}>
        <li>Maintain clear visual hierarchy with size and weight</li>
        <li>Keep body text between 50-75 characters per line</li>
        <li>Ensure 4.5:1 contrast ratio minimum (WCAG AA)</li>
        <li>Scale font sizes appropriately for mobile</li>
        <li>Pair Pilat Extended Bold with Fixel Regular for balance</li>
      </ol>
    </div>

    <div style={{
      background: '#F7F8F9',
      padding: '16px',
      borderRadius: '8px',
      fontSize: '14px',
      lineHeight: '1.6'
    }}>
      <strong>Tailwind Classes:</strong>
      <br />
      <code>font-display</code> → Pilat Extended
      <br />
      <code>font-sans</code> → Fixel
      <br />
      <code>text-4xl</code> → 36px
      <br />
      <code>font-bold</code> → 700
    </div>
  </div>
);

export const UsageGuidelinesStory: Story = {
  name: 'Usage Guidelines',
  render: () => <UsageGuidelines />,
};
