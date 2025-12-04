# Disrupt Design System

Unified design language and component library powering all Disrupt products.

## Products Using This System

- **Disrupt Inc.** – Corporate website
- **Disrupt Flow** – Product 1
- **Disrupt Market** – Product 2
- **Disrupt Partner** – Product 3

## Installation

```bash
npm install git+https://github.com/Spilno-me/disrupt-design-system.git
```

## Usage

```typescript
// Import components
import { Button, Card, Input } from '@disrupt/design-system'

// Import design tokens
import { COLORS, TYPOGRAPHY, SPACING } from '@disrupt/design-system/tokens'

// Import styles (in your main CSS/entry point)
import '@disrupt/design-system/styles'
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

### Design Tokens
- Colors (brand scales, semantic colors)
- Typography (Pilat Extended, Fixel)
- Spacing (T-shirt sizing)
- Shadows (elevation system)
- Border Radius
- Glassmorphism effects
- Grid patterns

### Components
- Button, Card, Badge
- Input, Textarea, Select, Checkbox
- Separator, Skeleton
- FeatureCard (animated)
- Glass Effects (ElectricButtonWrapper)
- Grid (animated GridBlobCanvas)

## Technology Stack

- React 19 + TypeScript
- Tailwind CSS v4
- Radix UI primitives
- Framer Motion
- Storybook 10

## License

MIT
