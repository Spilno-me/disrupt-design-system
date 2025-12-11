---
name: block-claude-attribution
enabled: true
event: bash
pattern: git\s+commit.*(\ud83e\udd16|Claude|Anthropic|Co-Authored-By.*Claude|Generated with.*Claude)
action: block
---

**🚫 Claude Attribution Detected in Git Commit**

Your commit message contains Claude/AI attribution, which violates the project's git commit rules.

**Blocked patterns:**
- "🤖 Generated with Claude Code"
- "Co-Authored-By: Claude"
- Any mention of "Claude" or "Anthropic"

**From CLAUDE.md:**
> IMPORTANT: NEVER add Claude attribution to commits.

**Use conventional commits instead:**
- `feat: add new feature`
- `fix: resolve bug`
- `chore: update dependencies`
- `refactor: improve code structure`
- `docs: update documentation`
