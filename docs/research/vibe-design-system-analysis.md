# Vibe Design System Analysis

## Research Objective

Analyze how Monday.com's Vibe Design System structures their Storybook documentation to identify patterns that could enhance DDS documentation, particularly around:

1. **Constraint-driven design**: How to limit design experimentation while providing clear guidance
2. **Documentation components**: Reusable building blocks for consistent documentation
3. **Component story patterns**: Best practices for demonstrating component usage
4. **Foundation documentation**: How to effectively document spacing, colors, typography

---

## Part 1: Vibe Design System Overview

### Repository Structure

```
mondaycom/vibe/
├── packages/
│   ├── storybook-blocks/     # 📚 Custom documentation components (PUBLISHED AS NPM)
│   ├── docs/                 # 📖 Documentation site (.storybook, pages)
│   ├── core/                 # 🧩 Component library
│   ├── style/                # 🎨 CSS/SCSS styles
│   ├── hooks/                # ⚡ React hooks
│   ├── icons/                # 🎯 Icon library
│   └── shared/               # 🔧 Shared utilities
```

### Key Insight: Separate Storybook Blocks Package

Vibe publishes their documentation components as a separate npm package: `vibe-storybook-components`

**Why this matters for DDS:**
- They treat documentation components as first-class citizens
- Reusable across multiple projects
- Versioned independently from component library
- Enforces consistency in how documentation looks

---

## Part 2: Documentation Component Inventory

### Vibe's Custom Storybook Blocks

| Component | Purpose | DDS Equivalent |
|-----------|---------|----------------|
| `ComponentRules` | Do/Don't with visual examples | `DosDontsPanel` (text-only) |
| `UsageGuidelines` | Bullet list of best practices | `UsageGuidelines` (similar) |
| `Frame` | Neutral container for examples | None (inline styles) |
| `Tip` | Callout boxes with emoji | `InfoBox` (variant-based) |
| `RelatedComponents` | Links to related components | None |
| `TokenTable` | Design token documentation | `TokenTable` (exists) |
| `VisualDescription` | Image + title + description | None |
| `DeprecatedWarning` | Status warning for deprecated | None |
| `AlphaWarning` | Status warning for alpha | None |
| `StorybookLink` | Internal navigation | `StoryLink` (exists) |
| `ComponentName` | H1 replacement for consistency | `BrandHero` (different approach) |
| `SectionName` | H2 replacement for consistency | `SectionHeader` (similar) |
| `FunctionArguments` | Props/params documentation | Via autodocs |

### Component Rules Pattern (Critical Finding)

Vibe's `ComponentRules` is their most powerful constraint tool:

```tsx
<ComponentRules
  rules={[
    {
      positive: {
        component: <Button>Get started</Button>,
        description: "Use 1-2 words, max 4 words, under 20 chars"
      },
      negative: {
        component: <Button>Get started and enjoy discount!</Button>,
        description: "Don't use punctuation or long phrases"
      }
    }
  ]}
/>
```

**Visual Output:**
- Side-by-side green check / red X panels
- Live component examples (not screenshots)
- Clear rule descriptions

**DDS Gap:** Our `DosDontsPanel` only shows text bullets, not live component examples.

---

## Part 3: Documentation Structure Patterns

### 3.1 Component Documentation Template (Vibe)

Every component MDX follows this structure:

```mdx
# {ComponentName}

{One paragraph description - what it is and when to use}

<Canvas of={Stories.Overview} />

### Import
\`\`\`js
import { Component } from "@vibe/core";
\`\`\`

## Props
<PropsTable />

## Usage
<UsageGuidelines guidelines={[...]} />

## Accessibility
<UsageGuidelines guidelines={[...]} />

## Variants
<Canvas of={Stories.Variants} />

## Do's and Don'ts
<ComponentRules rules={[...]} />

## Use cases and examples
<Canvas of={Stories.LoadingState} />

## Related components
<RelatedComponents componentsNames={["X", "Y", "Z"]} />
```

### 3.2 Foundation Documentation Template (Vibe)

