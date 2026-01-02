/**
 * Documentation Components Demo
 * Showcases all DDS documentation blocks inspired by Vibe Design System
 */
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import {
  ComponentRules,
  RelatedComponents,
  AlphaWarning,
  DeprecatedWarning,
  StableNotice,
  FrozenNotice,
  CompositionGuide,
  ComponentName,
  SectionName,
  SubsectionName,
  SubSubsectionName,
} from './documentation';

const meta: Meta = {
  title: 'Developers/Documentation Components',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Reusable documentation blocks for Storybook MDX pages. Inspired by Vibe Design System but tailored for DDS constraint philosophy.',
      },
    },
  },
};

export default meta;

// =============================================================================
// COMPONENT RULES - Live Do/Don't Examples
// =============================================================================

export const ComponentRulesDemo: StoryObj = {
  name: 'ComponentRules',
  render: () => (
    <div className="max-w-4xl">
      <h2 className="text-xl font-semibold mb-4">ComponentRules</h2>
      <p className="text-slate-600 mb-6">
        Show live Do/Don't examples with actual rendered components. Unlike text-only
        guidelines, developers SEE exactly what's correct vs incorrect.
      </p>

      <ComponentRules
        title="Button Labels"
        rules={[
          {
            do: {
              component: <Button>Save</Button>,
              description: 'Keep button text concise (1-2 words)',
            },
            dont: {
              component: <Button>Click here to save your changes</Button>,
              description: "Avoid verbose labels that don't fit the button",
            },
          },
          {
            do: {
              component: <Button variant="destructive">Delete</Button>,
              description: 'Use destructive variant for dangerous actions',
            },
            dont: {
              component: <Button>Delete permanently</Button>,
              description: "Don't use default variant for destructive actions",
            },
          },
        ]}
      />
    </div>
  ),
};

// =============================================================================
// RELATED COMPONENTS - Navigation Links
// =============================================================================

export const RelatedComponentsDemo: StoryObj = {
  name: 'RelatedComponents',
  render: () => (
    <div className="max-w-4xl">
      <h2 className="text-xl font-semibold mb-4">RelatedComponents</h2>
      <p className="text-slate-600 mb-6">
        Navigation links to related documentation. Helps users discover the component
        ecosystem and find related patterns.
      </p>

      <RelatedComponents components={['Button', 'Badge', 'Checkbox', 'Toggle']} />

      <RelatedComponents
        components={['Typography', 'Colors', 'Spacing']}
        title="Related Foundations"
      />
    </div>
  ),
};

// =============================================================================
// STATUS WARNINGS - Component Maturity Indicators
// =============================================================================

export const StatusWarningsDemo: StoryObj = {
  name: 'Status Warnings',
  render: () => (
    <div className="max-w-4xl space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-4">Status Warnings</h2>
        <p className="text-slate-600 mb-6">
          Communicate component maturity level clearly. Each status has distinct visual
          treatment to set appropriate expectations.
        </p>
      </div>

      <div>
        <h3 className="text-base font-medium mb-3 text-slate-700">Alpha (Experimental)</h3>
        <AlphaWarning />
        <AlphaWarning message="Custom message: This API is under active development and will change." />
      </div>

      <div>
        <h3 className="text-base font-medium mb-3 text-slate-700">Deprecated (Migration Required)</h3>
        <DeprecatedWarning alternative="NewDialog" alternativeLink="Core/Dialog" />
        <DeprecatedWarning alternative="AppCard" />
      </div>

      <div>
        <h3 className="text-base font-medium mb-3 text-slate-700">Stable (Production Ready)</h3>
        <StableNotice />
        <StableNotice since="v2.1.0" />
      </div>

      <div>
        <h3 className="text-base font-medium mb-3 text-slate-700">Frozen (Bug Fixes Only)</h3>
        <FrozenNotice />
        <FrozenNotice reason="Website redesign scheduled for Q2. No new features until then." />
      </div>
    </div>
  ),
};

// =============================================================================
// COMPOSITION GUIDE - DDS Constraint Enforcement
// =============================================================================

