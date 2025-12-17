# PricingCalculator Component Delivery

**Version:** Standalone (extracted from DDS v2.4.0)
**Date:** 2025-12-16
**Status:** Reference implementation for re-implementation

---

## Contents

```
pricing-calculator/
├── README.md                    # This file
├── PricingCalculator.tsx        # Main component (React + TypeScript)
├── tokens.css                   # Design tokens (CSS variables)
├── example-usage.tsx            # How to use the component
└── dependencies.md              # Required packages
```

---

## Quick Start

### 1. Install Dependencies

```bash
npm install lucide-react class-variance-authority clsx tailwind-merge
```

### 2. Copy Files

1. Copy `PricingCalculator.tsx` to your components folder
2. Copy `tokens.css` to your styles folder
3. Import the CSS in your app entry point

### 3. Import & Use

```tsx
import { PricingCalculator } from './components/PricingCalculator';
import './styles/tokens.css';

function App() {
  return (
    <PricingCalculator
      commissionPercentage={15}
      onCalculate={(input, breakdown) => console.log(input, breakdown)}
      onGenerateQuote={(input, breakdown) => console.log('Quote:', breakdown)}
    />
  );
}
```

---

## Design Tokens

The component uses semantic CSS variables. You can customize by overriding in your own CSS:

| Token | Default | Usage |
|-------|---------|-------|
| `--color-primary` | #2D3142 | Main text |
| `--color-secondary` | #5E4F7E | Secondary text |
| `--color-muted` | #5E4F7E | Muted/placeholder text |
| `--color-accent` | #08A4BD | Accent elements |
| `--color-success` | #22C55E | Success states |
| `--color-surface` | #FFFFFF | Card backgrounds |
| `--color-accent-bg` | #E6F7FA | Highlight backgrounds |

---

## Component Props

```typescript
interface PricingCalculatorProps {
  /** Partner's commission percentage (default: 15%) */
  commissionPercentage?: number;

  /** Callback when pricing is calculated */
  onCalculate?: (input: PricingInput, breakdown: PricingBreakdown) => void;

  /** Callback when "Generate Quote" is clicked */
  onGenerateQuote?: (input: PricingInput, breakdown: PricingBreakdown) => void;

  /** Additional className */
  className?: string;
}
```

---

## Notes for Re-implementation

1. **UI Components Used:**
   - Cards (with shadow)
   - Buttons (accent + secondary variants)
   - Inputs (number type)
   - Labels
   - Slider
   - Select dropdowns
   - Tooltips

2. **Layout:**
   - 3-column grid on desktop (2 cols input, 1 col summary)
   - Single column on mobile
   - Sticky summary card

3. **Spacing:**
   - 24px gap between cards
   - 16px gap within cards
   - 8px gap for form labels

4. **Border Radius:**
   - Cards: 16px
   - Inner elements: 12px
   - Inputs/Buttons: 8px

---

## Support

This is a reference implementation. For questions, contact the design system team.
