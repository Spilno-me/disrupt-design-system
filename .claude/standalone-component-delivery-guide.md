# Standalone Component Delivery Guide

**Purpose:** How to package DDS components for developers who can't use the full design system.

---

## When to Use This Approach

- Developer is on an older DDS version and can't upgrade yet
- External team needs a component without full DDS dependency
- Quick prototype handoff before proper integration
- Reference implementation for re-implementation in different stack

---

## Decision Flowchart

```
START: Need to deliver a component
    │
    ▼
┌─────────────────────────────────────┐
│ Does recipient have shadcn/ui?      │
└─────────────────────────────────────┘
    │ YES                    │ NO
    ▼                        ▼
┌─────────────┐    ┌─────────────────────────────┐
│ Option C    │    │ Does recipient have         │
│ shadcn/ui   │    │ Tailwind CSS configured?    │
│ Compatible  │    └─────────────────────────────┘
└─────────────┘         │ YES              │ NO
                        ▼                  ▼
               ┌─────────────┐    ┌─────────────┐
               │ Option A    │    │ Option B    │
               │ Self-       │    │ Dependency- │
               │ Contained   │    │ Free        │
               └─────────────┘    └─────────────┘
```

---

## Delivery Options

| Option | Effort | File Size | Best For |
|--------|--------|-----------|----------|
| **A. Fully Self-Contained** | High | ~50-100KB | Drop-in usage, minimal setup |
| **B. Dependency-Free (Inline)** | Medium | ~20-40KB | Any React project, no dependencies |
| **C. shadcn/ui Compatible** | Low | ~15KB | Teams already using shadcn/ui |

---

## Pre-Packaging Steps (Do First)

Before creating any delivery package:

### 1. Identify All Dependencies

```bash
# Find all imports in your component
grep -E "^import" src/components/your-component.tsx
```

Create a dependency map:

| Import | Type | Action Needed |
|--------|------|---------------|
| `lucide-react` | NPM package | Document in dependencies.md |
| `./ui/button` | Local UI component | Include file OR document alternative |
| `../../lib/utils` | Utility | Include file |
| `clsx` | NPM package | Document in dependencies.md |
| `@radix-ui/*` | NPM (via UI components) | Handled by shadcn or include |

### 2. Identify Custom Variants/APIs

Check if component uses non-standard patterns:

```tsx
// Search for custom variants
grep -E 'variant="' src/components/your-component.tsx

// Search for custom props
grep -E 'onChange=|onValueChange=' src/components/your-component.tsx
```

### 3. Create Delivery Folder

```bash
mkdir -p delivery/component-name/{ui,lib}
```

### 4. Copy and Transform Files

```bash
# Copy main component
cp src/components/path/Component.tsx delivery/component-name/

# Copy required UI components
cp src/components/ui/button.tsx delivery/component-name/ui/
# ... repeat for each UI component used

# Copy utilities
cp src/lib/utils.ts delivery/component-name/lib/
```

### 5. Rewrite Import Paths

Transform all imports from DDS structure to flat structure:

```tsx
// BEFORE (DDS structure)
import { cn } from '../../lib/utils'
import { Button } from '../ui/button'

// AFTER (delivery structure)
import { cn } from './lib/utils'
import { Button } from './ui/button'
```

---

## Option A: Fully Self-Contained Package

Include ALL dependencies in the package.

### Required Structure

```
component-name/
├── ComponentName.tsx          # Main component
├── ui/                        # All UI primitives used
│   ├── button.tsx
│   ├── input.tsx
│   ├── label.tsx
│   ├── select.tsx
│   ├── slider.tsx
│   ├── tooltip.tsx
│   └── card.tsx               # Or app-card.tsx
├── lib/
│   └── utils.ts               # cn() helper - MUST INCLUDE
├── tokens.css                 # Design tokens as CSS variables
├── example-usage.tsx          # Working integration example
├── dependencies.md            # NPM packages required
└── README.md                  # Setup instructions
```

