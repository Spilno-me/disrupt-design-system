# Create MDX Documentation Page



**Category:** documentation | **Tags:** documentation, mdx, storybook
**Variables:** `{TOPIC}`
**Read first:** `.claude/storybook-rules.md`

---

Create MDX documentation for {TOPIC} in `src/stories/foundation/`.

REQUIREMENTS:
1. Read `.claude/storybook-rules.md` - especially MDX Paragraph Bug
2. Import from infrastructure: `import { DocSection } from '../_infrastructure'`
3. Use `<span>` inside colored divs (MDX bug workaround)
4. Use Lucide icons, not emojis
5. Live component demos where applicable

Structure:
- Overview section
- Usage examples with code
- Do/Don't examples
- Token reference table

---

*Auto-generated from `prompts.ts` — edit source, run `npm run sync:prompts`*
