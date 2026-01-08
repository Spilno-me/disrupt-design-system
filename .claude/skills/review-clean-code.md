# Clean Code Review (Uncle Bob A+ Standard)



**Category:** review | **Tags:** review, clean-code, refactoring, quality, wu-wei
**Variables:** `{FILE_PATH}`
**Read first:** `.claude/clean-code-rules.md`

---

Review {FILE_PATH} against Uncle Bob's clean code principles.

## Wu Wei Mindset
- Simple over clever: complexity is a code smell
- Delete > add: if in doubt, remove it
- Work WITH patterns: don't fight the codebase structure

READ FIRST: `.claude/clean-code-rules.md`

GRADING RUBRIC:
| Category | Check |
|----------|-------|
| Naming | Names express intent? No abbreviations? |
| Functions | Each function does ONE thing? <30 lines? |
| Comments | JSDoc for public APIs? Design notes for WHY? |
| Structure | Helpers first, then main component? |
| Errors | No silent failures? Users see feedback? |
| Cleanliness | No magic numbers? No dead code? No duplication? |
| SOLID | Single responsibility? Clear abstractions? |

FILE SIZE LIMITS:
| Type | Max Lines | Action |
|------|-----------|--------|
| Component | 300 | Extract sub-components |
| Dialog | 400 | Extract content sections |
| Types | 400 | Move utilities to utils.ts |
| Any file | 500 | GOD FILE - split immediately |

EXTRACT TRIGGERS:
- Function >30 lines → extract helper
- Repeated calculation → memoize
- Same logic 2+ places → extract utility
- Complex conditional → named function

REPORT FORMAT:
| Category | Grade | Issues | Action |
|----------|-------|--------|--------|
| Naming | A-F | List | Fix suggestion |
| Functions | A-F | List | Fix suggestion |
...

FINAL GRADE: A+ to F with summary.
VERDICT: SHIP IT or NEEDS WORK with specific fixes.

---

*Auto-generated from `prompts.ts` — edit source, run `npm run sync:prompts`*
