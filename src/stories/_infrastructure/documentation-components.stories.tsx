/**
 * Documentation Components Demo
 * Showcases all DDS documentation blocks for two patterns:
 *
 * PATTERN A: Conceptual Documentation (Philosophy, Guides, Architecture)
 * - Uses: BrandHero, InfoBox, SectionHeader, FeatureCard, GuidelineCard
 * - For: Foundation docs, developer guides, conceptual explanations
 *
 * PATTERN B: Component Documentation (Button, Card, Dialog)
 * - Uses: ComponentName, SectionName, ComponentRules, CompositionGuide, RelatedComponents
 * - For: Component API docs, usage guidelines, live examples
 */
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import {
  BookOpen,
  Compass,
  Feather,
  Heart,
  Layers,
  Lightbulb,
  Sparkles,
  Target,
  Users,
  Zap,
} from 'lucide-react';
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
import {
  BrandHero,
  InfoBox,
  SectionHeader,
  FeatureCard,
  GuidelineCard,
  DEEP_CURRENT,
  DUSK_REEF,
  PRIMITIVES,
  RADIUS,
  SLATE,
  SPACING,
} from '../brand/BrandComponents';

const meta: Meta = {
  title: 'Developers/Documentation Components',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Reusable documentation blocks for Storybook MDX pages. DDS uses two documentation patterns: Pattern A (Conceptual) for philosophy, guides, and architecture docs using BrandHero, InfoBox, SectionHeader, FeatureCard, GuidelineCard; Pattern B (Component) for component API docs using ComponentName, SectionName, ComponentRules, CompositionGuide, RelatedComponents.',
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

// =============================================================================
// PATTERN A: CONCEPTUAL DOCUMENTATION COMPONENTS
// =============================================================================

// -----------------------------------------------------------------------------
// BrandHero - Page Header for Conceptual Documentation
// -----------------------------------------------------------------------------

export const BrandHeroDemo: StoryObj = {
  name: 'Pattern A: BrandHero',
  render: () => (
    <div className="max-w-4xl">
      <h2 className="text-xl font-semibold mb-4">BrandHero</h2>
      <p className="text-slate-600 mb-6">
        The primary header component for conceptual documentation pages. Features animated
        particles, gradient backgrounds, and optional decorative icons. Use this at the top
        of every conceptual documentation page.
      </p>

      <div className="space-y-8">
        <div>
          <h3 className="text-base font-medium mb-3 text-slate-700">Primary Gradient (Default)</h3>
          <BrandHero
            title="Design Philosophy"
            description="Core principles that guide the Disrupt Design System architecture and development approach."
            gradient="primary"
            decorativeIcon={<Compass size={180} color={PRIMITIVES.white} strokeWidth={1} />}
          />
        </div>

        <div>
          <h3 className="text-base font-medium mb-3 text-slate-700">Teal Gradient</h3>
          <BrandHero
            title="Agent Rules & Guidelines"
            description="Comprehensive documentation of all DDS development rules for AI agents."
            gradient="teal"
            decorativeIcon={<Target size={180} color={PRIMITIVES.white} strokeWidth={1} />}
          />
        </div>

        <div>
          <h3 className="text-base font-medium mb-3 text-slate-700">Purple Gradient</h3>
          <BrandHero
            title="Quality of Engagement"
            description="How to approach development with curiosity rather than force."
            gradient="purple"
            decorativeIcon={<Heart size={180} color={PRIMITIVES.white} strokeWidth={1} />}
          />
        </div>
      </div>
    </div>
  ),
};

// -----------------------------------------------------------------------------
// InfoBox - Callouts and Tips
// -----------------------------------------------------------------------------

export const InfoBoxDemo: StoryObj = {
  name: 'Pattern A: InfoBox',
  render: () => (
    <div className="max-w-4xl">
      <h2 className="text-xl font-semibold mb-4">InfoBox</h2>
      <p className="text-slate-600 mb-6">
        Callout boxes for tips, information, and warnings. Place immediately after BrandHero
        for key context, or throughout the document for important notes.
      </p>

      <div className="space-y-4">
        <div>
          <h3 className="text-base font-medium mb-3 text-slate-700">Tip (Purple - Primary for Conceptual Docs)</h3>
          <InfoBox variant="tip">
            <strong>For Agents, Not Humans.</strong> These philosophies guide AI agent behavior
            when working on the DDS codebase. Agents that follow these principles produce
            higher quality, more maintainable code.
          </InfoBox>
        </div>

        <div>
          <h3 className="text-base font-medium mb-3 text-slate-700">Info (Teal)</h3>
          <InfoBox variant="info">
            <strong>Source of Truth.</strong> These rules live in the <code>.claude/</code> folder
            and are automatically loaded by AI agents when working on DDS.
          </InfoBox>
        </div>

        <div>
          <h3 className="text-base font-medium mb-3 text-slate-700">Warning (Coral - Use Sparingly)</h3>
          <InfoBox variant="warning">
            <strong>Breaking Change.</strong> This API will change in the next major version.
            Migrate to the new pattern before upgrading.
          </InfoBox>
        </div>
      </div>
    </div>
  ),
};

// -----------------------------------------------------------------------------
// SectionHeader - Subsection Introductions
// -----------------------------------------------------------------------------

export const SectionHeaderDemo: StoryObj = {
  name: 'Pattern A: SectionHeader',
  render: () => (
    <div className="max-w-4xl">
      <h2 className="text-xl font-semibold mb-4">SectionHeader</h2>
      <p className="text-slate-600 mb-6">
        Icon + title + description for introducing subsections. Use after h2 headings to
        provide context before diving into content.
      </p>

      <div className="space-y-6">
        <SectionHeader
          icon={<Feather size={20} />}
          title="Work WITH the Codebase"
          description="Agents that work with the codebase produce better results than agents that fight it."
        />

        <SectionHeader
          icon={<Target size={20} />}
          title="Build UI for HUMANS"
          description="When agents build UI, keep it familiar to users. Innovate visually, keep interactions stable."
        />

        <SectionHeader
          icon={<Heart size={20} />}
          title="Engage Curiously, Don't Force"
          description="Force creates resistance. Curiosity creates flow. Agents work better when engaged, not forcing."
        />
      </div>
    </div>
  ),
};

// -----------------------------------------------------------------------------
// FeatureCard - Feature Grids
// -----------------------------------------------------------------------------

export const FeatureCardDemo: StoryObj = {
  name: 'Pattern A: FeatureCard',
  render: () => (
    <div className="max-w-4xl">
      <h2 className="text-xl font-semibold mb-4">FeatureCard</h2>
      <p className="text-slate-600 mb-6">
        Cards for displaying features, tools, or concepts in a grid layout. Use for
        navigation to related pages or to showcase capabilities.
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: SPACING.px.comfortable,
      }}>
        <FeatureCard
          icon={<Layers size={24} color={DEEP_CURRENT[600]} />}
          title="Design Tokens"
          description="Two-tier token system with PRIMITIVES and ALIAS for semantic color usage."
          link="/docs/foundation-design-tokens-overview--docs"
        />
        <FeatureCard
          icon={<Sparkles size={24} color={DEEP_CURRENT[600]} />}
          title="Components"
          description="67+ shared components built with accessibility and consistency in mind."
          link="/docs/core-button--docs"
        />
        <FeatureCard
          icon={<Users size={24} color={DEEP_CURRENT[600]} />}
          title="MCP Integration"
          description="13 AI tools for validating colors, checking contrast, and recommending tokens."
          link="/docs/developers-mcp--docs"
        />
      </div>
    </div>
  ),
};

