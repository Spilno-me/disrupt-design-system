# Pricing Calculator Ultimate - Dependencies

## NPM Dependencies Required

### One-Line Install

```bash
npm install tailwindcss @tailwindcss/vite @radix-ui/react-label @radix-ui/react-select @radix-ui/react-slider @radix-ui/react-slot @radix-ui/react-tooltip class-variance-authority clsx tailwind-merge lucide-react
```

### Core Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `react` | ^18.0.0 | Core React library |
| `react-dom` | ^18.0.0 | React DOM renderer |

### Tailwind CSS v4

| Package | Version | Purpose |
|---------|---------|---------|
| `tailwindcss` | ^4.0.0 | CSS framework |
| `@tailwindcss/vite` | ^4.0.0 | Vite plugin for Tailwind v4 |

### Radix UI Primitives

| Package | Version | Purpose |
|---------|---------|---------|
| `@radix-ui/react-label` | ^2.0.0 | Accessible label component |
| `@radix-ui/react-select` | ^2.0.0 | Accessible select dropdown |
| `@radix-ui/react-slider` | ^1.1.0 | Accessible slider component |
| `@radix-ui/react-slot` | ^1.0.0 | Polymorphic component slot |
| `@radix-ui/react-tooltip` | ^1.0.0 | Accessible tooltip |

### Styling Utilities

| Package | Version | Purpose |
|---------|---------|---------|
| `class-variance-authority` | ^0.7.0 | Variant-based class management |
| `clsx` | ^2.0.0 | Conditional class names |
| `tailwind-merge` | ^2.0.0 | Intelligent Tailwind class merging |

### Icons

| Package | Version | Purpose |
|---------|---------|---------|
| `lucide-react` | ^0.300.0 | Icon library |

## Vite Configuration

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

## CSS Setup

The `tokens.css` file includes the `@theme` block required by Tailwind v4. Simply import it after Tailwind:

```css
/* src/index.css */
@import "tailwindcss";
@import "./pricing-calculator-ultimate/tokens.css";
```

**No `tailwind.config.js` needed!** Tailwind v4 uses `@theme` blocks in CSS instead.

## File Structure

```
pricing-calculator-ultimate/
├── PricingCalculator.tsx    # Main component
├── tokens.css               # Design tokens with @theme block
├── dependencies.md          # This file
├── README.md                # Usage documentation
├── example-usage.tsx        # Example implementation
├── lib/
│   └── utils.ts             # cn() utility function
└── ui/
    ├── app-card.tsx         # Card component
    ├── button.tsx           # Button with variants
    ├── input.tsx            # Text input
    ├── label.tsx            # Form label
    ├── select.tsx           # Select dropdown
    ├── slider.tsx           # Range slider
    └── tooltip.tsx          # Tooltip
```

## TypeScript Configuration

Ensure your `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "esModuleInterop": true,
    "moduleResolution": "bundler",
    "strict": true
  }
}
```

## Browser Support

- Chrome 90+
- Firefox 90+
- Safari 15+
- Edge 90+

Requires CSS Custom Properties (CSS Variables) support.
