# Apply Responsive Patterns



**Category:** responsive | **Tags:** responsive, mobile, tablet, breakpoints
**Variables:** `{COMPONENT}`

---

Apply responsive patterns to {COMPONENT}.

## Step 1: Understand User Context (MAYA Principle)

Before deciding strategy, ask:
- Who uses this on mobile? What's their task?
- What's the *minimum viable mobile experience*?
- Can we simplify rather than block?

## Step 2: Choose Strategy

| UI Type | Strategy | Mobile Experience |
|---------|----------|-------------------|
| Lists, cards, content | Mobile-first | Full functionality |
| Dashboards, tables | Tablet-first | Simplified card view |
| Complex forms | Progressive | Core fields mobile, advanced desktop |
| Drag-and-drop | Desktop-enhanced | Alternative interaction on mobile |

**MAYA reminder:** "Desktop Required" is a last resort, not a default. Most users expect *some* mobile functionality. Anchor to familiar mobile patterns (swipe, tap-to-expand) before blocking.

## Step 3: Implement Pattern

### Mobile-First (default)
```tsx
<div className="px-4 sm:px-6 lg:px-8">
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
```

### Progressive Enhancement (complex UIs)
```tsx
// Mobile: essential features
<div className="lg:hidden">
  <SimplifiedView data={data} />
  <p className="text-muted text-xs mt-2">More options on larger screens</p>
</div>
// Desktop: full features
<div className="hidden lg:block">
  <FullEditor data={data} />
</div>
```

### Truly Desktop-Only (validate first!)
Only use if you've confirmed:
- [ ] Mobile users don't need this task
- [ ] No simplified alternative exists
- [ ] Users understand why (clear messaging)

## Breakpoints
| Prefix | Width | Use |
|--------|-------|-----|
| (none) | 0+ | Base mobile |
| `sm:` | 640px | Large phones |
| `md:` | 768px | Tablets |
| `lg:` | 1024px | Laptops |

## Universal Requirements
- Touch targets ≥44px
- Text ≥16px (prevents iOS zoom)
- No horizontal scroll

OUTPUT:
1. Strategy with user-context justification
2. Responsive component with progressive enhancement

---

*Auto-generated from `prompts.ts` — edit source, run `npm run sync:prompts`*