// -----------------------------------------------------------------------------
// GuidelineCard - Do/Don't Pairs
// -----------------------------------------------------------------------------

export const GuidelineCardDemo: StoryObj = {
  name: 'Pattern A: GuidelineCard',
  render: () => (
    <div className="max-w-4xl">
      <h2 className="text-xl font-semibold mb-4">GuidelineCard</h2>
      <p className="text-slate-600 mb-6">
        Do/Don't cards for text-based guidelines. Use in 2-column grids to show contrasting
        approaches. For live component examples, use ComponentRules instead.
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: SPACING.px.comfortable,
      }}>
        <GuidelineCard type="do" title="Simple Over Clever">
          Let solutions emerge naturally from problems. Can a junior dev understand this in 30 seconds?
        </GuidelineCard>

        <GuidelineCard type="dont" title="Over-Engineer">
          Avoid adding abstractions prematurely. Three similar lines are better than a premature abstraction.
        </GuidelineCard>

        <GuidelineCard type="do" title="Trust the Flow">
          Use existing patterns, tokens, and components first. Check agent-context.json before inventing.
        </GuidelineCard>

        <GuidelineCard type="dont" title="Invent When Existing Works">
          Don't create new patterns when established ones already solve the problem.
        </GuidelineCard>
      </div>
    </div>
  ),
};

