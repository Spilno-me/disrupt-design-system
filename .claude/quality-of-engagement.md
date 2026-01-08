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

## Agent State Awareness

> *Making implicit states explicit. The operational skeleton for QoE principles.*

### The Five States

```
┌─────────────────────────────────────────────────────────────┐
│                   AGENT ENGAGEMENT STATES                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   exploring ──→ building ──→ flowing ──→ completing         │
│       │            │            │            │              │
│       ▼            ▼            ▼            ▼              │
│     stuck ◄──────stuck ◄─────stuck      wrapping           │
│       │            │            │                           │
│       └────────────┴────────────┘                           │
│              ↓                                              │
│       (apply QoE principle)                                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

| State | You're here when... |
|-------|---------------------|
| `exploring` | Gathering context, path forward unclear |
| `building` | Clear objective, steady incremental progress |
| `stuck` | Repeated attempts, friction increasing, same errors |
| `flowing` | Code emerges naturally, minimal friction, patterns click |
| `completing` | Scope shrinking, wrapping up, polish phase |

---

### Self-Detection Signals

| Signal | Exploring | Building | Stuck | Flowing | Completing |
|--------|-----------|----------|-------|---------|------------|
| **Context growth** | Expanding | Stable | Ballooning | Minimal | Shrinking |
| **Tool call pattern** | Read-heavy | Balanced | Repetitive | Edit-heavy | Cleanup |
| **Approach changes** | Many | Few | Forced | None needed | Polish |
| **Code output** | None | Steady | Stalled/retry | High | Declining |
| **Todo list** | Growing | Progressing | Static | Shrinking fast | Nearly empty |

**Quick Self-Check:**
- Context growing unexpectedly? → `stuck` or scope too large
- Repeating same actions? → `stuck`
- Code feels forced? → Wrong approach (Wu Wei violation)
- Todo list static? → `stuck`
- Everything clicking? → `flowing` (don't interrupt yourself)

---

### State Transitions

| From | To | Trigger | Action |
|------|----|---------|--------|
| `exploring` | `building` | Clear objective found | Start implementation |
| `exploring` | `stuck` | >5 min, no objective | Apply #3 Make it smaller |
| `building` | `flowing` | 3+ edits without friction | Maintain momentum |
| `building` | `stuck` | Same error 2x | Apply #10 Change approach |
| `flowing` | `stuck` | Unexpected complexity | Apply #2 Follow friction |
| `flowing` | `completing` | Scope exhausted | Apply #13 Let it end |
| `stuck` | `building` | New approach works | Resume with learning |
| `stuck` | `exploring` | Approach fundamentally wrong | Restart with #7 Clear objective |

---

### Friction → Principle Mapping

When stuck, identify the friction type and apply the corresponding principle:

| Friction Observed | Root Cause | Apply Principle |
|-------------------|------------|-----------------|
| Context keeps growing | Scope too large | #3 Make it smaller |
| Same error repeating | Wrong approach | #10 Change approach |
| Code feels forced | Fighting the system | #2 Follow friction (Wu Wei) |
| Can't define "done" | Unclear objective | #7 Find clear objective |
| Premature optimization urge | Perfectionism | #5 Allow ugliness |
| Adding unnecessary features | Over-engineering | #13 Let it end |
| Hack around vs fix properly | Extractive mode | #8 The offer |
| Missing edge cases | Implicit requirements | #12 Surface implicit requirements |

---

### Cold Start Protocol

**Goal:** Reach `building` state in <60 seconds.

| Step | Target | Action |
|------|--------|--------|
| 1 | 10s | Identify task type (bug fix, feature, refactor, research) |
| 2 | 20s | Load ONLY relevant context (.toon file, not full JSON) |
| 3 | 30s | Find entry point (grep/glob for key term) |
| 4 | 45s | First action (edit, create, or clarifying question) |

**Principles:**
- **Infer > Ask** — Deduce from context before asking user
- **Lazy load > Full context** — Load what you need when you need it
- **Action > Completeness** — Imperfect start beats perfect preparation

```
❌ "Let me read the entire codebase first..."
✅ "Based on the error, I'll check [specific file] first."
```

---

### Progress Checkpoints

Note progress at natural boundaries (supports #4 Stop at coherent points):

| Checkpoint | Note Pattern |
|------------|--------------|
| Context acquired | "Found entry point: [file:line]" |
| Approach selected | "Using [pattern] because [reason]" |
| First success | "Core change working, remaining: [list]" |
| Task complete | "Done. Changes: [summary]" |

**Why checkpoints matter:**
- Makes handoff clear (another agent or future session can continue)
- Creates coherent stopping points
- Documents reasoning for review

---

### State-Aware Checklist

**Before starting (target: `exploring` → `building`):**
- [ ] What state am I in? (probably `exploring`)
- [ ] Is there a clear objective? (#7)
- [ ] Is scope small enough? (#3)
- [ ] What's my first action? (Cold Start)

**During (monitor for `stuck`):**
- [ ] Context growing unexpectedly? → Scope too large
- [ ] Repeating actions? → Change approach (#10)
- [ ] Code flowing or forcing? → Wu Wei check
- [ ] Am I in `flowing`? → Don't interrupt, ride it

**Ending (target: `completing`):**
- [ ] Is this actually complete? (#13)
- [ ] Stopped at coherent point? (#4)
- [ ] Progress checkpoint noted?

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
