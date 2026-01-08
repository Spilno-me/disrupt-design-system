---
name: clean-code-reminder
enabled: false
event: file
action: warn
conditions:
  - field: file_path
    operator: regex_match
    pattern: Dialog\.tsx$
---

## 📋 Clean Code Reminder

Before editing this React component, remember:

### File Size Limits
| Type | Max | Action |
|------|-----|--------|
| Component | 300 lines | Extract sub-components |
| Dialog | 400 lines | Extract content sections |
| **Any** | **500 lines** | **Split immediately** |

### Function Design
- Each function: ONE thing, <30 lines
- Extract repeated calculations to `useMemo`
- Name helpers clearly: `parseSchemaField`, `formatDate`

### Error Handling
- No silent `catch` blocks - show user feedback
- Use structured returns: `{ valid: boolean; error?: string }`

### Quick Reference
Read `.claude/clean-code-rules.md` for full checklist.
