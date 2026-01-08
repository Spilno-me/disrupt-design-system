# Create AllStates Story Only



**Category:** stories | **Tags:** storybook, allstates, qoe
**Variables:** `{COMPONENT}`, `{LEVEL}`
**Read first:** `.claude/storybook-rules.md`

---

Create an AllStates story for {COMPONENT}.

## QoE Mindset
- **Stop at the peak**: Don't exhaust every possible combination—show meaningful states.
- **Body as barometer**: If listing states feels tedious, you're over-documenting.

Read `.claude/storybook-rules.md` and use infrastructure from `src/stories/_infrastructure`.

Structure:
- StorySection for each category (Variants, Sizes, States)
- StoryFlex or StoryGrid for layout
- Real component props (no CSS overrides)
- Include: default, hover (via decorator), focus, disabled, error states

Use withStoryContainer('{LEVEL}') decorator where LEVEL is atom, molecule, or organism.

---

*Auto-generated from `prompts.ts` — edit source, run `npm run sync:prompts`*
