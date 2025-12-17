# TenantProvisioningChat Component

A modern, conversational tenant provisioning component with **Hybrid Chat-Form UX** pattern. This component combines the guidance of a conversational assistant with efficient inline form cards.

## Features

- **Hybrid UX Pattern**: Chat guidance + inline form sections (not individual questions)
- **4 Logical Sections**: Company, Contact, Billing, Subscription (instead of 13 individual steps)
- **AI Tips**: Contextual guidance after each form section
- **Progress Tracking**: Visual progress bar showing completion
- **Review & Edit**: Full review screen before final submission
- **Animations**: Smooth Framer Motion transitions
- **Responsive**: Mobile-first design with proper touch targets
- **Accessible**: Built on Radix UI primitives with full ARIA support

## UX Improvements

This component implements a significant UX improvement over traditional step-by-step chat bots:

| Metric | Traditional Bot | Hybrid Chat-Form |
|--------|-----------------|------------------|
| Interactions | 26 clicks | ~5 clicks |
| Time to complete | 3-5 minutes | 1-2 minutes |
| User fatigue | High (confirmation fatigue) | Low |
| Data visibility | One field at a time | Full section view |

## Installation

### Prerequisites

- React 18+
- Tailwind CSS v4
- Node.js 18+

### Quick Setup

```bash
# Make setup script executable
chmod +x setup.sh

# Run setup
./setup.sh
```

### Manual Installation

```bash
npm install \
  react \
  react-dom \
  @radix-ui/react-dialog \
  @radix-ui/react-label \
  @radix-ui/react-select \
  @radix-ui/react-slot \
  class-variance-authority \
  clsx \
  tailwind-merge \
  lucide-react \
  framer-motion

# Dev dependencies
npm install --save-dev tailwindcss @tailwindcss/postcss postcss
```

## File Structure

```
tenant-provisioning-chat/
├── TenantProvisioningChat.tsx  # Main component
├── tokens.css                   # Design tokens (@theme block)
├── lib/
│   └── utils.ts                 # Utility functions (cn)
├── ui/
│   ├── button.tsx               # Button component
│   ├── input.tsx                # Input component
│   ├── label.tsx                # Label component
│   ├── select.tsx               # Select component
│   └── dialog.tsx               # Dialog component
├── setup.sh                     # Setup script
└── README.md                    # This file
```

## Usage

### Basic Usage

```tsx
import { TenantProvisioningChat } from './tenant-provisioning-chat';
import type { TenantChatFormData } from './tenant-provisioning-chat';

function App() {
  const handleSubmit = (data: TenantChatFormData) => {
    console.log('Form submitted:', data);
    // Send to your API
  };

  return (
    <TenantProvisioningChat onSubmit={handleSubmit} />
  );
}
```

### With Initial Data (Resume Flow)

```tsx
import { TenantProvisioningChat } from './tenant-provisioning-chat';

function App() {
  const savedData = {
    companyName: 'Acme Corp',
    industry: 'technology',
    // ... other fields
  };

  return (
    <TenantProvisioningChat
      initialData={savedData}
      onSubmit={(data) => console.log(data)}
    />
  );
}
```

### Styling Integration

Import the tokens in your main CSS file:

```css
/* In your globals.css or tailwind.css */
@import "tailwindcss";
@import "./components/tenant-provisioning-chat/tokens.css";
```

## API Reference

### TenantProvisioningChat Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `onSubmit` | `(data: TenantChatFormData) => void` | Yes | Callback when form is submitted |
| `initialData` | `Partial<TenantChatFormData>` | No | Pre-fill form with existing data |

### TenantChatFormData Type

```typescript
interface TenantChatFormData {
  // Company Information
  companyName: string;
  industry: string;
  companySize: string;

  // Primary Contact
  contactName: string;
  contactEmail: string;
  contactPhone: string;

  // Billing Address
  billingStreet: string;
  billingCity: string;
  billingCountry: string;
  billingState: string;
  billingZip: string;

  // Subscription
  pricingTier: 'starter' | 'professional' | 'enterprise';
  billingCycle: 'monthly' | 'annual';
}
```

## Customization

### Modifying Design Tokens

Edit `tokens.css` to customize colors:

```css
@theme {
  /* Change primary accent color */
  --color-deep-current-500: #your-brand-color;

  /* Change surface colors */
  --color-surface: #ffffff;
  --color-page: #f8fafc;
}
```

### Adding/Removing Form Sections

Edit the `SECTIONS` array in `TenantProvisioningChat.tsx`:

```typescript
const SECTIONS: FormSection[] = [
  {
    id: 'custom',
    title: 'Custom Section',
    fields: ['field1', 'field2'],
    aiTip: 'Helpful tip for this section'
  },
  // ... other sections
];
```

### Customizing AI Tips

Each section can have an optional `aiTip` that appears after the section is completed:

```typescript
{
  id: 'company',
  title: 'Company Information',
  fields: ['companyName', 'industry', 'companySize'],
  aiTip: 'Your custom tip message here!'
}
```

## Form Sections

The component groups fields into 4 logical sections:

1. **Company Information**
   - Company Name
   - Industry (dropdown)
   - Company Size (dropdown)

2. **Primary Contact**
   - Contact Name
   - Email
   - Phone

3. **Billing Address**
   - Street Address
   - City
   - Country (dropdown)
   - State/Province
   - ZIP/Postal Code

4. **Subscription**
   - Pricing Tier (Starter/Professional/Enterprise)
   - Billing Cycle (Monthly/Annual)

## Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `react` | ^18.0.0 | Core library |
| `@radix-ui/react-dialog` | ^1.0.0 | Accessible dialogs |
| `@radix-ui/react-label` | ^2.0.0 | Form labels |
| `@radix-ui/react-select` | ^2.0.0 | Dropdown selects |
| `@radix-ui/react-slot` | ^1.0.0 | Component composition |
| `class-variance-authority` | ^0.7.0 | Variant styling |
| `clsx` | ^2.0.0 | Class concatenation |
| `tailwind-merge` | ^2.0.0 | Tailwind class merging |
| `lucide-react` | ^0.300.0 | Icons |
| `framer-motion` | ^11.0.0 | Animations |

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Accessibility

- Full keyboard navigation
- Screen reader support via ARIA attributes
- Focus management
- High contrast support
- Reduced motion support (respects `prefers-reduced-motion`)

## License

MIT License - See LICENSE file for details.
