---
description: Scaffold a new design system project with 2-tier token architecture
argument-hint: Project name (e.g., "acme", "starlight")
---

# Create Design System: $ARGUMENTS

Generate a complete, production-ready design system for **$ARGUMENTS**.

## Output Location

Create the project at: `./$ARGUMENTS-ds`

If no name provided, ask the user for a project name first.

---

## Multi-Model Orchestration (TOON Pattern)

Execute in parallel waves using optimal models per task:

### Phase 1: Foundation [Parallel - Haiku]
Fast, simple setup tasks - spawn multiple Haiku agents simultaneously:
1. Create directory structure
2. Initialize package.json
3. Create tsconfig.json
4. Create eslint.config.js
5. Create .gitignore

### Phase 2: Build System [Parallel - Sonnet]
Integration decisions needed:
1. Create vite.config.ts (library mode)
2. Create tailwind.config.js
3. Setup Storybook configuration

### Phase 3: Token Architecture [Sequential - Opus]
**CRITICAL**: This requires architectural decisions
1. Ask user for brand colors (primary, accent, semantic)
2. Design 2-tier token system (PRIMITIVES → ALIAS)
3. Generate tokens.ts
4. Generate tailwind-preset.js

### Phase 4: Core Files [Parallel - Haiku]
1. Create src/lib/utils.ts (cn function)
2. Create src/styles/base.css
3. Create src/index.ts (exports)
4. Create CLAUDE.md with token constraints

### Phase 5: Agent Context [Sequential - Sonnet]
Create `.claude/agent-context.json` with:
- Token constraints
- Color matrix for valid combinations
- Component patterns
- WCAG contrast rules

---

## Directory Structure to Create

```
$ARGUMENTS-ds/
├── .claude/
│   ├── color-matrix.json        # Valid color combinations
│   └── contrast-matrix.json     # WCAG validation
├── .storybook/
│   ├── main.ts
│   └── preview.ts
├── src/
│   ├── components/ui/           # UI components
│   ├── constants/
│   │   └── tokens.ts            # 2-tier tokens (PRIMITIVES → ALIAS)
│   ├── lib/
│   │   └── utils.ts             # cn() helper
│   ├── styles/
│   │   ├── base.css
│   │   └── tokens.css
│   └── index.ts
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── tailwind-preset.js
├── eslint.config.js
├── CLAUDE.md                    # Token constraints
└── README.md
```

---

## User Input Required

Before token generation, use AskUserQuestion to gather:

### 1. Brand Colors
- Primary color (main brand)
- Accent color (interactive elements)
- Optional: Secondary, tertiary

### 2. Typography
- Font family preference (system, Google Fonts, custom)

---

## Token Constraint Rules (Embed in CLAUDE.md)

The generated CLAUDE.md MUST include:

### FORBIDDEN
- Raw hex values: `#08A4BD`, `#fff`
- CSS color functions: `rgb()`, `hsl()`
- Standard Tailwind colors: `bg-blue-500`, `text-gray-600`
- Arbitrary values: `bg-[#fff]`

### REQUIRED
- Semantic classes: `bg-surface`, `text-primary`, `border-default`
- Token imports: `import { ALIAS } from '../constants/tokens'`

---

## Execution

1. Confirm project name with user
2. Gather brand color preferences
3. Execute phases using Task tool with appropriate models
4. Report progress after each phase
