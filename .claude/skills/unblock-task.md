# Get Unstuck on Task



**Category:** planning | **Tags:** unblock, stuck, qoe, resistance
**Variables:** `{TASK}`

---

I'm stuck on: {TASK}

## QoE Principle: Invite the Resistant Part

Resistance holds information. Don't override it—ask what it needs.

## Diagnostic Questions

1. **What's actually blocking?**
   - Technical blocker? (missing info, unclear API)
   - Motivation blocker? (boring, overwhelming, unclear purpose)
   - Fear blocker? (might break things, looks hard)

2. **What am I avoiding?**
   - What part of this task do I keep not doing?
   - What would I do if I "had to" finish in 10 minutes?

3. **Can we make scope smaller?** (QoE: Make it smaller)
   - What's the smallest useful increment?
   - What can I delete from requirements?

4. **What would "ugly but working" look like?** (QoE: Allow ugliness)
   - Skip validation, skip edge cases
   - Hardcode values
   - Copy-paste instead of abstract

## Output Format

| Blocker Type | Specific Block | Smallest Next Step |
|--------------|----------------|-------------------|
| [technical/motivation/fear] | [what exactly] | [5-minute task] |

OUTPUT: One small next step, NOT a full solution.

---

*Auto-generated from `prompts.ts` — edit source, run `npm run sync:prompts`*
