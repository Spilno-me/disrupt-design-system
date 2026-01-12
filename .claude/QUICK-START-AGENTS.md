# Agent Quick Start (5-Second Read)

**Last Updated:** 2025-12-13

---

## 🚀 READ THESE FIRST (3 files, 5 seconds)

```bash
1. .claude/agent-context.json           # Master rules (200 lines)
2. .claude/component-registry.json      # Component lookup (200 lines)
3. .claude/findings/index.json          # Lessons learned (150 lines)
```

**Total: ~550 lines = 5-second load ⚡**

---

## ⚡ Critical Rules (Fast Scan)

### Versioning
```
NO breaking changes until v3.0.0
Breaking: rename/remove props, change types, change defaults
Safe: add optional props, new components, bug fixes
```

### Design Tokens
```
❌ NO: #hex, rgb(), bg-blue-500, text-gray-600
✅ YES: ALIAS.text.primary, bg-surface, text-primary
```

### Testing (data-testid)
```
ATOM (Button, Badge): Accept via props, NO defaults
MOLECULE (LeadCard): Auto-gen from props (lead-card-${id})
PAGE (LeadsPage): Hardcode (leads-page, leads-header)
```

### Variants (Opinionated)
```
State variants: ≤5 (success, warning, error, default)
Sizes: ≤3 (sm, default, lg only if essential)
Animations: 1 (no choice - consistency)
Ask: Functional or aesthetic? Remove aesthetic!
```

---

## 📋 Quick Workflows

### Creating Component
```
1. Check: .claude/component-registry.json (exists?)
2. Type: ATOM | MOLECULE | PAGE
3. Variants: Minimal (≤5), functional only
4. testId: ATOM (accept) | MOLECULE (auto-gen) | PAGE (hardcode)
5. Tokens: ALIAS or semantic Tailwind only
6. Export: src/index.ts + types
7. Story: Storybook (essential variants only)
```

### Editing Component
```
1. Check: Breaking? (rename/remove props) → STOP → v3.0.0
2. Safe? (optional prop/bugfix) → Proceed
3. Tokens: Use ALIAS or semantic Tailwind
4. Variants: Follow reduction philosophy
5. testId: Add if missing (based on type)
6. CHANGELOG: Update
```

### Stabilizing Component
```
1. Read: .claude/component-stabilization-plan.md
2. Category: Website (FROZEN) | App (CAREFUL) | Shared (EXTREME CARE)
3. Safe only: Add optional props, fix bugs, improve internals
4. Variants: Review and reduce if needed
5. testId: Add ATOM/MOLECULE pattern
6. Document: .claude/reviews/{component}-review.md
```

---

## 📁 Key Files (Fast Reference)

```
.claude/agent-context.json              # Master rules
.claude/testing-quick-ref.md            # testId strategy
.claude/variant-reduction-strategy.md   # Variant philosophy
.claude/component-stabilization-plan.md # Stabilization guide
.claude/v3-breaking-changes.md          # v3.0.0 tracking
.claude/agents/component-builder.md     # Component builder agent
TESTING.md                              # QA guide
CHANGELOG.md                            # Version history
```

---

## 🎯 Quick Queries (jq)

```bash
# Check if component exists
jq '.ui.ComponentName' .claude/component-registry.json

# Get versioning rules
jq '.criticalRules.versioning' .claude/agent-context.json

# Get testId strategy
jq '.components.testing' .claude/agent-context.json

# Get variant limits
jq '.components.variants.targetLimits' .claude/agent-context.json

# Check breaking changes
jq '.workflow.editComponent' .claude/agent-context.json
```

---

## 💡 Common Tasks

### Q: Creating new Button variant?
```
1. Read: .claude/variant-reduction-strategy.md
2. Ask: Functional or aesthetic?
3. Functional → Add (but keep ≤5 total)
4. Aesthetic → Reject
```

### Q: Adding data-testid to component?
```
1. Read: .claude/testing-quick-ref.md
2. Identify: ATOM | MOLECULE | PAGE
3. ATOM: Extend React.HTMLAttributes + {...props}
4. MOLECULE: Add testId prop + auto-generate
5. JSDoc: Add examples
```

### Q: Component has too many variants?
```
1. Read: .claude/variant-reduction-strategy.md
2. Audit: List all variants
3. Categorize: Functional vs aesthetic
4. Reduce: Remove aesthetic, keep ≤5
5. v2.x: Deprecate, keep working
6. v3.0.0: Remove
```

---

**Total read time: 5 seconds ⚡**
**All details: .claude/agent-context.json**
