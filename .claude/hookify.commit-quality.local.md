---
name: commit-quality
enabled: true
event: bash
action: warn
conditions:
  - field: command
    operator: regex_match
    pattern: git commit
---

## Pre-Commit Checklist

### Version Bump Required?

| Change Type | Bump | Update Files |
|-------------|------|--------------|
| New component | MINOR | `package.json`, `changelog.json`, `agent-context.json` |
| New feature/export | MINOR | `package.json`, `changelog.json` |
| Bug fix | PATCH | `package.json`, `changelog.json` |
| Breaking change | MAJOR | `package.json`, `changelog.json`, `v3-breaking-changes.md` |

### Quality Checklist:
- [ ] No files >500 lines
- [ ] No `console.log` left behind
- [ ] Types correct (`npm run typecheck`)
- [ ] Lint passes (`npm run lint`)

### Commit Format:
```
feat: add new feature
fix: resolve bug
refactor: improve structure
docs: update documentation
```
