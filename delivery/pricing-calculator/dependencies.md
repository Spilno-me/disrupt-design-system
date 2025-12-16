# Dependencies

## Required NPM Packages

```json
{
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "lucide-react": "^0.300.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/react": "^18.0.0"
  }
}
```

## UI Components Needed

The PricingCalculator uses these UI primitives. You can use:
- **shadcn/ui** (recommended)
- **Radix UI** + custom styling
- **Your existing component library**

### Components Required:

| Component | shadcn/ui | Radix UI |
|-----------|-----------|----------|
| Button | `npx shadcn@latest add button` | `@radix-ui/react-slot` |
| Input | `npx shadcn@latest add input` | Native `<input>` |
| Label | `npx shadcn@latest add label` | `@radix-ui/react-label` |
| Select | `npx shadcn@latest add select` | `@radix-ui/react-select` |
| Slider | `npx shadcn@latest add slider` | `@radix-ui/react-slider` |
| Tooltip | `npx shadcn@latest add tooltip` | `@radix-ui/react-tooltip` |
| Card | `npx shadcn@latest add card` | Native `<div>` with styles |

## Install All shadcn/ui Components

```bash
npx shadcn@latest add button input label select slider tooltip card
```

## Tailwind CSS Configuration

If using Tailwind, add these to your `tailwind.config.js`:

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#2D3142',
        secondary: '#5E4F7E',
        muted: '#5E4F7E',
        accent: '#08A4BD',
        success: '#22C55E',
        surface: '#FFFFFF',
        page: '#FBFBF3',
        'accent-bg': '#E6F7FA',
        'accent-strong': '#08A4BD',
        default: '#CBD5E1',
        subtle: '#D1D3D7',
        strong: '#757B87',
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
      },
    },
  },
}
```