For Spacing, Typography, Colors:

```mdx
# {Foundation Name}

{Description of the foundation}

## The {X} scale
<CustomScaleComponent />

## Applying the {X} scale
<UsageGuidelines guidelines={[...]} />

## Code example
<Source code={`...`} />

## Usage and examples
<Canvas of={Stories.UsageExamples} sourceState="none" />

## Flex/Flow (if applicable)
{Integration with layout patterns}

## Do's and Dont's
<ComponentRules rules={[...]} />

## Up next
<RelatedComponents componentsNames={["typography", "shadow", "colors"]} />
```

---

## Part 4: Key Differentiators

### What Vibe Does Well

| Feature | How They Do It | DDS Status |
|---------|---------------|------------|
| **MDX Component Mapping** | Replace h1→ComponentName, h2→SectionName | Not implemented |
| **Live Edit** | `storybook-addon-playground` | Not implemented |
| **Constraint Visualization** | ComponentRules with live components | Text-only DosDontsPanel |
| **Related Components** | Automatic linking at bottom | Manual/none |
| **Status Warnings** | AlphaWarning, DeprecatedWarning | Via badges only |
| **Theme Switching** | Three themes in toolbar | Two themes |
| **Font Loading** | Wait for fonts before snapshot | Not implemented |

### What DDS Does Well

| Feature | How We Do It | Vibe Status |
|---------|--------------|-------------|
| **Hero Components** | BrandHero with particles | Simple header |
| **Code Blocks** | Syntax highlighting + copy | Basic |
| **Color Documentation** | ColorSwatch, ColorScale | Simpler approach |
| **Shadow Documentation** | ShadowCard, DepthCard | Basic |
| **Token Export** | TOKENS object for MDX | Similar |

---

## Part 5: Recommendations

### Priority 1: Component Rules with Live Examples

**Problem:** DDS DosDontsPanel shows text only, not actual component examples.

**Solution:** Create `ComponentRules` component that renders live components:

```tsx
// Proposed API
<ComponentRules
  rules={[
    {
      do: {
        component: <Button size="sm">Short</Button>,
        description: "Keep button text concise"
      },
      dont: {
        component: <Button size="sm">Click here to proceed with the next step</Button>,
        description: "Avoid verbose button labels"
      }
    }
  ]}
/>
```

**Impact:** Designers and developers SEE exactly what's correct vs incorrect.

### Priority 2: RelatedComponents Navigator

**Problem:** No automatic linking between related components.

**Solution:** Create component that links to related documentation:

```tsx
<RelatedComponents
  components={["Badge", "Checkbox", "Toggle"]}
/>
```

**Impact:** Better documentation discovery, reinforces component ecosystem.

### Priority 3: Status Warning Components

**Problem:** Component status (alpha, deprecated, stable) not prominently displayed.

**Solution:** Create dedicated warning components:

```tsx
<AlphaWarning /> // Yellow banner for experimental components
<DeprecatedWarning alternative="NewComponent" /> // Red banner with migration link
<StableIndicator /> // Optional green badge
```

**Impact:** Clear communication about component maturity.

### Priority 4: MDX Component Mapping

**Problem:** MDX headings use default Storybook styles, inconsistent with DDS brand.

**Solution:** Map HTML elements to custom components in preview.tsx:

```tsx
docs: {
  components: {
    h1: ComponentName,     // DDS styled h1
    h2: SectionName,       // DDS styled h2
    h3: SectionSubtitle,   // DDS styled h3
    p: Paragraph,          // DDS styled paragraph
    Tip,
    ComponentRules,
    UsageGuidelines,
    RelatedComponents,
  }
}
```

**Impact:** Consistent styling across ALL documentation pages without manual wrapping.

### Priority 5: Documentation Page Templates

**Problem:** No enforced structure for component documentation.

**Solution:** Create MDX templates with required sections:

```
.claude/templates/
├── component-docs.mdx.template
├── foundation-docs.mdx.template
└── pattern-docs.mdx.template
```

