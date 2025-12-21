---
name: async-state-handling
enabled: true
event: file
conditions:
  - field: file_path
    operator: regex_match
    pattern: src/components/.*\.tsx$
  - field: new_text
    operator: regex_match
    pattern: (isLoading|async\s+function|await\s+fetch|useMutation|useQuery)
---

## Async: Handle All States

| State | Required UI |
|-------|-------------|
| Loading | Skeleton or `<Spinner />` |
| Error | Message + retry action |
| Empty | Guidance message |
| Success | Data render |

**Doherty:** <100ms none | 100-400ms subtle | >400ms spinner | >1s progress

```tsx
// ❌ Missing states
return <div>{data}</div>;

// ✅ Complete
if (isLoading) return <Skeleton />;
if (error) return <ErrorState onRetry={refetch} />;
if (!data?.length) return <EmptyState />;
return <DataList items={data} />;
```
