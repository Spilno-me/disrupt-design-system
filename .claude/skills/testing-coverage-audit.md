# Audit Testing Coverage



**Category:** testing | **Tags:** testing, audit, coverage, quality
**Variables:** `{COMPONENT_OR_FEATURE}`
**Read first:** `.claude/testing-quick-ref.md`

---

Audit testing coverage for {COMPONENT_OR_FEATURE}.

## DDS Testing Ownership

| Owner | Test Type |
|-------|-----------|
| **DDS** | Unit, Interaction, E2E, Visual Regression |
| **Consumer** | Integration (API + routing) |

READ FIRST: `.claude/testing-quick-ref.md`

## Audit Checklist

### 1. testId Coverage

Check for data-testid on:
- [ ] All form inputs (input, select, checkbox)
- [ ] All action buttons (submit, cancel, close)
- [ ] Navigation controls (next, back, tabs)
- [ ] Interactive cards/rows with entity IDs
- [ ] Container sections (for test scoping)

Naming convention: `{context}-{component}-{identifier}`

### 2. Unit Test Coverage

Check for `__tests__/` directory with:
- [ ] Transformation functions (`.utils.test.ts`)
- [ ] Constants/mappings (`.constants.test.ts`)
- [ ] Custom hooks logic (`use*.test.ts`)

### 3. Interaction Test Coverage

Check story files for `play()` functions:
- [ ] Happy path flow
- [ ] Validation errors
- [ ] Edge cases (empty, loading, error states)
- [ ] User interactions (clicks, typing, selections)

## Output Format

```
## Testing Coverage Audit: {COMPONENT_OR_FEATURE}

### testId Coverage: [X/Y] items
| Element | Has testId | testId Value |
|---------|------------|--------------|
| Submit button | ✅ | form-submit |
| Company input | ❌ | MISSING |

### Unit Test Coverage: [X/Y] functions
| Function | Has Test | File |
|----------|----------|------|
| transformToApi | ✅ | utils.test.ts |
| validateForm | ❌ | MISSING |

### Interaction Test Coverage: [X/Y] stories
| Story | Has play() | Tests |
|-------|------------|-------|
| Default | ✅ | Basic render |
| HappyPath | ❌ | MISSING |

### Recommendations
1. Add testId to: [list]
2. Add unit test for: [list]
3. Add interaction test for: [list]
```

## FORBIDDEN

- Marking coverage as "good enough" without checking all items
- Skipping testId audit (consumers depend on these)
- Ignoring error/edge case stories

OUTPUT: Coverage audit report with specific recommendations.

---

*Auto-generated from `prompts.ts` — edit source, run `npm run sync:prompts`*
