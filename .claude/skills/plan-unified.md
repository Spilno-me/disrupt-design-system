# Unified Planning Protocol (Super Prompt)



**Category:** planning | **Tags:** planning, architecture, review, qoe, unified, super-prompt
**Variables:** `{FEATURE_OR_TASK}`

---

Execute the unified planning protocol for: {FEATURE_OR_TASK}

## PHASE 0: ORIENTATION (30 seconds)

### Determine Planning Depth

| Task Size | Phases to Use | Est. Time |
|-----------|---------------|-----------|
| **Tiny** (1 file, clear scope) | Skip to Phase 2 | 2 min |
| **Small** (2-5 files, known pattern) | Phase 1 → 2 → 3 | 5 min |
| **Medium** (cross-cutting, new pattern) | All phases, no agents | 15 min |
| **Large** (architecture, unknown territory) | All phases + agent iteration | 30 min |

**Your task:** {FEATURE_OR_TASK}
**Estimated size:** [TINY | SMALL | MEDIUM | LARGE]

---

## MODEL ROUTING: Three-Tier Intelligence

> **MCP first** (instant, free) → **Haiku second** (fast, cheap) → **Opus last** (reasoning only)

### Tier 1: MCP Tools ⚡ (ALWAYS TRY FIRST)
Instant, zero cost, deterministic. Use before ANY model call:

| Query Type | MCP Tool | Response Time |
|------------|----------|---------------|
| Component exists? | `mcp__dds__search_components` | ~50ms |
| Component details | `mcp__dds__get_component` | ~50ms |
| Token valid? | `mcp__dds__check_token_usage` | ~50ms |
| Contrast check | `mcp__dds__check_contrast` | ~50ms |
| Accessible colors | `mcp__dds__get_accessible_colors` | ~50ms |
| Color for context | `mcp__dds__get_color_recommendation` | ~50ms |
| Color harmony | `mcp__dds__get_color_harmony` | ~50ms |
| Glass/depth rules | `mcp__dds__get_glass_rules` | ~50ms |
| Design philosophy | `mcp__dds__get_design_philosophy` | ~50ms |

**MCP Decision Flow:**
```
"Does Button component exist?"     → mcp__dds__search_components ⚡
"What variants does Card have?"    → mcp__dds__get_component ⚡
"Is CORAL[200] on ABYSS[900] ok?"  → mcp__dds__check_contrast ⚡
"What colors work on dark bg?"     → mcp__dds__get_accessible_colors ⚡
```

### Tier 2: Haiku 🐦 (For scans MCP can't do)
Fast, cheap (~60x less than Opus). Use for codebase exploration:

| Task Type | Haiku Prompt Pattern |
|-----------|---------------------|
| **File pattern scan** | "List all files matching X pattern. Return paths only." |
| **Usage search** | "Find all imports of X. Return file:line list." |
| **Custom grep** | "Search for pattern Y in src/. Return matches." |
| **Checklist validation** | "Does plan mention X? Y? Z? Return yes/no each." |
| **Naming audit** | "Do these files follow kebab-case? Return violations." |
| **Dependency trace** | "What does file X import? List all." |
| **Impact count** | "How many files import X? Return count." |

**Haiku Delegation Syntax:**
```
Task tool with:
- model: "haiku"
- subagent_type: "Explore"
- prompt: "[Scan/list/count/check task - NO reasoning]"
```

### Tier 3: Opus 🧠 (Reasoning only)
Expensive but necessary for judgment. Use ONLY when MCP + Haiku insufficient:

| Task Type | Why Opus Required |
|-----------|-------------------|
| **Architectural decisions** | Trade-offs require judgment |
| **Kernel identification** | "What's essential?" needs understanding |
| **Risk assessment** | Reasoning about failure modes |
| **Plan synthesis** | Creative integration of findings |
| **Requirement interpretation** | Understanding nuance and intent |
| **Edge case analysis** | "What could go wrong?" |

### Decision Tree
```
Before ANY task, ask in order:

1. Can MCP answer this? (component/token/color queries)
   └─ YES → Use MCP tool ⚡ (instant, free)

2. Is this a SCAN/COUNT/CHECK of the codebase?
   └─ YES → Delegate to Haiku 🐦 (fast, cheap)

3. Does this require REASONING/SYNTHESIS/JUDGMENT?
   └─ YES → Use Opus 🧠 (expensive but necessary)
```

### Cost Comparison
| Tier | Cost | Speed | Use For |
|------|------|-------|---------|
| MCP ⚡ | FREE | ~50ms | DDS queries, tokens, colors |
| Haiku 🐦 | $0.25/1M | ~2s | File scans, greps, counts |
| Opus 🧠 | $15/1M | ~10s | Reasoning, synthesis |

