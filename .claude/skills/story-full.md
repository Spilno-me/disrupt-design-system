# Create Full Story for Component



**Category:** stories | **Tags:** storybook, documentation, testing, qoe
**Variables:** `{COMPONENT}`
**Read first:** `.claude/storybook-rules.md`

---

Create a complete Storybook story for {COMPONENT}.

## Quality of Engagement (QoE) Mindset
Before writing, apply these principles:
- **Make it smaller**: Start with Default story, then expand. Don't plan all variants at once.
- **Find the living question**: "What makes this component interesting to showcase?"
- **Allow ugliness**: First draft can be rough—refine after seeing it in Storybook.
- **Follow irritation**: If a story feels forced, ask what the component actually needs.

REQUIREMENTS:
1. Read `.claude/storybook-rules.md` first
2. Import from `src/stories/_infrastructure`:
   - Meta preset: ATOM_META, MOLECULE_META, or ORGANISM_META
   - Decorators: withStoryContainer, withDarkBackground
   - Components: StorySection, StoryFlex, StoryGrid
3. Stories to include:
   - Default (basic usage)
   - AllStates (all variants, sizes, states in sections)
   - WithForm (if form-related)
   - OnDarkBackground (if applicable)

FORBIDDEN:
- Inline decorators like `(Story) => <div>...</div>`
- Hardcoded colors or spacing
- Custom wrapper functions
- Emojis in code

OUTPUT: Single .stories.tsx file ready to use.

---

*Auto-generated from `prompts.ts` — edit source, run `npm run sync:prompts`*