**Impact:** Consistent documentation structure, easier onboarding for contributors.

---

## Part 6: Implementation Roadmap

### Phase 1: Critical Documentation Components (Week 1-2)

1. **ComponentRules** - Live Do/Don't examples
2. **RelatedComponents** - Navigation links
3. **StatusWarnings** - Alpha/Deprecated indicators

### Phase 2: Infrastructure (Week 3)

1. MDX Component Mapping in preview.ts
2. Documentation templates
3. Style consistency updates

### Phase 3: Migration (Week 4+)

1. Update existing component docs with new components
2. Add ComponentRules to all components
3. Add RelatedComponents linking

---

## Part 7: Vibe vs DDS Philosophy Comparison

| Aspect | Vibe | DDS |
|--------|------|-----|
| **Flexibility** | High - building blocks for any app | Low - constrained compositions |
| **Target Audience** | External developers | Internal teams + agents |
| **Component Granularity** | Atoms + molecules | Atoms → organisms → pages |
| **Customization** | Encouraged | Discouraged |
| **Documentation Goal** | Enable creativity | Enforce consistency |

### DDS-Specific Recommendations

Because DDS is a **constraint system** (not a flexible design system), our documentation should:

1. **Show ONLY approved compositions** - Don't show all possible combinations
2. **Hide advanced customization** - Don't encourage deviation
3. **Provide ORGANISMS as primary examples** - Not atoms in isolation
4. **Link to source of truth** - Figma, not experimentation

### Proposed: Composition-First Documentation

```mdx
# Partner Row

The standard row layout for partner management tables.

## Approved Composition
<Canvas of={Stories.Default} />

## This is what it includes:
- TierBadge (status indicator)
- StatusIndicator (health status)
- MetricItem (usage data)

## When NOT to use
<ComponentRules rules={[
  {
    dont: { component: <CustomPartnerRow />, description: "Never create custom row layouts" },
    do: { component: <PartnerRow />, description: "Use the standard PartnerRow" }
  }
]} />

## If you need changes
Contact the DDS team. Do not create variants.
```

---

## Part 8: Files to Create

### New Documentation Components

```
src/stories/_infrastructure/
├── ComponentRules.tsx      # Live Do/Don't panels
├── RelatedComponents.tsx   # Navigation to related docs
├── StatusWarning.tsx       # Alpha/Deprecated warnings
├── Frame.tsx              # Neutral example container
└── CompositionGuide.tsx   # "Use this organism" component
```

### New Templates

```
.claude/templates/
├── component-docs.template.mdx
├── organism-docs.template.mdx
└── foundation-docs.template.mdx
```

### Updated Configuration

```
.storybook/preview.ts      # Add docs.components mapping
```

---

## Appendix: Source Files Analyzed

### Vibe Repository (mondaycom/vibe)

- `packages/storybook-blocks/src/components/` - 25+ custom blocks
- `packages/docs/.storybook/preview.tsx` - Component mapping
- `packages/docs/.storybook/main.ts` - Configuration
- `packages/docs/src/pages/components/Button/Button.mdx` - Component doc example
- `packages/docs/src/pages/foundations/spacing/Spacing.mdx` - Foundation doc example

### DDS Repository

- `src/stories/brand/BrandComponents.tsx` - Hero, InfoBox, etc.
- `src/stories/foundation/DocComponents.tsx` - TokenTable, CodeBlock, etc.
- `src/stories/_infrastructure/` - Story utilities
- `.storybook/preview.ts` - Current configuration

---

## Conclusion

Vibe Design System provides excellent patterns for constraining and guiding documentation. The key takeaways for DDS:

1. **ComponentRules with live examples** is the most impactful missing feature
2. **MDX component mapping** would improve consistency without manual effort
3. **Documentation templates** would enforce structure
4. **DDS should lean into its constraint philosophy** - show approved compositions, not building blocks

The fundamental difference is philosophical: Vibe enables creativity, DDS enforces consistency. Our documentation should reflect that by showing "this is THE way" rather than "these are your options."
