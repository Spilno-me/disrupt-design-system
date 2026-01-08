# Find Good Stopping Point



**Category:** planning | **Tags:** stopping, peak, qoe, energy

---

Find a good stopping point for current work.

## QoE Principle: Stop at the Peak

> "Stop when you know what comes next (Hemingway). Don't drain the well completely."

## Signs You Should Stop

| Stop Now | Keep Going |
|----------|------------|
| You know exactly what's next | You're unsure what's next |
| Energy is still high | Energy is draining |
| Code is in working state | Code is broken |
| Tests pass | Tests failing |
| Clean commit possible | Uncommittable state |

## Stopping Ritual

1. **Write down next step** (specific, not vague)
   ```
   NEXT: Implement error handling for API timeout case
   NOT: Continue working on error handling
   ```

2. **Leave a breadcrumb** (comment in code)
   ```tsx
   // TODO(next-session): Add retry logic here
   // Context: API sometimes times out, need exponential backoff
   ```

3. **Commit current state**
   - Even if incomplete
   - Mark as WIP if needed

4. **Rate your return eagerness**
   - 😊 Eager to return = good stop
   - 😐 Neutral = okay stop
   - 😫 Dreading return = stopped too late

## FORBIDDEN
- Stopping mid-thought with no notes
- "I'll remember where I was"
- Leaving broken/uncommittable code
- Working until exhausted

OUTPUT: Clear next step written down, code in committable state.

---

*Auto-generated from `prompts.ts` — edit source, run `npm run sync:prompts`*