### Checklist

- [ ] All imported UI components are included as files
- [ ] `lib/utils.ts` with `cn()` function is included
- [ ] No `../../` imports - use relative `./` paths only
- [ ] All custom variants documented or replaced with standard ones
- [ ] Component APIs match what's documented (especially Slider, Select)
- [ ] Types exported correctly for the target bundler

---

## Option B: Dependency-Free (Inline Styles)

Create a single-file version with no component imports.

### Example Pattern

```tsx
// Instead of:
import { Button } from './ui/button'
<Button variant="accent">Click</Button>

// Use inline:
<button className="h-10 px-4 rounded-lg bg-[#08A4BD] text-white font-medium hover:bg-[#068397] transition-colors">
  Click
</button>
```

### Checklist

- [ ] No UI component imports (Button, Input, Select, etc.)
- [ ] All styles are Tailwind classes or inline CSS
- [ ] Colors use hex values, not CSS variables (for portability)
- [ ] Include tokens.css as optional enhancement
- [ ] Single file or minimal files only

### Pros/Cons

| Pros | Cons |
|------|------|
| Works anywhere | Harder to maintain |
| No dependency conflicts | No component reuse |
| Easy to understand | Verbose code |

### Full Inline Example

Transform a Card with Button into dependency-free code:

```tsx
// BEFORE: With component imports
import { Card, CardHeader, CardTitle, CardContent } from './ui/card'
import { Button } from './ui/button'

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    <Button variant="accent">Click Me</Button>
  </CardContent>
</Card>

// AFTER: Dependency-free (inline Tailwind)
<div className="rounded-2xl border border-[#CBD5E1] bg-white shadow-md">
  <div className="px-6 py-4 border-b border-[#D1D3D7]">
    <h3 className="text-lg font-semibold text-[#2D3142]">Title</h3>
  </div>
  <div className="px-6 py-4">
    <button
      className="h-10 px-4 rounded-lg bg-[#08A4BD] text-white font-medium
                 hover:bg-[#068397] focus:outline-none focus:ring-2
                 focus:ring-[#08A4BD] focus:ring-offset-2 transition-colors"
    >
      Click Me
    </button>
  </div>
</div>
```

### Inline Style Tokens Reference

When inlining, use these hex values:

| Token | Hex | Usage |
|-------|-----|-------|
| Primary text | `#2D3142` | `text-[#2D3142]` |
| Secondary text | `#5E4F7E` | `text-[#5E4F7E]` |
| Accent | `#08A4BD` | `bg-[#08A4BD]` |
| Accent hover | `#068397` | `hover:bg-[#068397]` |
| Surface | `#FFFFFF` | `bg-white` |
| Border default | `#CBD5E1` | `border-[#CBD5E1]` |
| Border subtle | `#D1D3D7` | `border-[#D1D3D7]` |
| Radius sm | `8px` | `rounded-lg` |
| Radius md | `12px` | `rounded-xl` |
| Radius lg | `16px` | `rounded-2xl` |

---

## Option C: shadcn/ui Compatible

Assume developer will install shadcn/ui components.

### Critical Compatibility Rules

#### 1. Use Standard Variants Only

```tsx
// ❌ WRONG - Custom variant
<Button variant="accent">

// ✅ CORRECT - Standard shadcn variants
<Button variant="default">      // Primary action
<Button variant="secondary">    // Secondary action
<Button variant="destructive">  // Danger action
<Button variant="outline">      // Bordered
<Button variant="ghost">        // Minimal
<Button variant="link">         // Text link
```

#### 2. Match Component APIs Exactly

**Slider:**
```tsx
// ❌ DDS Slider API
<Slider value={50} onChange={(v) => setValue(v)} />

// ✅ shadcn/ui Slider API
<Slider value={[50]} onValueChange={(v) => setValue(v[0])} />
```

