# Pricing Calculator Ultimate

A fully self-contained pricing calculator component from the Disrupt Design System.

## Instant Setup (Recommended)

Run the setup script to create a complete project in seconds:

```bash
./setup.sh
```

This will:
1. Create a new Vite + React project
2. Install all dependencies
3. Configure Tailwind CSS v4
4. Set up the component ready to use

Then just `cd your-project && npm run dev`!

---

## Manual Setup (Vite + React)

### 1. Install Dependencies

```bash
# Core dependencies
npm install react react-dom

# Tailwind CSS v4
npm install tailwindcss @tailwindcss/vite

# Component dependencies
npm install @radix-ui/react-label @radix-ui/react-select @radix-ui/react-slider \
  @radix-ui/react-slot @radix-ui/react-tooltip class-variance-authority \
  clsx tailwind-merge lucide-react
```

### 2. Configure Vite

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

### 3. Set Up CSS

```css
/* src/index.css */
@import "tailwindcss";
@import "./pricing-calculator-ultimate/tokens.css";

body {
  margin: 0;
  min-height: 100vh;
}
```

### 4. Use the Component

```tsx
import { PricingCalculator } from './pricing-calculator-ultimate/PricingCalculator'

function App() {
  return (
    <div className="min-h-screen bg-page p-8">
      <div className="max-w-6xl mx-auto">
        <PricingCalculator
          commissionPercentage={15}
          onCalculate={(input, breakdown) => {
            console.log('Calculated:', { input, breakdown })
          }}
          onGenerateQuote={(input, breakdown) => {
            console.log('Generate quote:', { input, breakdown })
          }}
        />
      </div>
    </div>
  )
}

export default App
```

That's it! Run `npm run dev` and you're done.

## Features

- **Interactive Sliders**: Adjust users and document volume
- **Service Selection**: Choose from different service tiers
- **Real-time Pricing**: Updates pricing as you configure
- **Contact Form**: Built-in form for quote requests
- **Responsive Design**: Works on mobile and desktop
- **Accessible**: Built on Radix UI primitives

## Component Props

```typescript
interface PricingCalculatorProps {
  /** Partner's commission percentage (default: 15%) */
  commissionPercentage?: number
  /** Callback when pricing is calculated */
  onCalculate?: (input: PricingInput, breakdown: PricingBreakdown) => void
  /** Callback when "Generate Quote" is clicked */
  onGenerateQuote?: (input: PricingInput, breakdown: PricingBreakdown) => void
  /** Additional className */
  className?: string
}
```

## Customization

### Styling

Override colors in the `@theme` block in `tokens.css`:

```css
@theme {
  /* Override brand colors */
  --color-accent-strong: #your-brand-color;
  --color-accent: #your-brand-color;
  --color-primary: #your-text-color;
}
```

### Layout

The component is designed to be full-width. Wrap it in a container to constrain width:

```tsx
<div className="max-w-4xl mx-auto">
  <PricingCalculator />
</div>
```

## File Structure

```
pricing-calculator-ultimate/
├── setup.sh                 # One-command setup script
├── PricingCalculator.tsx    # Main component
├── tokens.css               # Design tokens (includes @theme for Tailwind v4)
├── README.md                # This file
├── dependencies.md          # Full dependency docs
├── example-usage.tsx        # Example implementation
├── lib/
│   └── utils.ts             # cn() utility function
└── ui/
    ├── app-card.tsx
    ├── button.tsx
    ├── input.tsx
    ├── label.tsx
    ├── select.tsx
    ├── slider.tsx
    └── tooltip.tsx
```

## Requirements

- React 18+
- **Tailwind CSS v4** (uses `@theme` block, not `tailwind.config.js`)
- Node.js 18+
- Vite 5+ (recommended)

## Included Components

| Component | Description |
|-----------|-------------|
| `AppCard` | Card container with header and body sections |
| `Button` | Button with multiple variants (default, accent, outline, etc.) |
| `Input` | Text input with validation states |
| `Label` | Accessible form label |
| `Select` | Dropdown select with search |
| `Slider` | Range slider with value display |
| `Tooltip` | Information tooltip on hover |

## License

Part of the Disrupt Design System.
