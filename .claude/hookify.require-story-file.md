---
name: require-story-file
enabled: true
event: file
conditions:
  - field: file_path
    operator: regex_match
    pattern: src/components/ui/[A-Z][^/]+\.tsx$
  - field: file_path
    operator: not_contains
    pattern: .stories.
---

## Story Required

Every UI component needs `ComponentName.stories.tsx`.

```
src/components/ui/
├── Button.tsx          ← You're here
├── Button.stories.tsx  ← REQUIRED
└── index.ts
```

```tsx
import { ATOM_META } from '../../stories/_infrastructure';

const meta: Meta<typeof Component> = {
  ...ATOM_META,
  title: 'UI/Component',
  component: Component,
};

export const Default: Story = { args: { children: 'Text' } };
export const AllStates: Story = { render: () => <StorySection>...</StorySection> };
```

Ref: `.claude/storybook-rules.md`
