---
name: block-claude-attribution
enabled: true
event: bash
pattern: git\s+commit.*(\ud83e\udd16|Claude|Anthropic|Co-Authored-By.*Claude|Generated with.*Claude)
action: block
---

## Blocked: Claude Attribution in Commit

**Use conventional commits:**
```
feat: add new feature
fix: resolve bug
chore: update dependencies
refactor: improve code structure
docs: update documentation
```
