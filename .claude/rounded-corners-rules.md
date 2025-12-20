# Rounded Corners Rules

**NEVER hardcoded pixels. ALWAYS tokens.**

```tsx
// ❌ style={{ borderRadius: '12px' }} | className="rounded-[12px]"
// ✅ className="rounded-md" | style={{ borderRadius: RADIUS.md }}
```

## Tokens

| Token | px | Tailwind | Use |
|-------|-----|----------|-----|
| none | 0 | `rounded-none` | Sharp |
| xs | 4 | `rounded-xs` | Badges, chips |
| sm | 8 | `rounded-sm` | Buttons, inputs |
| md | 12 | `rounded-md` | Cards, dialogs |
| lg | 16 | `rounded-lg` | Large cards |
| xl | 20 | `rounded-xl` | Hero sections |
| 2xl | 24 | `rounded-2xl` | Feature cards |
| 3xl | 32 | `rounded-3xl` | Full-width |
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
| Card/Dialog | `md`/`lg` |
| Section/Hero | `xl`/`2xl` |
| Nested | Apply formula |

## Per-Corner

```
rounded-t-*  top     rounded-tl-*  top-left
rounded-b-*  bottom  rounded-tr-*  top-right
rounded-l-*  left    rounded-bl-*  bottom-left
rounded-r-*  right   rounded-br-*  bottom-right
```
