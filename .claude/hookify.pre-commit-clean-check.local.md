---
name: pre-commit-clean-check
enabled: false  # DEPRECATED: Use commit-quality instead
event: bash
pattern: git commit
action: warn
---

## 📝 Pre-Commit Clean Code Checklist

Before committing, verify:

### Code Quality
- [ ] No files >500 lines (God Files)
- [ ] No functions >30 lines
- [ ] No magic numbers (use constants)
- [ ] No dead code or commented-out code
- [ ] No silent catch blocks (user must see errors)

### Naming
- [ ] Functions describe what they do: `parseSchemaField`, `validateTemplateName`
- [ ] Boolean variables: `isRequired`, `hasFields`, `shouldRender`
- [ ] Constants: `BREAKPOINTS`, `FEEDBACK_DURATION_MS`

### Structure
- [ ] Types in types.ts, utilities in utils.ts
- [ ] Sub-components extracted if file >300 lines
- [ ] Re-exports for backwards compatibility

### Quick Commands
```bash
wc -l <changed-files>  # Check file sizes
npm run typecheck      # Type errors
npm run lint           # Lint errors
```

### Reference
Read `.claude/clean-code-rules.md` for full checklist.
