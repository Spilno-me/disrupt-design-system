# Storybook Rules - Stories Reflect Reality

**Date:** 2025-12-13
**Philosophy:** Stories document real component behavior, NOT idealized versions

---

## 🎯 Core Principle

**Stories MUST reflect the actual component code, not hardcoded overrides.**

### ✅ CORRECT Approach
```tsx
// Change the COMPONENT
export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "focus-visible:border-blue-600 focus-visible:ring-blue-600/40"
        // ↑ Real component behavior
      )}
    />
  )
}

// Story shows REAL behavior
export const AllStates: Story = {
  render: () => (
    <Input autoFocus />  // Uses component's actual focus ring
  )
}
```

### ❌ WRONG Approach
```tsx
// Component has teal focus ring
export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "focus-visible:border-accent"  // Teal
      )}
    />
  )
}

// Story OVERRIDES with hardcoded blue
export const AllStates: Story = {
  render: () => (
    <Input
      className="!border-blue-600 !ring-blue-600"  // ❌ Hardcoded override
    />
  )
}
```

**Problem:** Stories show blue, real components use teal. Mismatch!

---

## 📋 Rules

### Rule 1: Change Source, Not Stories
**When you need to change appearance:**
1. ✅ Change the **component code** or **design tokens**
2. ✅ Stories automatically reflect the change
3. ❌ DON'T hardcode values in stories

### Rule 2: Use autoFocus for State Visibility
**To show focus states without interaction:**
```tsx
// ✅ CORRECT: Use autoFocus (uses real focus ring)
<Input autoFocus />

// ❌ WRONG: Hardcode focus styles
<Input className="!border-blue-600 !ring-4" />
```

### Rule 3: Only Override When Explicitly Requested
**Stories can use className overrides ONLY if:**
- User explicitly asks to "show it differently in the story"
- Demonstrating customization capabilities
- Showing "what if" scenarios

**Default:** Always show real component behavior

### Rule 4: State Simulation Must Match Reality
**If simulating hover/focus/active:**
```tsx
// ✅ CORRECT: Use same classes component uses
<Button className="hover:bg-inverse-bg/90" />
// ↑ Matches component's hover class

// ❌ WRONG: Use different colors
<Button className="!bg-blue-500" />  // Component doesn't use blue
```

---

## 🧪 Testing States Pattern

### Use Real Browser States
```tsx
// Focus states
<Input autoFocus />                    // Real focus
<Checkbox autoFocus />                 // Real focus

// Checked states
<Checkbox defaultChecked />            // Real checked

// Disabled states
<Input disabled />                     // Real disabled

// Error states
<Input aria-invalid="true" />          // Real error
```

### For Hover (Can't autoHover)
**Document that user must interact:**
```tsx
// Hover State (Hover over to see)
<div>
  <h4>Hover State (Hover Mouse to See)</h4>
  <Button>Hover over me</Button>
</div>
```

**OR use data attributes if component supports:**
```tsx
<Button data-hover="true" />  // If component has [data-hover]:styles
```

---

## 🎯 Focus Ring Example (Correct)

### What We Did for Focus Ring Color Change

**Step 1:** Changed design tokens (source of truth)
```css
/* src/styles/tokens.css */
--color-focus: #2563EB;  /* Changed from #08A4BD (teal) to dark blue */
--ring: #2563EB;          /* Changed ring color */
```

```typescript
/* src/constants/designTokens.ts */
ALIAS.border.focus = WAVE[600]  // Changed from DEEP_CURRENT[500]
```

**Step 2:** Stories use `autoFocus` (real behavior)
```tsx
export const AllStates: Story = {
  render: () => (
    <Input autoFocus />  // Shows REAL focus ring (now dark blue)
  )
}
```

**Result:**
- ✅ Component uses dark blue focus ring
- ✅ Story shows dark blue focus ring
- ✅ Reality = Documentation
- ✅ No hardcoded overrides

---

## 📝 Agent Guidelines

### When Creating Stories

**ALWAYS:**
1. Show real component behavior
2. Use `autoFocus` for focus states
3. Use `defaultChecked` for checked states
4. Use `disabled` for disabled states
5. Use `aria-invalid` for error states

**NEVER (unless explicitly requested):**
1. Hardcode colors in className (`!bg-blue-600`)
2. Override component styles in stories
3. Show ideal behavior that doesn't match component
4. Use inline styles to fake states

### When User Requests Visual Change

**Process:**
1. Ask: "Should I change the component or just the story?"
2. Default: Change the component (or tokens)
3. If user says "just the story", then override is OK
4. Document why the story differs from component

---

##Examples

### ✅ Good Story (Reflects Reality)
```tsx
// Component
export function Button({ variant = 'default', ...props }) {
  return (
    <button
      className={cn(
        variant === 'default' && 'bg-inverse-bg text-inverse',
        'focus-visible:ring-blue-600/40'
      )}
      {...props}
    />
  )
}

// Story
export const AllStates = {
  render: () => (
    <div>
      <Button>Default</Button>          {/* Shows bg-inverse-bg */}
      <Button autoFocus>Focused</Button> {/* Shows blue ring */}
    </div>
  )
}
```

### ❌ Bad Story (Hardcoded Override)
```tsx
// Component
export function Button({ variant = 'default', ...props }) {
  return (
    <button
      className={cn(
        variant === 'default' && 'bg-inverse-bg',  // Dark navy
        'focus-visible:ring-accent/20'              // Light teal
      )}
      {...props}
    />
  )
}

// Story
export const AllStates = {
  render: () => (
    <div>
      <Button className="!bg-blue-500">Default</Button>      {/* ❌ Override */}
      <Button className="!ring-blue-600/50">Focused</Button> {/* ❌ Override */}
    </div>
  )
}
```

**Problem:** Story shows blue, component is navy/teal. Misleading!

---

## 🚀 Enforcement

### Agent Checklist
- [ ] Story uses `autoFocus` for focus states (not className override)
- [ ] Story uses component's real variants (not hardcoded colors)
- [ ] Story labels clearly state "Real Component Behavior"
- [ ] No `!important` overrides in stories (unless explicitly requested)
- [ ] If override needed, user explicitly requested it

### Hookify Rule (Future)
```yaml
- trigger:
    tool: "Write"
    filePattern: "src/components/.+\\.stories\\.tsx$"
  check: |
    📖 STORYBOOK → Stories reflect reality
    ❌ NO hardcoded color overrides (!bg-blue-500, style={{ color }})
    ✅ YES: autoFocus, defaultChecked, disabled, aria-invalid
    Change component/tokens first, then stories show real behavior
```

---

## 💡 Why This Matters

1. **Trust** - Designers/QA trust stories to show truth
2. **Consistency** - Stories match production
3. **Debugging** - If story looks wrong, component IS wrong
4. **Documentation** - Stories are source of truth for behavior

**Bad stories = misleading documentation**

---

**Last Updated:** 2025-12-13
**Status:** Active - Enforce in all story creation/updates
