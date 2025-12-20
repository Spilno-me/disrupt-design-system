# DDS Prompt Library

> ⚠️ **AUTO-GENERATED** - Do not edit directly!
> Edit `src/components/shared/PromptLibrary/prompts.ts` instead.
> Run `npm run sync:prompts` to regenerate.

**Human-to-Agent prompt templates for consistent, high-quality results.**

Copy the prompt, replace `{VARIABLE}` with your actual values, paste to agent.

---

## Story Creation

### Create Full Story for Component

*Generate a complete Storybook story with Default, AllStates, and contextual variants.*

**Variables:** `{COMPONENT}`

```
Create a complete Storybook story for {COMPONENT}.

REQUIREMENTS:
1. Read \
```

### Create AllStates Story Only

*Generate an AllStates story showcasing all variants, sizes, and states.*

**Variables:** `{COMPONENT}`, `{LEVEL}`

```
Create an AllStates story for {COMPONENT}.

Read \
```

---

## Component Development

### Create New UI Component

*Generate a new UI component following DDS patterns with CVA variants.*

**Variables:** `{COMPONENT}`

```
Create a new UI component: {COMPONENT}

BEFORE WRITING:
1. Read \
```

### Stabilize Existing Component

*Audit and update a component to meet DDS stabilization standards.*

**Variables:** `{COMPONENT}`

```
Stabilize {COMPONENT} per DDS standards.

CHECKLIST:
1. Read \
```

---

## Token Operations

### Add New Color Token

*Add a new color token to all three token files with sync.*

**Variables:** `{TOKEN_NAME}`, `{HEX_VALUE}`

```
Add a new color token: {TOKEN_NAME} with value {HEX_VALUE}

MUST UPDATE ALL 3 FILES (manual sync required):
1. \
```

### Audit Token Usage

*Find and fix hardcoded values that should use tokens.*

**Variables:** `{COMPONENT}`

```
Audit {COMPONENT} for token compliance.

Check for:
1. Hardcoded hex colors -> replace with tokens
2. Tailwind standard colors (red-500) -> replace with DDS palette
3. Hardcoded shadows -> use SHADOWS tokens
4. Hardcoded spacing -> use SPACING tokens
5. Hardcoded radius -> use RADIUS tokens

Reference: \
```

---

## Documentation

### Create MDX Documentation Page

*Generate an MDX documentation page for Storybook.*

**Variables:** `{TOPIC}`

```
Create MDX documentation for {TOPIC} in \
```

### Update CLAUDE.md

*Add a new rule or section to CLAUDE.md agent instructions.*

**Variables:** `{RULE_DESCRIPTION}`

```
Update CLAUDE.md with new rule: {RULE_DESCRIPTION}

REQUIREMENTS:
1. Keep format terse (for agents, not humans)
2. Use table format for lookups
3. Include code examples
4. Add to appropriate section
5. Update lazy load references if new file created

Run \
```

---

## Review & Validation

### Code Review for DDS Compliance

*Review code against all DDS rules and report violations.*

**Variables:** `{FILE_PATH}`

```
Review {FILE_PATH} for DDS compliance.

Check against:
1. \
```

### Pre-PR Checklist

*Run full validation before submitting a pull request.*

```
Run pre-PR validation for my changes.

Execute:
1. \
```

### Find All Token Violations

*Search entire codebase for hardcoded values.*

```
Find all token violations in src/components.

Search for:
1. Hardcoded hex colors (#[0-9A-Fa-f]{6})
2. Tailwind standard colors (red-500, blue-600, etc.)
3. Hardcoded px values outside tokens
4. font-mono or font-serif (should use Fixel only)

Report:
| File | Line | Violation | Suggested Fix |
|------|------|-----------|---------------|

Group by severity and provide fix commands where possible.
```

---

## Adding New Prompts

Edit `src/components/shared/PromptLibrary/prompts.ts` and run:

```bash
npm run sync:prompts
```

The prompt will appear in both Storybook and this file automatically.