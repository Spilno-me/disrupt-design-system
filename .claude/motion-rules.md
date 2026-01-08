# Motion Token Rules

> Inspired by [Vibe Design System](https://vibe.monday.com) - Productive (functional) vs Expressive (delightful)

## Quick Reference

### Duration Tokens

| Category | Token | Value | Use Case |
|----------|-------|-------|----------|
| **Productive** | `--motion-duration-productive-short` | 70ms | Micro-interactions, hover states |
| | `--motion-duration-productive-medium` | 100ms | Toggles, checkboxes, small buttons |
| | `--motion-duration-productive-long` | 150ms | Tooltips appearing, small transitions |
| **Expressive** | `--motion-duration-expressive-short` | 250ms | Cards, modals, medium elements |
| | `--motion-duration-expressive-long` | 400ms | Page transitions, hero animations |

### Easing Curves

| Token | Value | Use Case |
|-------|-------|----------|
| `--motion-easing-enter` | `cubic-bezier(0, 0, 0.35, 1)` | Elements appearing (fast start, slow end) |
| `--motion-easing-exit` | `cubic-bezier(0.4, 0, 1, 1)` | Elements leaving (slow start, fast end) |
| `--motion-easing-transition` | `cubic-bezier(0.4, 0, 0.2, 1)` | On-screen state changes |
| `--motion-easing-emphasize` | `cubic-bezier(0, 0, 0.2, 1.4)` | Attention/bounce (subtle overshoot) |

### Delay Tokens

| Token | Value | Use Case |
|-------|-------|----------|
| `--motion-delay-short` | 50ms | Quick stagger between items |
| `--motion-delay-normal` | 100ms | Standard delay |
| `--motion-delay-long` | 200ms | Pronounced stagger |

---

## Usage Guidelines

### Productive vs Expressive

```
┌─────────────────────────────────────────────────────────────┐
│ PRODUCTIVE (70-150ms)          │ EXPRESSIVE (250-400ms)     │
│ Quick, functional              │ Emphasizing, delightful    │
├────────────────────────────────┼────────────────────────────┤
│ ✓ Hover states                 │ ✓ Modal open/close         │
│ ✓ Button press                 │ ✓ Card expand              │
│ ✓ Toggle switches              │ ✓ Page transitions         │
│ ✓ Tooltip appear               │ ✓ Hero animations          │
│ ✓ Checkbox check               │ ✓ Skeleton → content       │
└────────────────────────────────┴────────────────────────────┘
```

### Enter vs Exit Easing

```
ENTER (elements appearing):
  → Use --motion-easing-enter
  → Fast start, slow end (decelerate into place)
  → "Sliding into view"

EXIT (elements leaving):
  → Use --motion-easing-exit
  → Slow start, fast end (accelerate away)
  → "Being dismissed"

TRANSITION (state changes):
  → Use --motion-easing-transition
  → Smooth both ways
  → "Morphing in place"

EMPHASIZE (attention):
  → Use --motion-easing-emphasize
  → Subtle overshoot (1.4 > 1.0)
  → "Look at me!" (use sparingly)
```

### Distance Rule

```
Short distance (< 100px)  → productive-short (70ms)
Medium distance (100-300px) → productive-long (150ms) or expressive-short (250ms)
Long distance (> 300px)   → expressive-long (400ms)
```

---

## CSS Usage

```css
/* Button hover */
.button {
  transition:
    background-color var(--motion-duration-productive-short) var(--motion-easing-transition),
    transform var(--motion-duration-productive-short) var(--motion-easing-transition);
}

/* Modal enter */
.modal-enter {
  animation: slideIn var(--motion-duration-expressive-short) var(--motion-easing-enter);
}

/* Modal exit */
.modal-exit {
  animation: slideOut var(--motion-duration-expressive-short) var(--motion-easing-exit);
}

/* Staggered list */
.list-item:nth-child(1) { animation-delay: calc(var(--motion-delay-short) * 0); }
.list-item:nth-child(2) { animation-delay: calc(var(--motion-delay-short) * 1); }
.list-item:nth-child(3) { animation-delay: calc(var(--motion-delay-short) * 2); }
```

---

## Framer Motion Usage

```tsx
import { MOTION } from '@adrozdenko/design-system'

// Enter animation
const enterVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.25, // expressiveShort in seconds
      ease: MOTION.easing.enterArray, // [0, 0, 0.35, 1]
    }
  }
}

// Exit animation
const exitVariants = {
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.15, // productiveLong in seconds
      ease: MOTION.easing.exitArray, // [0.4, 0, 1, 1]
    }
  }
}

// Attention animation
const bounceVariants = {
  attention: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 0.25,
      ease: MOTION.easing.emphasizeArray, // [0, 0, 0.2, 1.4]
    }
  }
}
```

---

## Decision Tree

```
What type of animation?
│
├─ User initiated (click, hover) ──────→ PRODUCTIVE
│   └─ How important?
│       ├─ Micro-feedback ────────────→ productive-short (70ms)
│       ├─ State change ──────────────→ productive-medium (100ms)
│       └─ Contextual reveal ─────────→ productive-long (150ms)
│
├─ System initiated (appear, load) ────→ EXPRESSIVE
│   └─ How much content?
│       ├─ Single element ────────────→ expressive-short (250ms)
│       └─ Full page/hero ────────────→ expressive-long (400ms)
│
└─ Direction?
    ├─ Appearing ─────────────────────→ easing-enter
    ├─ Disappearing ──────────────────→ easing-exit
    ├─ Transforming ──────────────────→ easing-transition
    └─ Drawing attention ─────────────→ easing-emphasize
```

---

## Common Patterns

| Pattern | Duration | Easing | Example |
|---------|----------|--------|---------|
| Hover effect | productive-short | transition | Button bg change |
| Focus ring | productive-short | transition | Input focus |
| Toggle | productive-medium | transition | Switch on/off |
| Tooltip show | productive-long | enter | Hover tooltip |
| Tooltip hide | productive-short | exit | Leave tooltip |
| Modal open | expressive-short | enter | Dialog appear |
| Modal close | expressive-short | exit | Dialog dismiss |
| Card expand | expressive-short | transition | Accordion open |
| Page load | expressive-long | enter | Route transition |
| Notification | expressive-short | emphasize | Toast appear |

---

## Forbidden

```
❌ Using generic "ease" or "linear" - use semantic curves
❌ Durations < 70ms - imperceptible
❌ Durations > 500ms for functional UI - feels sluggish
❌ Mixing enter/exit easings incorrectly
❌ Overusing emphasize curve - loses impact
❌ No animation on state changes - feels broken
```
