# Disrupt Design System

Unified design language and component library powering all Disrupt products.

## Products Using This System

- **Disrupt Inc.** – Corporate website
- **Disrupt Flow** – EHS compliance platform
- **Disrupt Market** – Marketplace platform
- **Disrupt Partner** – Partner portal

## Installation

```bash
npm install @adrozdenko/design-system
```

Or install from GitHub:

```bash
npm install git+https://github.com/Spilno-me/disrupt-design-system.git
```

## Package Architecture

DDS uses **subpath exports** to organize components by product domain:

| Subpath | Purpose | Example Components |
|---------|---------|-------------------|
| `/core` | Shared across ALL products | Button, Card, Input, Dialog |
| `/flow` | Flow EHS mobile app | MobileNavButton, MobileNavBar, QuickActionButton |
| `/tokens` | Design tokens (TypeScript) | ALIAS, SHADOWS, SPACING |

### Import Patterns

```tsx
// Core components (shared)
import { Button, Card, Input } from '@adrozdenko/design-system/core'

// Flow-specific components (mobile)
import { MobileNavButton, MobileNavBar } from '@adrozdenko/design-system/flow'

// Design tokens
import { ALIAS, SHADOWS, SPACING } from '@adrozdenko/design-system/tokens'

// Legacy: All components (still works, but prefer subpaths)
import { Button, Card } from '@adrozdenko/design-system'
```

## Quick Start

### 1. Install the package

```bash
npm install @adrozdenko/design-system
```

### 2. Configure Tailwind CSS

Import the DDS preset in your `tailwind.config.js`:

```javascript
import preset from '@adrozdenko/design-system/tailwind-preset'

export default {
  presets: [preset],
  content: [
    './src/**/*.{ts,tsx}',
    './node_modules/@adrozdenko/design-system/dist/**/*.js',
  ],
}
```

### 3. Import styles

Add to your main CSS file (e.g., `src/index.css`):

**For Tailwind v4 (CSS-first with @tailwindcss/vite):**
```css
@import "tailwindcss";

/* Tell Tailwind to scan DDS component files for utility classes */
@source "../node_modules/@adrozdenko/design-system/dist/**/*.js";

@import "@adrozdenko/design-system/styles";
@import "@adrozdenko/design-system/tokens.css";  /* MUST BE LAST */
```

**For Tailwind v3 (config-first):**
```css
@import '@adrozdenko/design-system/tokens.css';
@import '@adrozdenko/design-system/styles';
```

> **Important**: In Tailwind v4, `tokens.css` must be imported LAST to ensure
> DDS utility classes override Tailwind's base layer reset.

### 4. Use components

```tsx
import { Button, Card, Input } from '@adrozdenko/design-system/core'

function App() {
  return (
    <Card>
      <h1 className="text-primary text-2xl font-bold">Hello DDS</h1>
      <Input placeholder="Enter text..." />
      <Button variant="primary">Submit</Button>
    </Card>
  )
}
```

## Usage

### Importing Components

```typescript
// Core components (recommended)
import {
  Button,
  Card,
  Input,
  Textarea,
  Select,
  Dialog,
  DataTable,
  Pagination,
  AppSidebar,
  Tabs,
} from '@adrozdenko/design-system/core'

// Flow mobile components
import {
  MobileNavButton,
  MobileNavBar,
  QuickActionButton,
} from '@adrozdenko/design-system/flow'

// Layout components
import { Header, Footer, PageLayout } from '@adrozdenko/design-system/core'
```

### Importing Design Tokens

```typescript
// Import semantic tokens (recommended)
import {
  ALIAS,      // Semantic color tokens
  SHADOWS,    // Shadow system
  RADIUS,     // Border radius
  SPACING,    // Spacing scale
  TYPOGRAPHY, // Typography system
  TRANSITIONS // Animation timings
} from '@adrozdenko/design-system/tokens'

// Use in components (for dynamic values only)
<div style={{
  backgroundColor: isError ? ALIAS.status.error : ALIAS.background.surface,
  boxShadow: SHADOWS.md,
  borderRadius: RADIUS.lg
}}>
  Dynamic styling
</div>
```

### Using Tailwind Classes (Recommended)

**For static styling, always prefer Tailwind classes:**

```tsx
// ✅ GOOD: Static styling with semantic classes
<div className="bg-surface text-primary border-default rounded-lg shadow-md">
  <h1 className="text-2xl font-bold">Heading</h1>
  <p className="text-secondary">Description</p>
  <Button className="bg-accent-strong text-inverse">Action</Button>
</div>

// ❌ BAD: Using ALIAS for static values
<div style={{ backgroundColor: ALIAS.background.surface }}>
```

**Use ALIAS tokens only for dynamic values:**

```tsx
// ✅ GOOD: Dynamic color based on state
<div style={{
  backgroundColor: status === 'error' ? ALIAS.status.error : ALIAS.background.surface
}}>
```

## Development

```bash
# Install dependencies
npm install

# Start Storybook
npm run storybook

# Build package
npm run build
```

## What's Inside

### Design Tokens (2-Tier System)

**Tier 1: Brand Primitives**
- ABYSS (navy dark) - Primary brand color scale
- DEEP_CURRENT (teal) - Secondary brand color scale
- DUSK_REEF (purple) - Tertiary brand color scale
- CORAL, WAVE, SUNRISE, HARBOR - Status colors

**Tier 2: Semantic Tokens (ALIAS)**
- Text colors: `primary`, `secondary`, `inverse`, `error`, `success`, etc.
- Backgrounds: `page`, `surface`, `accent`, `muted`, status variants
- Borders: `default`, `focus`, `error`, etc.
- Interactive states: `primary`, `hover`, `active`, `disabled`
- Shadows: `sm`, `md`, `lg`, `xl`, specialized (header, image)
- Typography: Pilat Extended (display), Fixel (body)
- Spacing: Consistent scale for sections, containers, gaps
- Border radius: `xs` (4px) → `full` (pill)

### Components (67 Components)

**Forms & Inputs:**
- Button (7 variants), Input, Textarea, Checkbox, Select, Form (react-hook-form)

**Layout & Containers:**
- Card (3 variants), Dialog, Sheet, Separator, PageLayout, SectionLayout

**Navigation:**
- AppSidebar (desktop), MobileNav (drawer), BottomNav (mobile tabs)
- Header (marketing), AppHeader (app), MobileMenu

**Data Display:**
- DataTable (sortable, selectable), Pagination, Badge, Accordion
- Skeleton (3 variants), SeverityIndicator, QuickFilter

**Overlays:**
- Dialog/Modal, Sheet (side panel), DropdownMenu, Tooltip

**Specialized:**
- FeatureCard (animated icons), CheckListItem, AnimatedLogo
- OptimizedImage, ParallaxImage, BlurImage
- GridBlobBackground, GlassEffect, HeroParticles

**Auth & Wizards:**
- LoginForm, ForgotPasswordForm, ResetPasswordForm, AuthLayout
- Wizard, WizardStepper, WizardNavigation

**Domain-Specific:**
- ContactForm (with success/error modals)
- LeadsDataTable, StatsCard, CreateLeadDialog
- InvoicesDataTable, InvoiceCard, InvoicePreviewSheet

## Technology Stack

- React 19 + TypeScript
- Tailwind CSS v4
- Radix UI primitives
- Framer Motion
- Storybook 10

## License

MIT
