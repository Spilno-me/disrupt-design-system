---
name: import-hygiene
enabled: true
event: file
action: warn
conditions:
  - field: file_path
    operator: regex_match
    pattern: src/components/.*\.tsx$
  - field: content
    operator: regex_match
    pattern: (from\s+['"]\.\./\.\./\.\./|from\s+['"]@/components/ui/index['"]|import\s+\*\s+as)
---

## Import Hygiene Warning

| Detected | Problem | Fix |
|----------|---------|-----|
| `../../../` | Deep relative import | Use `@/` alias |
| `@/components/ui/index` | Explicit index | Use `@/components/ui` |
| `import * as` | Barrel import | Import specific items |

```tsx
// ❌ Detected
import { Button } from '../../../components/ui'
import { Card } from '@/components/ui/index'
import * as Icons from 'lucide-react'

// ✅ Clean imports
import { Button } from '@/components/ui'
import { Card } from '@/components/ui'
import { Home, Settings } from 'lucide-react'
```

**Why:** Cleaner imports, better tree-shaking, faster builds.
