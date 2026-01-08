# Create Mock API Data



**Category:** review | **Tags:** api, mock, seed-data, testing, storybook
**Variables:** `{ENTITY}`

---

Create mock API data for {ENTITY}.

READ FIRST: `src/stories/developers/ApiSimulation.mdx`

## Seed Data Structure

```tsx
// lib/mock-data/entities/{entity}.ts

export interface {ENTITY} {
  id: string
  // ... entity fields
}

// Seed data - realistic examples
export const SEED_{ENTITY}S: {ENTITY}[] = [
  {
    id: '{entity}-001',
    // Realistic, not "Test 1", "Lorem ipsum"
  },
]

// Helper to get by ID
export function get{ENTITY}ById(id: string): {ENTITY} | undefined {
  return SEED_{ENTITY}S.find(e => e.id === id)
}

// Helper to filter/search
export function search{ENTITY}s(query: string): {ENTITY}[] {
  return SEED_{ENTITY}S.filter(e =>
    e.name.toLowerCase().includes(query.toLowerCase())
  )
}
```

## Dual-ID Pattern (for related entities)

```tsx
// ❌ Inconsistent IDs
{ id: '1', userId: 'u1' }  // Which is the user?

// ✅ Dual-ID pattern
{
  id: 'order-001',        // Entity's own ID
  userId: 'user-001',     // FK reference (matches User.id)
  user: SEED_USERS[0],    // Denormalized for convenience
}
```

## Realistic Data Guidelines

| Field Type | Bad | Good |
|------------|-----|------|
| Name | "Test User" | "Sarah Chen" |
| Email | "test@test.com" | "sarah.chen@acme.io" |
| Status | "status1" | "active", "pending" |
| Date | "2024-01-01" | Relative: "2 hours ago" |

## Story Usage

```tsx
// Component.stories.tsx
import { SEED_USERS, getUserById } from '@/lib/mock-data'

export const Default: Story = {
  args: {
    users: SEED_USERS.slice(0, 5),
  },
}

export const SingleUser: Story = {
  args: {
    user: getUserById('user-001'),
  },
}
```

## Output
- Seed data file with realistic examples
- Helper functions (getById, search, filter)
- Types matching real API contract
- Story examples using mock data

---

*Auto-generated from `prompts.ts` — edit source, run `npm run sync:prompts`*
