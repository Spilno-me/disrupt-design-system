---
name: warn-new-ui-component
enabled: true
event: file
conditions:
  - field: file_path
    operator: regex_match
    pattern: ^src/components/ui/[^/]+\.tsx$
  - field: old_text
    operator: equals
    pattern: ""
action: warn
---

**⚠️ Creating New UI Component**

You're creating a new component in `src/components/ui/`. Before proceeding, please verify:

**CHECKLIST:**
- [ ] Did you check if this component already exists?
- [ ] Is this component truly reusable (not one-off)?
- [ ] Have you reviewed the existing components list in CLAUDE.md?

**From CLAUDE.md:**
> **ALWAYS check for existing components first** - Never build what already exists

**DDS has 50+ components including:**
- **Forms:** Button, Input, Textarea, Checkbox, Select, Form
- **Layout:** Card, SectionWrapper, PageLayout
- **Overlays:** Dialog, Sheet, DropdownMenu, Tooltip
- **Data:** DataTable, Pagination, Tabs, Badge, Skeleton
- **Navigation:** AppHeader, AppSidebar, MobileNav, BottomNav
- **Images:** OptimizedImage, ParallaxImage, BlurImage
- **Auth:** LoginForm, ForgotPasswordForm, AuthLayout
- **And many more...**

**If building a new component:**

1. **Use Radix UI for interactive components:**
   ```tsx
   import * as Dialog from '@radix-ui/react-dialog'
   import * as Select from '@radix-ui/react-select'
   ```

2. **Style with DDS tokens ONLY:**
   ```tsx
   // Use Tailwind semantic classes
   className="bg-surface text-primary border-default rounded-lg"

   // For dynamic values, use ALIAS
   import { ALIAS, SHADOWS, RADIUS } from '@/constants/designTokens'
   style={{
     backgroundColor: isActive ? ALIAS.interactive.accent : ALIAS.background.surface,
     boxShadow: SHADOWS.md
   }}
   ```

3. **Create a story file:**
   - `src/components/ui/{component}.stories.tsx`
   - Document all variants and props

**Reference:** See "Building New Components" section in CLAUDE.md

If you're sure this component doesn't exist, you may proceed. Otherwise, please use an existing component.