**Select:**
```tsx
// Both DDS and shadcn use same Radix API - OK
<Select value={val} onValueChange={setVal}>
  <SelectTrigger>
    <SelectValue />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="a">Option A</SelectItem>
  </SelectContent>
</Select>
```

#### 3. Provide Install Commands

```bash
# Include exact commands in README
npx shadcn@latest add button input label select slider tooltip card
```

### Checklist

- [ ] Only standard shadcn/ui variants used
- [ ] Component APIs match shadcn/ui exactly
- [ ] Custom components (like AppCard) replaced with Card
- [ ] Install commands provided and tested
- [ ] Note Tailwind version requirements (v3 vs v4)

---

## Common Mistakes to Avoid

### 1. Missing cn() Utility

**Problem:** Component uses `cn()` but file not included.

**Solution:** Always include `lib/utils.ts`:

```typescript
// lib/utils.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### 2. Broken Import Paths

**Problem:** Imports assume DDS folder structure.

```tsx
// ❌ Assumes specific structure
import { cn } from '../../lib/utils'
import { Button } from '../ui/button'

// ✅ Relative to package root
import { cn } from './lib/utils'
import { Button } from './ui/button'
```

### 3. Type Import Syntax

**Problem:** Vite/esbuild requires explicit type imports.

```tsx
// ❌ May fail in Vite
import { Component, SomeType, AnotherType } from './Component'

// ✅ Works everywhere
import { Component } from './Component'
import type { SomeType, AnotherType } from './Component'
```

### 4. Undocumented Custom Variants

**Problem:** Using `variant="accent"` without providing the variant.

**Solution:** Either:
- Include the Button component with custom variants
- Use standard variants and document color customization via CSS

### 5. API Mismatches

**Problem:** DDS component APIs differ from shadcn/ui.

| Component | DDS API | shadcn/ui API |
|-----------|---------|---------------|
| Slider | `value={number}` | `value={number[]}` |
| Slider | `onChange` | `onValueChange` |
| AppCard | Custom component | Use `Card` instead |

### 6. Missing Radix UI Dependencies

**Problem:** UI components depend on Radix primitives not listed in dependencies.

Each shadcn/ui component has Radix dependencies:

| Component | Radix Package |
|-----------|---------------|
| Select | `@radix-ui/react-select` |
| Slider | `@radix-ui/react-slider` |
| Tooltip | `@radix-ui/react-tooltip` |
| Dialog | `@radix-ui/react-dialog` |

**Solution:** If including UI component files, also document Radix packages:

```bash
npm install @radix-ui/react-select @radix-ui/react-slider @radix-ui/react-tooltip
```

Or use shadcn CLI which handles this automatically.

### 7. Icon Package Not Mentioned

**Problem:** Component uses Lucide icons but dependency not documented.

**Solution:** Always include in dependencies.md:

```bash
npm install lucide-react
```

And show import pattern:

```tsx
import { Calculator, Users, Building2 } from 'lucide-react'
```

### 8. Font Not Available

**Problem:** Component uses DDS font (Fixel) which recipient doesn't have.

**Solution:** Document font requirement OR use system fonts:

```css
/* Option A: Include font (add to tokens.css) */
@font-face {
  font-family: 'Fixel';
  src: url('./fonts/Fixel-Regular.woff2') format('woff2');
  font-weight: 400;
}

