# Audit Token Usage

> **AUTO-GENERATED** from prompts.ts - Do not edit directly!
> Source: `src/components/shared/PromptLibrary/prompts.ts`

Find and fix hardcoded values that should use tokens.

## Variables

- `{COMPONENT}` - Replace with actual value

## Prompt

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

## Usage

This skill is automatically available to agents working in the DDS codebase.
Agents should read the required files before executing this prompt.
