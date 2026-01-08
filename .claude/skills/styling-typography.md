# Apply Typography Rules



**Category:** styling | **Tags:** typography, fonts, text, maya
**Variables:** `{COMPONENT}`
**Read first:** `.claude/typography-rules.md`

---

Apply typography rules to {COMPONENT}.

## MAYA Mindset
- Clear hierarchy helps users scan—biggest = most important
- Consistent font creates professionalism users expect
- Modern type refinement, familiar reading patterns

READ FIRST: `.claude/typography-rules.md`

FONTS: Fixel (UI) + JetBrains Mono (code only)

Scale:
| Role | Tailwind |
|------|----------|
| Page Title | `text-2xl font-semibold` |
| Section Title | `text-lg font-semibold` |
| Card Title | `text-base font-semibold` |
| Body | `text-sm` |
| Label | `text-sm font-medium` |
| Caption | `text-xs text-muted` |
| Code | `font-mono text-sm` |

Colors:
| Element | Token |
|---------|-------|
| Primary | `text-primary` |
| Secondary | `text-secondary` |
| Muted | `text-muted` |
| Error | `text-error` |
| Link | `text-link` |

FORBIDDEN:
- `font-serif`, `font-display`
- Non-Fixel UI text
- `font-mono` for non-code text
- Font sizes below 12px

OUTPUT: Updated component with DDS typography.

---

*Auto-generated from `prompts.ts` — edit source, run `npm run sync:prompts`*