export const CompositionGuideDemo: StoryObj = {
  name: 'CompositionGuide',
  render: () => (
    <div className="max-w-4xl">
      <h2 className="text-xl font-semibold mb-4">CompositionGuide</h2>
      <p className="text-slate-600 mb-6">
        DDS constraint enforcement. Shows "this is THE way" messaging with approved
        composition preview. Used to discourage custom variants.
      </p>

      <CompositionGuide
        component={
          <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-slate-200">
            <div className="w-10 h-10 rounded-full bg-deep-current-100 flex items-center justify-center text-deep-current-600 font-semibold">
              AC
            </div>
            <div>
              <div className="font-medium text-abyss-500">Acme Corporation</div>
              <div className="text-sm text-slate-500">Gold Partner</div>
            </div>
            <Badge variant="default" className="ml-auto">
              Active
            </Badge>
          </div>
        }
        message="Use the standard PartnerRow component. Do not create custom row layouts for partner tables."
      />

      <CompositionGuide
        title="Standard Button Group"
        component={
          <div className="flex gap-3">
            <Button variant="outline">Cancel</Button>
            <Button>Save Changes</Button>
          </div>
        }
        message="Dialog footers use this exact pattern: Cancel (outline) on left, Primary action on right."
        contactInfo="Submit a design request if you need a different button arrangement."
      />
    </div>
  ),
};

// =============================================================================
// MDX HEADINGS - Automatic Mapping Preview
// =============================================================================

export const MDXHeadingsDemo: StoryObj = {
  name: 'MDX Headings',
  render: () => (
    <div className="max-w-4xl">
      <h2 className="text-xl font-semibold mb-4">MDX Headings (Auto-Mapped)</h2>
      <p className="text-slate-600 mb-6">
        These headings are automatically applied to all MDX files via preview.ts mapping.
        Write standard markdown (#, ##, ###) and get DDS-styled headings.
      </p>

      <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 space-y-6">
        <div>
          <code className="text-xs text-slate-500 mb-1 block"># in MDX → h1</code>
          <ComponentName>Component Name</ComponentName>
        </div>

        <div>
          <code className="text-xs text-slate-500 mb-1 block">## in MDX → h2</code>
          <SectionName>Section Name</SectionName>
        </div>

        <div>
          <code className="text-xs text-slate-500 mb-1 block">### in MDX → h3</code>
          <SubsectionName>Subsection Name</SubsectionName>
        </div>

        <div>
          <code className="text-xs text-slate-500 mb-1 block">#### in MDX → h4</code>
          <SubSubsectionName>Sub-Subsection Name</SubSubsectionName>
        </div>
      </div>
    </div>
  ),
};

// =============================================================================
// FULL EXAMPLE - Component Documentation Page
// =============================================================================

export const FullDocumentationExample: StoryObj = {
  name: 'Full Documentation Page',
  render: () => (
    <div className="max-w-4xl">
      <AlphaWarning />

      <ComponentName>CustomButton</ComponentName>
      <p className="text-slate-600 mb-8">
        A specialized button variant for specific use cases. This component extends the
        base Button with additional functionality.
      </p>

      <SectionName>Usage Guidelines</SectionName>
      <ComponentRules
        title="When to Use"
        rules={[
          {
            do: {
              component: <Button variant="accent">Primary Action</Button>,
              description: 'Use accent variant for the primary call-to-action',
            },
            dont: {
              component: (
                <div className="flex gap-2">
                  <Button variant="accent">Save</Button>
                  <Button variant="accent">Cancel</Button>
                </div>
              ),
              description: "Don't use multiple accent buttons in the same context",
            },
          },
        ]}
      />

      <SectionName>Variants</SectionName>
      <SubsectionName>Size Options</SubsectionName>
      <div className="flex gap-3 items-center mb-6">
        <Button size="sm">Small</Button>
        <Button size="default">Default</Button>
        <Button size="lg">Large</Button>
      </div>

      <SubsectionName>Visual Styles</SubsectionName>
      <div className="flex gap-3 items-center mb-6">
        <Button variant="default">Default</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
      </div>

      <SectionName>Approved Composition</SectionName>
      <CompositionGuide
        component={
          <div className="flex gap-3">
            <Button variant="outline">Cancel</Button>
            <Button variant="accent">Submit</Button>
          </div>
        }
        message="Form submissions use this exact button arrangement. Primary action on right."
      />

      <RelatedComponents components={['Button', 'Badge', 'Dialog']} />
    </div>
  ),
};
