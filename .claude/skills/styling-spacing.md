# Apply Spacing Tokens



**Category:** styling | **Tags:** spacing, layout, tokens, maya
**Variables:** `{COMPONENT}`
**Read first:** `.claude/spacing-rules.md`

---

Apply spacing rules to {COMPONENT}.

## MAYA Mindset
- Consistent spacing creates rhythm—users feel "this is organized"
- Related elements close together, separate things farther apart
- Modern refinement through precise spacing, familiar layout patterns

READ FIRST: `.claude/spacing-rules.md`

CORE RULE: Base 4px. NEVER arbitrary values. ALWAYS tokens.

Quick Reference:
| Relationship | px | Tailwind |
|--------------|-----|----------|
| Icon↔Text | 8 | `gap-2` |
| Label↔Input | 8 | `mb-2` |
| Input↔Input | 16 | `space-y-4` |
| Card↔Card | 16-24 | `gap-4`/`gap-6` |
| Section↔Section | 48-64 | `py-12`/`py-16` |

Decision:
| Relationship | Token |
|--------------|-------|
| Directly related | tight (8px) |
| Same group | base (16px) |
| Separate components | comfortable (24px) |
| Different sections | spacious (32-48px) |

FORBIDDEN:
- Arbitrary values: `gap-[18px]`, `p-[23px]`
- Inline styles: `style={{ marginTop: '32px' }}`

OUTPUT: Updated component with DDS spacing tokens.

---

*Auto-generated from `prompts.ts` — edit source, run `npm run sync:prompts`*
