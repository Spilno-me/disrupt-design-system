# Hookify Rules Guide

## Active Hooks (18 Smart Hooks)

### Prompt Router Hooks (Meta)
| Hook | When It Triggers |
|------|------------------|
| `prompt-router` | Task keywords detected (plan, create, review, etc.) - suggests using prompt library |
| `prompt-router-execute` | Explicit "use prompt library" / "select prompt" - executes router |

### Blocking Hooks (Hard Stop)
| Hook | What It Blocks |
|------|----------------|
| `color-enforcement` | Hex colors, rgb(), standard Tailwind colors |
| `primitive-import-block` | Direct PRIMITIVES imports (ABYSS, CORAL, etc.) |
| `clean-commits` | AI attribution in git commits |
| `no-native-title` | Native `title` attribute (use Tooltip) |
| `no-important` | CSS `!important` flag |

### Warning Hooks (Soft Alert)
| Hook | What It Detects |
|------|-----------------|
| `code-quality` | `: any`, `<div onClick>`, `console.log` |
| `commit-quality` | Pre-commit checklist reminder |
| `ux-touch-targets` | Small buttons (`p-1`, `h-8 w-8`) |
| `mobile-first` | Desktop-first patterns (`max-sm:`) |
| `import-hygiene` | Deep imports (`../../../`), barrel imports |
| `no-arbitrary-values` | `w-[200px]`, `p-[10px]` - use tokens |
| `no-inline-styles` | `style={{ padding }}` - use Tailwind |
| `focus-ring-required` | Buttons without focus:ring-* |
| `story-infrastructure` | Stories missing ATOM_META/MOLECULE_META |
| `cva-for-variants` | Manual variant logic (use CVA) |
| `semantic-html` | `<div>` where semantic element fits |

## Rule Location
All rules live in `.claude/hookify.*.local.md` files.

## Rule Format (CRITICAL)

### Use Explicit Conditions (Recommended)

```yaml
---
name: my-rule-name
enabled: true
event: file          # bash | file | stop | prompt | all
action: block        # block | warn
conditions:
  - field: file_path
    operator: regex_match
    pattern: \.(tsx?|jsx?)$
  - field: content
    operator: regex_match
    pattern: your-pattern-here
---

## Message shown when rule triggers

Your helpful message with guidance.
```

### Why NOT Simple Pattern Format

```yaml
# ❌ BUGGY - Only works for Edit, NOT Write
event: file
pattern: "#[0-9A-Fa-f]{6}"
```

**Problem**: Simple `pattern:` auto-converts to `field: new_text`, which only checks Edit tool's `new_string`, not Write tool's `content`.

## Field Reference

| Event | Field | Description |
|-------|-------|-------------|
| `file` | `content` | File content (Write + Edit) |
| `file` | `file_path` | Target file path |
| `file` | `new_string` | Edit replacement text only |
| `file` | `old_string` | Edit original text only |
| `bash` | `command` | Shell command |
| `stop` | `reason` | Stop reason |
| `stop` | `transcript` | Full conversation |
| `prompt` | `user_prompt` | User input |

## Operator Reference

| Operator | Description |
|----------|-------------|
| `regex_match` | Regex pattern match |
| `contains` | Substring match |
| `equals` | Exact match |
| `not_contains` | Substring not present |
| `starts_with` | Prefix match |
| `ends_with` | Suffix match |

## Common Patterns

### Block hex colors in code files
```yaml
conditions:
  - field: file_path
    operator: regex_match
    pattern: \.(tsx?|jsx?|css)$
  - field: content
    operator: regex_match
    pattern: (#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3}|rgb\(|rgba\()
```

### Warn on console.log
```yaml
conditions:
  - field: file_path
    operator: regex_match
    pattern: \.(tsx?|jsx?)$
  - field: content
    operator: regex_match
    pattern: console\.(log|debug|info)\(
```

### Block dangerous bash commands
```yaml
event: bash
conditions:
  - field: command
    operator: regex_match
    pattern: rm\s+-rf\s+/
```

### Warn before git commit
```yaml
event: bash
action: warn
conditions:
  - field: command
    operator: regex_match
    pattern: git commit
```

### Exclude certain paths
```yaml
conditions:
  - field: file_path
    operator: regex_match
    pattern: \.(tsx?|jsx?)$
  - field: file_path
    operator: not_contains
    pattern: .stories.tsx
  - field: file_path
    operator: not_contains
    pattern: _archive/
```

## Testing Rules

```bash
# Manually test rule loading
python3 -c "
import sys
sys.path.insert(0, '~/.claude/plugins/cache/claude-code-plugins/hookify/0.1.0')
from hookify.core.config_loader import load_rules
rules = load_rules(event='file')
print(f'Loaded {len(rules)} rules')
for r in rules:
    print(f'  - {r.name}: {r.action}')
"
```

## Quick Commands

| Action | Command |
|--------|---------|
| List rules | `/hookify:list` |
| Create rule | `/hookify <description>` |
| Help | `/hookify:help` |
| Enable/disable | Edit `enabled:` in rule file |
