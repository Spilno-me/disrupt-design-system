## Bug Fix

<!--
  Use this template for bug fixes ONLY.
  For new features or design changes, request via architect (Andrii Drozdenko).
-->

### Bug Description
<!-- What was broken? Be specific. -->


### Root Cause
<!-- Why was it broken? What was the underlying issue? -->


### Fix Applied
<!-- What did you change to fix it? Keep it minimal. -->


### Reproduction
<!-- Link to Storybook story that demonstrates the bug -->
- Story URL:
- Steps to reproduce:
  1.
  2.
  3.

### Checklist

#### Required
- [ ] Fix is minimal (no unrelated changes)
- [ ] No visual/design changes (colors, spacing, layout)
- [ ] No prop/API changes (adding, removing, or changing props)
- [ ] No changes to protected files (tokens, types.ts, stories)
- [ ] Added test that would have caught this bug

#### Verification
- [ ] `npm run typecheck` passes
- [ ] `npm run lint` passes
- [ ] `npm run build` passes
- [ ] Storybook still works locally

### Files Changed
<!-- List the files you modified -->
-

### Screenshots (if applicable)

| Before | After |
|--------|-------|
|        |       |

---

### Auto-Merge Eligibility

Your PR will auto-merge if ALL of these are true:
- [ ] PR title starts with `fix:`
- [ ] Less than 100 lines changed
- [ ] No protected files modified
- [ ] All CI checks pass
- [ ] At least one test added

If any protected files are modified, architect approval is required.
