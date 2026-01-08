# Apply UX Laws to Component



**Category:** ux | **Tags:** ux, usability, laws, maya
**Variables:** `{COMPONENT}`
**Read first:** `.claude/ux-laws-rules.md`

---

Apply UX laws to {COMPONENT}.

## MAYA Mindset (Core of UX)
- These laws ARE MAYA in practice—they ensure users immediately understand
- Familiar patterns (44px targets, 7±2 items) leverage learned behavior
- Modern visuals, stable interactions: look fresh but work exactly as expected

READ FIRST: `.claude/ux-laws-rules.md`

Core Laws:
| Law | Rule | Value |
|-----|------|-------|
| Fitts | Target size | `min-h-11` (44px mobile) |
| Hick | Options limit | 5-7 max choices |
| Miller | Memory limit | 7±2 items |
| Doherty | Response time | <400ms or spinner |

Action Overflow Rule (CRITICAL):
- ≤3 actions = Visible buttons
- ≥4 actions = Overflow menu (ActionSheet/Dropdown)

By Component:
| Type | Requirements |
|------|--------------|
| Button | 44px touch, primary distinct |
| Form | 5-7 fields max, grouped sections |
| Nav | ≤7 items, key at start/end |
| Modal | Reachable close, single purpose |
| List | 7 visible, grouped items |

OUTPUT: Updated component following UX laws.

---

*Auto-generated from `prompts.ts` — edit source, run `npm run sync:prompts`*
