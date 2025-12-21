# Update CLAUDE.md

> **AUTO-GENERATED** from prompts.ts - Do not edit directly!
> Source: `src/components/shared/PromptLibrary/prompts.ts`

Add a new rule or section to CLAUDE.md agent instructions.

## Variables

- `{RULE_DESCRIPTION}` - Replace with actual value

## Prompt

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

## Usage

This skill is automatically available to agents working in the DDS codebase.
Agents should read the required files before executing this prompt.