**Savings Example (Large Plan):**
```
Before: All Opus                    → $0.45
After:  MCP (40%) + Haiku (30%) + Opus (30%) → $0.14
        60% cost reduction
```

---

## PHASE 1: DISCOVERY (QoE: Find the Living Question)

> "A 'living question' has energy and specificity. Dead questions are abstract."

### 1.1 What Already Exists? ⚡🐦 MCP + HAIKU

**Step 1: MCP Instant Queries ⚡** (run these first, parallel)
```
mcp__dds__search_components({ query: "{FEATURE_OR_TASK}" })
mcp__dds__search_components({ type: "MOLECULE" })  // if building molecule
mcp__dds__get_design_tokens({ category: "colors" }) // if color-related
```

**Step 2: Haiku Codebase Scan 🐦** (only for what MCP can't answer)
```
Task tool with:
- model: "haiku"
- subagent_type: "Explore"
- prompt: "Find all files related to '{FEATURE_OR_TASK}'. Return:
  1. Existing implementations (paths only)
  2. Similar patterns (file:line)
  3. Related utilities
  Format: bullet list, no explanations"
```

**Step 3: Opus Synthesis 🧠** (you do this)
- "What would we reinvent?" (reasoning)
- "What patterns should we follow?" (judgment)

| Source | Returns | Cost |
|--------|---------|------|
| MCP ⚡ | Component metadata, tokens | FREE |
| Haiku 🐦 | File paths, grep results | ~$0.001 |
| Opus 🧠 | "Should we build or reuse?" | ~$0.01 |

### 1.2 Ask Offering Questions (not Extracting)

| Extracting (avoid) | Offering (prefer) |
|-------------------|-------------------|
| "What do you want?" | "What problem are you solving?" |
| "Which option?" | "What does success look like?" |
| "Can I start?" | "What would make this delightful?" |

**Questions to answer:**
- What problem does this solve?
- Who benefits and how?
- What happens if we don't build this?
- What assumptions are we making?

### 1.3 Living Questions Found
[List specific, energized questions - NOT vague "should we..." questions]

**PHASE 1 OUTPUT:** Observations, living questions, NO solutions yet.

---

## PHASE 2: SCOPING (QoE: Make It Smaller)

> "Shrink scope until it becomes interesting. Boredom often means scope is too large."

### 2.1 Find the Kernel
What's the ONE thing that makes {FEATURE_OR_TASK} valuable?
Everything else is decoration.

**Kernel:** [the essential thing]

### 2.2 Vertical Slice
| Original Scope | Minimal Valuable Version |
|----------------|--------------------------|
| [full feature] | [smallest useful increment] |

### 2.3 Explicitly Remove
For each requirement:
- [ ] Essential for v1? → KEEP / FUTURE / UNNECESSARY
- [ ] Can be hardcoded? → YES (defer) / NO (implement)

**Removed from v1:**
- [thing 1] → reason
- [thing 2] → reason

**PHASE 2 OUTPUT:** Smallest interesting scope, clear kernel.

---

## PHASE 3: INITIAL DRAFT

### 3.1 Requirements & Acceptance Criteria
- [ ] Critical requirement 1
- [ ] Critical requirement 2

### 3.2 Technical Approach
[How will this work? Key decisions and rationale]

### 3.3 Files to Modify
| File | Action | Description |
|------|--------|-------------|
| path/to/file.tsx | CREATE/MODIFY | What changes |

### 3.4 Dependencies & Integration Points
- External: [packages, APIs]
- Internal: [other components]
- Integration: [how this connects]

### 3.5 Risk Areas
| Risk | Severity | Mitigation |
|------|----------|------------|
| Risk 1 | HIGH/MED/LOW | How to handle |

**PHASE 3 OUTPUT:** First draft of complete plan.

---

## PHASE 4: SELF-REVIEW ROUNDS

### Round A: Gaps & Assumptions 🧠 OPUS
- [ ] What assumptions am I making?
- [ ] What information is missing?
- [ ] Are there unstated requirements?
- [ ] What dependencies haven't I identified?

### Round B: Edge Cases & Failures 🧠 OPUS
- [ ] What could go wrong?
- [ ] What edge cases exist?
- [ ] What's the failure mode?
- [ ] How do we handle errors?

### Round C: Consistency 🐦 HAIKU SCAN + 🧠 OPUS REASON
```
// Delegate pattern scan to Haiku:
Task tool with:
- model: "haiku"
- subagent_type: "Explore"
- prompt: "For plan affecting files: [list files from plan]
  1. Find existing patterns for similar functionality
  2. Check if any listed imports already exist
  3. Verify naming follows conventions
  Return: findings list, no recommendations"
```

**Haiku returns:** Pattern matches, naming check results
**Opus reasons about:** "Does this integrate cleanly?" "Breaking changes?"

- [ ] Does this match existing codebase patterns? (Haiku scan → Opus interpret)
- [ ] Am I reinventing something that exists? (Haiku scan)
- [ ] Does this integrate cleanly with current architecture? (Opus reasoning)
- [ ] Will this cause breaking changes? (Opus reasoning)

### Continue rounds until:
1. ✅ Zero critical blockers or risks
2. ✅ All dependencies identified
3. ✅ All integration points specified
4. ✅ Clear success criteria defined
5. ✅ Zero open questions about requirements

**PHASE 4 OUTPUT:** Reviewed plan with all issues addressed.

---

## PHASE 5: AGENT VALIDATION (For LARGE tasks only)

> Fresh eyes eliminate confirmation bias.

### Critical Issue Criteria
| Category | Critical Issue |
|----------|---------------|
| **Requirements** | Missing acceptance criteria, unstated assumptions |
| **Technical** | Missing dependencies, unclear integration points |
| **Risk** | Unmitigated high-severity risk, no failure handling |
| **Completeness** | Missing files to modify, unclear success criteria |
| **Consistency** | Breaks existing patterns, reinvents existing solution |

### Two-Model Validation Strategy

**Step 1: Haiku Quick Scan 🐦** (run first, parallel)
```
Task tool with:
- model: "haiku"
- subagent_type: "Explore"
- run_in_background: true
- prompt: "Validate plan completeness. Check:
  □ All files listed exist or have valid parent dirs?
  □ All imports mentioned are real packages?
  □ Naming follows kebab-case files, PascalCase exports?
  □ No duplicate component names in codebase?
  Return: PASS/FAIL for each + file paths if FAIL"
```

**Step 2: Opus Deep Review 🧠** (after Haiku returns)
```
Task tool with:
- model: "sonnet" (or default Opus)
- subagent_type: "Plan"
- run_in_background: true
- prompt: "Review plan for CRITICAL issues only:
  [Include Haiku's findings]
  Focus on: architectural trade-offs, risk assessment,
  integration complexity, unstated assumptions.
  Return: CRITICAL issues only (not style nits)"
```

### Agent Iteration
Repeat Opus review until ZERO critical issues (max 5 iterations).
Haiku scan runs ONCE (it's deterministic).

---

## FINAL OUTPUT FORMAT

```
## Plan: {FEATURE_OR_TASK}

### Status: [DRAFT | NEEDS_REVIEW | APPROVED]
### Confidence: [LOW | MEDIUM | HIGH]
### Planning Depth: [TINY | SMALL | MEDIUM | LARGE]
### Review Rounds: [N]
### Agent Iterations: [N or SKIPPED]

### Kernel (The ONE Thing)
[Single sentence]

### Critical Requirements
- [ ] Requirement 1
- [ ] Requirement 2

### Technical Approach
[Details]

### Files to Modify
| File | Action | Description |
|------|--------|-------------|

### Dependencies
- Item 1

### Risk Areas
| Risk | Mitigation |
|------|------------|

### Deferred to v2
- Item 1

### Open Questions
[If not empty, plan is NOT APPROVED]
```

---

## EXECUTION SUPPORT

### When Stuck (QoE: Invite the Resistant Part)
| Blocker Type | Question |
|--------------|----------|
| Technical | "What specific info am I missing?" |
| Motivation | "Can I make this smaller?" |
| Fear | "What's the smallest safe step?" |

### Good Stopping Points (QoE: Stop at the Peak)
| Stop Now ✅ | Keep Going ⏳ |
|-------------|---------------|
| Know what's next | Unsure what's next |
| Energy high | Energy draining |
| Tests pass | Tests failing |

**Stopping ritual:** Write next step → Leave breadcrumb → Commit → Rate eagerness

---

## FORBIDDEN
- Saying "looks good" without completing review rounds
- Skipping phases for LARGE tasks
- Proceeding with open questions
- Assuming requirements without clarification
- Stopping mid-thought with no notes

---

## QoE PRINCIPLES EMBEDDED

| Phase | Principle |
|-------|-----------|
| Discovery | Find the living question, The offer |
| Scoping | Make it smaller |
| Draft | Allow ugliness |
| Review | Decrease effort, increase attention |
| Validation | Follow irritation |
| Execution | Stop at the peak, Invite resistant part |

---

*Auto-generated from `prompts.ts` — edit source, run `npm run sync:prompts`*
