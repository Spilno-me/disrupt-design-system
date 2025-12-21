# Rounded Corners Rules

**NEVER hardcoded pixels. ALWAYS tokens.**

```tsx
// ❌ style={{ borderRadius: '12px' }} | className="rounded-[12px]"
// ✅ className="rounded-md" | style={{ borderRadius: RADIUS.md }}
```

## Tokens

| Token | px | Tailwind | Use |
|-------|-----|----------|-----|
| none | 0 | `rounded-none` | Sharp edges |
| xs | 4 | `rounded-xs` | Badges, chips |
| sm | 8 | `rounded-sm` | Buttons, inputs |
| md | 12 | `rounded-md` | Nested containers |
| lg | 16 | `rounded-lg` | Medium containers |
| xl | 20 | `rounded-xl` | **Cards, dialogs, tables** |
| 2xl | 24 | `rounded-2xl` | Hero sections |
| 3xl | 32 | `rounded-3xl` | Full-width sections |
| full | 9999 | `rounded-full` | Pills, avatars |

## Nested Formula: Inner + Padding = Outer

```
Outer (20px) = Inner (12px) + Padding (8px)
```

| Inner | Padding | Outer |
|-------|---------|-------|
| xs (4) | xs (4) | sm (8) |
| sm (8) | xs (4) | md (12) |
| sm (8) | sm (8) | lg (16) |
| md (12) | sm (8) | xl (20) |
| lg (16) | sm (8) | 2xl (24) |

## Decision

| Type | Use |
|------|-----|
| Pill/Avatar | `full` |
| Badge/Chip | `xs`/`sm` |
| Button/Input | `sm` |
| Card/Dialog/Table | `xl` (20px) |
| Section/Hero | `2xl`/`3xl` |
| Nested | Apply formula |

## Per-Corner

```
rounded-t-*  top     rounded-tl-*  top-left
rounded-b-*  bottom  rounded-tr-*  top-right
rounded-l-*  left    rounded-bl-*  bottom-left
rounded-r-*  right   rounded-br-*  bottom-right
```
