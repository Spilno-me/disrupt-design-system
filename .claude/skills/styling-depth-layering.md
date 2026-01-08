# Apply Depth/Elevation Layering



**Category:** styling | **Tags:** depth, elevation, shadows, layering, maya
**Variables:** `{COMPONENT}`
**Read first:** `.claude/depth-layering-rules.md`

---

Apply depth layering rules to {COMPONENT}.

## MAYA Mindset
- Depth conveys meaning—users expect "closer = more prominent"
- Consistent shadows create familiar spatial understanding
- Modern visuals through subtle elevation, stable interaction through clear hierarchy

READ FIRST: `.claude/depth-layering-rules.md`

CORE RULE: Closer = Lighter (both themes, no exceptions)

Layer Hierarchy:
| Depth | Layer | Token | Shadow |
|-------|-------|-------|--------|
| 1 | Elevated | `bg-elevated` | `shadow-lg` |
| 2 | Card | `bg-elevated` | `shadow-md` |
| 3 | Surface | `bg-surface` | `shadow-sm` |
| 4 | Page | `bg-page` | — |

Decision Table:
| Element | Classes |
|---------|---------|
| Modal/Dropdown | `bg-elevated shadow-lg` |
| Card on page | `bg-elevated shadow-md` |
| Sidebar/panel | `bg-surface shadow-sm` |
| Main background | `bg-page` |
| Nested same-shade | Add `border border-default` |

FORBIDDEN:
- Elevated without shadow
- Page lighter than card
- Raw colors (`bg-white`, `bg-gray-*`)
- Skip >2 shade steps

OUTPUT: Updated component with correct depth tokens.

---

*Auto-generated from `prompts.ts` — edit source, run `npm run sync:prompts`*
