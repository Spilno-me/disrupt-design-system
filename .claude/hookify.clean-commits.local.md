---
name: clean-commits
enabled: true
event: bash
action: block
conditions:
  - field: command
    operator: regex_match
    pattern: git\s+commit.*(-m|--message)
  - field: command
    operator: regex_match
    pattern: (🤖|Claude|Anthropic|Co-Authored-By|Generated with)
---

## Blocked: AI Attribution in Commit

Commits should follow conventional commit format without AI attribution.

### Use:
```
feat: add user authentication
fix: resolve login redirect bug
refactor: simplify form validation
docs: update API documentation
chore: update dependencies
```

### Don't include:
- 🤖 emoji
- "Generated with Claude"
- "Co-Authored-By: Claude"
- Any AI tool attribution