// =============================================================================
// FULL PATTERN A EXAMPLE - Conceptual Documentation Page
// =============================================================================

export const ConceptualDocumentationExample: StoryObj = {
  name: 'Pattern A: Full Conceptual Page',
  render: () => (
    <div className="max-w-4xl">
      {/* 1. BrandHero - Always first */}
      <BrandHero
        title="Example Philosophy Guide"
        description="A complete example of Pattern A (Conceptual Documentation) showing the standard structure for philosophy, architecture, and guide pages."
        gradient="purple"
        decorativeIcon={<BookOpen size={180} color={PRIMITIVES.white} strokeWidth={1} />}
      />

      {/* 2. InfoBox - Key context after hero */}
      <InfoBox variant="tip">
        <strong>Pattern A Structure.</strong> This example demonstrates the standard layout:
        BrandHero → InfoBox → h2 sections with SectionHeader → content grids using
        FeatureCard and GuidelineCard.
      </InfoBox>

      {/* 3. Horizontal rule separator */}
      <hr style={{ margin: `${SPACING.px.section} 0`, border: 'none', borderTop: `1px solid ${SLATE[200]}` }} />

      {/* 4. Section with h2 + SectionHeader */}
      <h2 style={{ marginTop: SPACING.px.sectionHeadingTop, marginBottom: SPACING.px.sectionHeadingBottom }}>
        Core Principles
      </h2>

      <SectionHeader
        icon={<Compass size={20} />}
        title="Guiding Philosophy"
        description="The foundational principles that inform all design decisions in this system."
      />

      {/* 5. Styled blockquote for key quotes */}
      <div style={{
        background: `linear-gradient(135deg, ${DUSK_REEF[50]} 0%, ${PRIMITIVES.white} 100%)`,
        borderRadius: RADIUS.lg,
        border: `1px solid ${DUSK_REEF[200]}`,
        padding: SPACING.px.comfortable,
        marginBottom: SPACING.px.section,
      }}>
        <blockquote style={{
          margin: 0,
          padding: 0,
          fontStyle: 'italic',
          fontSize: '18px',
          color: DUSK_REEF[700],
          lineHeight: 1.6,
        }}>
          <span>"Quality emerges from relationship with the codebase. Engage curiously, don't force."</span>
          <cite style={{
            display: 'block',
            marginTop: SPACING.px.tight,
            fontStyle: 'normal',
            fontSize: '14px',
            color: DUSK_REEF[500],
          }}>— DDS Philosophy</cite>
        </blockquote>
      </div>

      {/* 6. GuidelineCard grid for do/don't */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: SPACING.px.comfortable,
        marginBottom: SPACING.px.section,
      }}>
        <GuidelineCard type="do" title="Follow Existing Patterns">
          Check what already exists before creating something new. The codebase has solutions.
        </GuidelineCard>

        <GuidelineCard type="dont" title="Reinvent the Wheel">
          Don't create new abstractions when existing patterns solve the problem.
        </GuidelineCard>
      </div>

      {/* 7. Another section */}
      <hr style={{ margin: `${SPACING.px.section} 0`, border: 'none', borderTop: `1px solid ${SLATE[200]}` }} />

      <h2 style={{ marginTop: SPACING.px.sectionHeadingTop, marginBottom: SPACING.px.sectionHeadingBottom }}>
        Related Resources
      </h2>

      <SectionHeader
        icon={<Zap size={20} />}
        title="Learn More"
        description="Explore these related topics to deepen your understanding."
      />

      {/* 8. FeatureCard grid for navigation */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: SPACING.px.comfortable,
        marginBottom: SPACING.px.section,
      }}>
        <FeatureCard
          icon={<Lightbulb size={24} color={DEEP_CURRENT[600]} />}
          title="Design Philosophy"
          description="The three principles that guide AI agents working on DDS."
        />
        <FeatureCard
          icon={<Target size={24} color={DEEP_CURRENT[600]} />}
          title="Agent Rules"
          description="Comprehensive rules for component development and styling."
        />
        <FeatureCard
          icon={<Users size={24} color={DEEP_CURRENT[600]} />}
          title="MCP Tools"
          description="13 tools for color validation, contrast checking, and more."
        />
      </div>
    </div>
  ),
};
