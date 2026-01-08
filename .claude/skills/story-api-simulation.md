# Use API Simulation in Stories



**Category:** stories | **Tags:** storybook, api, simulation, seed-data, msw, zustand, qoe
**Variables:** `{COMPONENT_OR_PAGE}`

---

Configure {COMPONENT_OR_PAGE} story with proper API simulation.

## Core Principle: Component Purity

**Components are PURE. Data is INJECTED.**

```
❌ FORBIDDEN: Hardcoded data anywhere
   - No seed data in components
   - No inline mock arrays in stories
   - No "sampleData" or "dummyData" constants

✅ REQUIRED: Data from seed layer
   - Import from src/api/data/seed/
   - Use seed factories for dynamic data
   - Configure via props or store initialization
```

## DDS API Simulation Architecture

```
┌─────────────────────────────────────────────────────────┐
│ src/flow/data/             │ Raw mock data (58 users)  │
├─────────────────────────────────────────────────────────┤
│ src/api/data/seed/         │ Seed factories + exports  │
├─────────────────────────────────────────────────────────┤
│ src/api/core/store.ts      │ Zustand in-memory store   │
├─────────────────────────────────────────────────────────┤
│ src/api/services/*.api.ts  │ REST-like operations      │
├─────────────────────────────────────────────────────────┤
│ Stories                    │ Import seed, pass to props│
└─────────────────────────────────────────────────────────┘
```

## Step 1: Identify Data Needs

What data does {COMPONENT_OR_PAGE} require?

| Data Type | Seed Source |
|-----------|-------------|
| Users | `seedUsers` (58 pre-configured) |
| Incidents | `seedIncidents`, `generateManyIncidents(n)` |
| Locations | `seedLocations` (27 hierarchical) |
| Steps/Tasks | `seedSteps` |
| Roles | `seedRoles` |
| KPIs/Metrics | `seedEhsKpis`, `seedEhsAnalyticsKpis` |

## Step 2: Import from Seed Layer

```tsx
// ✅ CORRECT: Import from centralized seed layer
import {
  seedUsers,
  seedIncidents,
  seedLocations,
  generateManyIncidents,
  getIncidentsByStatus,
} from '../../api/data/seed'

// ❌ WRONG: Hardcoded inline data
const users = [
  { id: '1', name: 'John Doe' },  // NEVER DO THIS
]
```

## Step 3: Story Configuration Patterns

### Pattern A: Props Injection (Preferred for Pages/Organisms)
```tsx
import { seedIncidents, seedUsers } from '../../api/data/seed'
import { PAGE_META } from '../_infrastructure'

const meta: Meta<typeof DashboardPage> = {
  title: 'Pages/Dashboard',
  component: DashboardPage,
  ...PAGE_META,
}

export const Default: Story = {
  render: () => (
    <DashboardPage
      incidents={seedIncidents}
      users={seedUsers}
    />
  ),
}

// With filtered data
export const EmptyState: Story = {
  render: () => (
    <DashboardPage
      incidents={[]}
      users={seedUsers}
    />
  ),
}

// With factory-generated data
export const HighVolume: Story = {
  render: () => (
    <DashboardPage
      incidents={generateManyIncidents(500)}
      users={seedUsers}
    />
  ),
}
```

### Pattern B: Store Initialization (For Components Using Hooks)
```tsx
import { useApiStore } from '../../api/core/store'
import { seedUsers, seedIncidents } from '../../api/data/seed'

// Decorator to initialize store
const withApiStore = (Story: StoryFn) => {
  useApiStore.getState().initialize({
    users: seedUsers,
    incidents: seedIncidents,
  })
  return <Story />
}

export const Default: Story = {
  decorators: [withApiStore],
}
```

### Pattern C: API Config Override (For Testing Edge Cases)
```tsx
import { setApiConfig } from '../../api/core/config'

// Disable delays for faster story rendering
const withFastApi = (Story: StoryFn) => {
  setApiConfig({
    delays: { enabled: false },
    errors: { enabled: false },
  })
  return <Story />
}

// Enable high failure rate for error state testing
const withUnstableApi = (Story: StoryFn) => {
  setApiConfig({
    errors: { networkFailureRate: 0.5, enabled: true },
  })
  return <Story />
}
```

## Step 4: Seed Data Factories Reference

```tsx
// Available in src/api/data/seed/index.ts

// Static data
seedUsers           // 58 users with roles, departments
seedIncidents       // Pre-defined incident scenarios
seedLocations       // 27 hierarchical locations
seedRoles           // Role definitions
seedSteps           // Task/step data

// Factory functions
generateManyIncidents(count)    // Generate N incidents
getIncidentsByStatus(status)    // Filter by status
getSeedDepartments()            // List departments
getSeedJobTitles()              // List job titles
getIncidentStats()              // Aggregated stats

// Dashboard-specific
seedEhsKpis
seedEhsAnalyticsKpis
seedEhsTrends
```

## FORBIDDEN

```tsx
// ❌ Inline mock data
const mockData = [{ id: 1, name: 'Test' }]

// ❌ Data defined in component files
// In Component.tsx:
const DEFAULT_ITEMS = [...]  // NEVER

// ❌ "sample" or "dummy" prefixes
const sampleUsers = [...]
const dummyIncidents = [...]

// ❌ Random data generation in stories
const randomUser = { id: Math.random(), ... }

// ❌ Importing from flow/data directly in stories
import { mockUsers } from '../../flow/data/mockUsers'  // Go through seed layer
```

## REQUIRED

```tsx
// ✅ Import from seed layer
import { seedUsers } from '../../api/data/seed'

// ✅ Use factories for dynamic needs
import { generateManyIncidents } from '../../api/data/seed'

// ✅ Components receive data as props
<DataTable data={seedIncidents} />

// ✅ Use store for hook-based components
useApiStore.getState().initialize({ users: seedUsers })

// ✅ Clear naming in stories
export const WithManyIncidents: Story = { ... }
export const EmptyState: Story = { ... }
export const LoadingState: Story = { ... }
```

## QoE Checklist

Before committing:
- [ ] Zero hardcoded data in story file?
- [ ] Zero hardcoded data in component file?
- [ ] All data imported from `src/api/data/seed/`?
- [ ] Story names describe the DATA scenario, not the component?
- [ ] Seed factories used for large datasets?

OUTPUT: Story file using proper API simulation patterns with seed data injection.

---

*Auto-generated from `prompts.ts` — edit source, run `npm run sync:prompts`*