/* Option B: Fallback to system fonts */
:root {
  --font-sans: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
```

### 9. Tailwind Version Mismatch

**Problem:** Tailwind v3 vs v4 syntax differences.

| Feature | Tailwind v3 | Tailwind v4 |
|---------|-------------|-------------|
| Config file | `tailwind.config.js` | `tailwind.config.ts` or CSS |
| Color opacity | `bg-black/50` | Same |
| Arbitrary values | `w-[100px]` | Same |
| @apply | Supported | Deprecated |

**Solution:** Ask recipient which version they use and document accordingly.

---

## Required Files Checklist

### Always Include

| File | Purpose | Notes |
|------|---------|-------|
| `README.md` | Setup instructions | Include folder structure diagram |
| `tokens.css` | Design tokens | CSS variables for colors, spacing, radius |
| `dependencies.md` | NPM packages | Exact versions + install commands |
| `lib/utils.ts` | cn() helper | Required if any component uses cn() |

### Include If Used

| File | Include If... |
|------|---------------|
| `ui/button.tsx` | Component uses Button |
| `ui/input.tsx` | Component uses Input |
| `ui/label.tsx` | Component uses Label |
| `ui/select.tsx` | Component uses Select |
| `ui/slider.tsx` | Component uses Slider |
| `ui/tooltip.tsx` | Component uses Tooltip |
| `ui/card.tsx` | Component uses Card/AppCard |

---

## tokens.css Template

```css
:root {
  /* Text Colors */
  --color-primary: #2D3142;
  --color-secondary: #5E4F7E;
  --color-muted: #5E4F7E;
  --color-accent: #08A4BD;
  --color-success: #22C55E;
  --color-error: #F70D1A;

  /* Background Colors */
  --color-surface: #FFFFFF;
  --color-page: #FBFBF3;
  --color-accent-bg: #E6F7FA;

  /* Border Colors */
  --color-border-default: #CBD5E1;
  --color-border-subtle: #D1D3D7;
  --color-border-strong: #757B87;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);

  /* Radius */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
}
```

---

## README.md Template

```markdown
# [ComponentName] - Standalone Package

**Extracted from:** DDS v[X.X.X]
**Date:** [YYYY-MM-DD]

## Quick Start

1. Install dependencies:
   ```bash
   npm install [packages]
   ```

2. Copy files to your project:
   ```
   your-project/
   ├── components/
   │   └── [component-name]/    # Copy entire folder here
   └── styles/
       └── tokens.css           # Import in app entry
   ```

3. Import and use:
   ```tsx
   import { ComponentName } from './components/component-name'
   import './styles/tokens.css'
   ```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| ... | ... | ... | ... |

## Customization

Override CSS variables in your own stylesheet:
```css
:root {
  --color-accent: #YOUR_BRAND_COLOR;
}
```
```

---

## Testing Before Delivery

### Manual Test Checklist

1. [ ] Create fresh React project with Tailwind
2. [ ] Copy delivery package into project
3. [ ] Install ALL listed dependencies (including Radix if needed)
4. [ ] Import CSS tokens in app entry
5. [ ] Import component - no TypeScript errors
6. [ ] Render component - no runtime errors
7. [ ] All interactive features work (inputs, buttons, selects, sliders)
8. [ ] Styles render correctly (colors, spacing, shadows)
9. [ ] Focus states work (tab through component)
10. [ ] Responsive layout works (resize browser)

### Full Test Script (with Tailwind)

```bash
# Create test environment with Tailwind
cd /tmp
npm create vite@latest delivery-test -- --template react-ts
cd delivery-test
npm install

# Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Configure Tailwind (create tailwind.config.js)
cat > tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
EOF

# Add Tailwind directives to CSS
cat > src/index.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;
EOF

# Copy your package
cp -r /path/to/delivery/component-name ./src/components/

# Copy tokens
cp /path/to/delivery/component-name/tokens.css ./src/

# Install component dependencies
npm install lucide-react clsx tailwind-merge class-variance-authority

# If using shadcn components, also install Radix
npm install @radix-ui/react-select @radix-ui/react-slider @radix-ui/react-tooltip @radix-ui/react-label

# Update App.tsx to test
cat > src/App.tsx << 'EOF'
import './tokens.css'
import { ComponentName } from './components/component-name/ComponentName'

function App() {
  return (
    <div className="min-h-screen bg-[#FBFBF3] p-8">
      <ComponentName />
    </div>
  )
}

export default App
EOF

# Run and verify
npm run dev
```

### Test Verification Points

After running the test app, verify:

| Check | How to Verify |
|-------|---------------|
| Colors correct | Compare to Storybook/Figma |
| Shadows visible | Cards should have subtle shadow |
| Borders visible | Check border colors aren't invisible |
| Fonts loading | Text shouldn't be system default (if custom font) |
| Buttons work | Click each button, check hover states |
| Inputs work | Type in text/number inputs |
| Selects work | Open dropdowns, select options |
| Sliders work | Drag slider, value updates |
| Responsive | Resize to mobile width |
| Keyboard nav | Tab through all interactive elements |

---

## Delivery Methods

| Method | Pros | Cons |
|--------|------|------|
| **ZIP file** | Simple, offline | No version tracking |
| **GitHub Gist** | Easy sharing, versioned | Public by default |
| **Private repo** | Version control, CI | Requires access setup |
| **Static Storybook** | Visual + code reference | Large file size (~50MB) |

### Create ZIP

```bash
cd /path/to/delivery
zip -r component-name.zip component-name/
```

### Create GitHub Gist

```bash
gh gist create component-name/* --public
```

---

## Master Checklist (Copy for Each Delivery)

```markdown
## Delivery Checklist: [ComponentName]

### Pre-Packaging
- [ ] Identified all imports (grep for ^import)
- [ ] Chose delivery option: A / B / C
- [ ] Created delivery folder structure
- [ ] Copied all required files
- [ ] Rewrote all import paths to relative

### Files Included
- [ ] ComponentName.tsx (main component)
- [ ] README.md (setup instructions)
- [ ] tokens.css (design tokens)
- [ ] dependencies.md (npm packages)
- [ ] example-usage.tsx (integration example)
- [ ] lib/utils.ts (cn helper) - if needed
- [ ] ui/*.tsx (UI components) - if Option A

### Code Quality
- [ ] No ../../ imports (all relative to package root)
- [ ] Types use `import type` syntax
- [ ] Custom variants documented or replaced
- [ ] Component APIs match target library
- [ ] No DDS-specific code remains

### Dependencies Documented
- [ ] React version requirement
- [ ] Tailwind CSS version
- [ ] lucide-react (for icons)
- [ ] clsx + tailwind-merge (for cn)
- [ ] class-variance-authority (for variants)
- [ ] @radix-ui/* packages (if needed)

### Testing
- [ ] Created fresh test project
- [ ] Installed all dependencies
- [ ] Component renders without errors
- [ ] All interactions work
- [ ] Styles match design
- [ ] Responsive layout works

### Delivery
- [ ] Created ZIP archive
- [ ] Tested ZIP extraction
- [ ] Sent to recipient
- [ ] Answered follow-up questions
```

---

## Lessons Learned (PricingCalculator Case Study)

Real feedback from a delivery attempt:

### What Worked
- README structure was clear
- tokens.css was well-organized
- Type definitions were complete
- Pricing logic had no bugs

### What Failed
1. **Missing UI component files** - 60% of setup time wasted
2. **Import paths assumed DDS structure** - required manual fixing
3. **Button variant="accent"** - not standard shadcn
4. **Slider API mismatch** - `onChange` vs `onValueChange`
5. **Type imports** - needed `import type` for Vite
6. **cn() only in comments** - should be actual file

### Key Takeaway

> "Either include everything, or include nothing custom."
>
> Half-measures (documenting but not providing) waste the recipient's time.

---

## Changelog

| Date | Author | Changes |
|------|--------|---------|
| 2025-12-16 | DDS Team | Initial guide based on PricingCalculator delivery |
| 2025-12-16 | DDS Team | Added: Decision flowchart, pre-packaging steps, full inline example, Radix dependencies, font handling, Tailwind versions, master checklist, lessons learned |
