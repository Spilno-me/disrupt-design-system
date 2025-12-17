# TenantProvisioningChat Component

A modern, conversational tenant provisioning component with **Hybrid Chat-Form UX** pattern.

## Quick Start (One Command)

```bash
# 1. Unzip and enter directory
unzip tenant-provisioning-chat.zip
cd tenant-provisioning-chat

# 2. Run setup (installs everything and creates project files)
chmod +x setup.sh
./setup.sh

# 3. Start dev server
npm run dev
# or: yarn dev / pnpm dev
```

Open **http://localhost:5173** - that's it!

## Features

- **Hybrid UX Pattern**: Chat guidance + inline form sections
- **4 Logical Sections**: Company, Contact, Billing, Subscription
- **AI Tips**: Contextual guidance after each form section
- **Progress Tracking**: Visual progress bar
- **Animations**: Smooth Framer Motion transitions
- **Responsive**: Mobile-first design
- **Accessible**: Built on Radix UI primitives

## UX Improvements

| Metric | Traditional Bot | Hybrid Chat-Form |
|--------|-----------------|------------------|
| Interactions | 26 clicks | ~5 clicks |
| Time to complete | 3-5 minutes | 1-2 minutes |
| User fatigue | High | Low |

## Manual Installation

If you prefer manual setup instead of the setup script:

```bash
# Runtime dependencies
npm install react react-dom @radix-ui/react-dialog @radix-ui/react-label \
  @radix-ui/react-select @radix-ui/react-slot class-variance-authority \
  clsx tailwind-merge lucide-react framer-motion

# Dev dependencies
npm install -D vite @vitejs/plugin-react tailwindcss @tailwindcss/vite \
  typescript @types/react @types/react-dom
```

**CRITICAL**: Your `vite.config.ts` MUST include React deduplication:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom', 'framer-motion'],
    alias: {
      react: path.resolve('./node_modules/react'),
      'react-dom': path.resolve('./node_modules/react-dom'),
    },
  },
})
```

## File Structure

```
tenant-provisioning-chat/
├── TenantProvisioningChat.tsx  # Main component
├── tokens.css                   # Design tokens (@theme block)
├── lib/
│   └── utils.ts                 # Utility functions
├── ui/                          # UI sub-components
│   ├── button.tsx
│   ├── input.tsx
│   ├── label.tsx
│   ├── select.tsx
│   └── dialog.tsx
├── templates/                   # Project scaffolding
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── index.html
│   └── src/
├── setup.sh                     # One-click setup
├── README.md
├── LESSONS-LEARNED.md           # Troubleshooting guide
└── example-usage.tsx
```

## Usage

### Basic Usage

```tsx
import { TenantProvisioningChat } from './tenant-provisioning-chat/TenantProvisioningChat';
import type { TenantChatFormData } from './tenant-provisioning-chat/TenantProvisioningChat';

function App() {
  const handleSubmit = (data: TenantChatFormData) => {
    console.log('Form submitted:', data);
  };

  return <TenantProvisioningChat onSubmit={handleSubmit} />;
}
```

### With Initial Data (Resume Flow)

```tsx
<TenantProvisioningChat
  initialData={{
    companyName: 'Acme Corp',
    industry: 'technology',
  }}
  onSubmit={handleSubmit}
/>
```

## API Reference

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `onSubmit` | `(data: TenantChatFormData) => void` | Yes | Callback when form is submitted |
| `initialData` | `Partial<TenantChatFormData>` | No | Pre-fill form with existing data |

### TenantChatFormData Type

```typescript
interface TenantChatFormData {
  companyName: string;
  industry: string;
  companySize: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  billingStreet: string;
  billingCity: string;
  billingCountry: string;
  billingState: string;
  billingZip: string;
  pricingTier: 'starter' | 'professional' | 'enterprise';
  billingCycle: 'monthly' | 'annual';
}
```

## Troubleshooting

### "Invalid hook call" Error

**Symptom:**
```
Invalid hook call. Hooks can only be called inside of the body of a function component.
```

**Cause:** Multiple React copies (framer-motion bundles its own React)

**Solution:** Add React dedupe to your vite.config.ts:
```typescript
resolve: {
  dedupe: ['react', 'react-dom', 'framer-motion'],
}
```

### Missing Styles / Broken UI

**Symptom:** Select dropdowns or inputs look unstyled

**Solution:** Ensure tokens.css is imported:
```css
@import "tailwindcss";
@import "./tenant-provisioning-chat/tokens.css";
```

### Import Errors

**Symptom:** `Cannot find module '../lib/utils'`

**Solution:** Ensure the package folder structure is intact. Don't move individual files.

---

See **LESSONS-LEARNED.md** for more detailed troubleshooting.

## Dependencies

| Package | Purpose |
|---------|---------|
| `react` | Core library |
| `framer-motion` | Animations |
| `@radix-ui/*` | Accessible UI primitives |
| `class-variance-authority` | Variant styling |
| `tailwind-merge` | Class merging |
| `lucide-react` | Icons |

## License

MIT
