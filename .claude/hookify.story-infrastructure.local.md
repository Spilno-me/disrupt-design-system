---
name: story-infrastructure
enabled: true
event: file
action: warn
conditions:
  - field: file_path
    operator: regex_match
    pattern: \.stories\.tsx$
  - field: content
    operator: regex_match
    pattern: const meta.*Meta<
  - field: content
    operator: not_contains
    pattern: _infrastructure
---

## Warning: Story Missing Infrastructure Import

**Stories should use shared meta configurations.**

```tsx
// ❌ Manual meta setup
const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  parameters: { ... },  // Duplicated everywhere
};

// ✅ Use infrastructure
import { ATOM_META } from '../../stories/_infrastructure';
// or MOLECULE_META, PAGE_META

const meta: Meta<typeof Button> = {
  ...ATOM_META,
  title: 'UI/Button',
  component: Button,
};
```

**Available metas:**
- `ATOM_META` - Small UI primitives (Button, Badge, Input)
- `MOLECULE_META` - Composed components (Card, Dialog)
- `PAGE_META` - Full page stories

**Ref:** `src/stories/_infrastructure/`
