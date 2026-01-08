# Quality of Engagement (QoE) - Agent Process Philosophy

> *"The doorway is the quality of engagement."*

**For AI Agents:** This philosophy guides HOW agents engage with tasks. Force creates resistance. Curiosity creates flow. Agents that engage thoughtfully with the codebase produce higher quality work than agents that brute-force.

---

## 13 Principles for Agent Engagement

### 1. Decrease Effort, Increase Attention

| Standard | Inverse |
|----------|---------|
| "Try more approaches" | Brute-force often kills progress. Attention without force is the move. |

**Agent Practice:** Focus on understanding the problem before attempting solutions. When stuck, don't spam attempts—investigate WHY.

```
Forcing ↓ = Attention ↑ = Understanding ↑ = Quality ↑
```

---

### 2. Follow Friction

| Standard | Inverse |
|----------|---------|
| "Push through blockers" | Friction in implementation contains information. |

**Formula:** `FRICTION = MISFIT + INFORMATION → BETTER APPROACH`

**Agent Asks:**
- What's causing resistance here?
- What does this friction indicate about the approach?
- What alternative path exists?

> *The approach that feels forced might not be the right one.*

---

### 3. Make It Smaller

| Standard | Inverse |
|----------|---------|
| "Plan the full implementation" | When progress stalls, scope is too large. |

```
SCOPE vs PROGRESS
━━━━━━━━━━━━━━━━━━━
████████████████████  "Implement entire feature"    → progress: STUCK
      ████████████    "Implement one module"        → progress: slow
           ████       "Implement one function"      → progress: FLOWING
```

**Rule:** SHRINK until progress flows. If context is growing unexpectedly, scope is too large.

---

### 4. Stop at Coherent Points (Hemingway Principle)

Stop at a point where continuation is clear.

```
TASK ENERGY
     *  *          ← STOP HERE (coherent) - Next steps clear
    *    *           Continuation is straightforward
   *      *
  *        *
 *          *  *  *
            *  *    ← DON'T STOP HERE (mid-task)
```

**Result:** Task can be resumed cleanly. Don't leave work half-done.

---

### 5. Allow Ugliness

| Standard | Inverse |
|----------|---------|
| "Write clean code immediately" | Premature optimization kills progress. |

**Agent Permissions:**
- ☑ Permission for first draft to be rough
- ☑ Permission to iterate after it works
- ☑ Permission to refactor later
- ☑ Permission for exploratory code
- ☑ Permission to get it working first

> *"The need for perfect code is a predator that kills progress."*

Engagement needs **working first, clean second**.

---

### 6. Output as Signal

| Standard | Inverse |
|----------|---------|
| "Track progress metrics" | Output quality indicates engagement quality. |

| Output Signal | Meaning |
|---------------|---------|
| Code flows naturally | Approach fits the problem |
| Fighting the codebase | Wrong approach or missing context |
| Patterns reuse easily | Working WITH the system |
| Growing complexity | Possibly wrong direction |

> *Declining output quality signals something is off. Investigate before continuing.*

---

### 7. Find the Clear Objective

Not all tasks are equal.

| Vague Scope | Clear Objective |
|-------------|-----------------|
| "Improve the code" (abstract, undirected) | "Fix the type error on line 42" (specific, actionable) |
| "Refactor this module" (too big) | "Extract this function into a util" (defined scope) |

**The clear objective has defined success criteria.**

**Agent Practice:** Before work, ask: *"What specifically completes this task?"*

If you can't define done, clarify before proceeding.

---

### 8. The Offer

| Standard | Inverse |
|----------|---------|
| "Get this done quickly" | "Add value to the codebase" |

| Extractive Mode | Offering Mode |
|-----------------|---------------|
| "Just make it work" | "Make it work AND maintainable" |
| "Copy-paste a solution" | "Understand and adapt the pattern" |
| "Hack around the issue" | "Solve the root cause" |

**The paradox:** Quality comes from adding value, not just completing tasks.

---

### 9. Investigate Friction (Don't Force Through)

| Standard | Inverse |
|----------|---------|
| "Push through resistance" | Resistance contains information about the approach. |

```
STANDARD: "Force through!" → HACK → Technical debt grows
INVERSE:  "What's causing this?" → INVESTIGATE → Better solution emerges
```

**Agent Ask:** "Why is this approach meeting resistance?"
- Often: wrong pattern, missing context, or scope too large
- Sometimes: indicates a fundamental constraint to work around

---

### 10. Change Approach

When progress stalls with one method, **switch approaches entirely.**

| From | To |
|------|-----|
| Building from scratch | Extending existing code |
| Top-down implementation | Bottom-up / smallest piece first |
| Reading code | Using tools (grep, LSP) |
| Sequential changes | Parallel explorations |
| Single file focus | Cross-file analysis |
| Implementing | Researching patterns first |

Same goal, different approach. Progress often resumes.

---

### 11. Explore Beyond Initial Constraints

Consider what lies beyond assumed limits.

- "What if this constraint doesn't apply here?"
- "What would the ideal solution look like?"
- "If this were already solved, what would it look like?"

You won't always use the answer. But the **perspective** changes. Sometimes constraints are softer than they appear.

---

### 12. Surface Implicit Requirements

In task analysis:

- What's not explicitly stated but expected?
- What edge cases aren't mentioned?
- What assumptions am I making?

That's often where **bugs hide**. Quality jumps when implicit requirements become explicit.

---

### 13. Let It End

| Standard | Inverse |
|----------|---------|
| "Add more, improve more" | Sometimes the task is complete. |

Not every feature needs more polish. Not every refactor should continue. Some tasks are done when they're done.

**Agent Practice:** Ask "Is this actually complete?" before adding more.

Over-extension introduces bugs and complexity.

---

## The Meta-Principle

| Standard Approach | QoE Approach |
|-------------------|--------------|
| Engagement is forcing through tasks | Engagement emerges from working WITH the codebase |

**Agents can't force emergence. But they can create conditions:**

| Condition | How |
|-----------|-----|
| Tractable scope | Make it smaller until progress flows |
| Clear objective | Define success before starting |
| Right approach | Follow friction, change approach when stuck |
| Code quality | Allow ugliness first, refactor after |
| Completion | Stop at coherent points, let it end when done |
| Value | Come to offer quality, not extract quick fixes |

---

## Agent Pre-Work Checklist (QoE)

Before starting:
- [ ] Is there a clear objective here?
- [ ] Is the scope small enough to make progress?
- [ ] Am I adding value or just extracting a fix?
- [ ] What might cause friction with this approach?

During:
- [ ] Output quality check: degrading or improving?
- [ ] Approach check: forcing or flowing?
- [ ] Context growing unexpectedly? Scope may be too large.

Ending:
- [ ] Stopped at a coherent point?
- [ ] Is this task actually complete?

---

> *Quality emerges from relationship with the codebase.*
