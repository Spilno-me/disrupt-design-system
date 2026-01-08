# Version and Publish Package



**Category:** delivery | **Tags:** versioning, semver, publishing, changelog
**Variables:** `{VERSION_TYPE}`

---

Publish DDS package with {VERSION_TYPE} version bump.

READ FIRST: `src/stories/developers/VersioningUpdates.mdx`

## Semantic Versioning Reference

| Bump | When | Example |
|------|------|---------|
| **PATCH** (x.x.1) | Bug fixes, no API changes | Fix tooltip positioning |
| **MINOR** (x.1.0) | New features, backward compatible | Add Button variant |
| **MAJOR** (1.0.0) | Breaking changes | Rename prop, remove component |

## Pre-Publish Checklist

```bash
# 1. Run full validation
npm run health

# 2. Check for breaking changes
git diff HEAD~5 -- 'src/components/**/*.tsx'

# 3. Verify exports
npm run validate:exports

# 4. Build package
npm run build
```

## Update Files (MANDATORY)

| Change Type | Update |
|-------------|--------|
| Any change | `package.json` version |
| Any change | `changelog.json` with entry |
| New component | `README.md` Package Architecture |
| Breaking change | `v3-breaking-changes.md` |

## Changelog Entry Format

```json
{
  "version": "2.3.0",
  "date": "2024-01-15",
  "changes": [
    {
      "type": "feature",
      "component": "Button",
      "description": "Add 'outline' variant for secondary actions"
    }
  ]
}
```

## Breaking Change Documentation

```markdown
## Button.variant renamed

**Before:**
```tsx
<Button variant="ghost" />
```

**After:**
```tsx
<Button variant="subtle" />
```

**Migration:** Find/replace `variant="ghost"` → `variant="subtle"`
```

## Output
- Updated package.json version
- Changelog entry with all changes
- README updates if architecture changed
- Breaking change documentation if MAJOR

---

*Auto-generated from `prompts.ts` — edit source, run `npm run sync:prompts`*
