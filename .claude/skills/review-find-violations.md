# Find All Token Violations

> **AUTO-GENERATED** from prompts.ts - Do not edit directly!
> Source: `src/components/shared/PromptLibrary/prompts.ts`

Search entire codebase for hardcoded values.

## Prompt

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

## Usage

This skill is automatically available to agents working in the DDS codebase.
Agents should read the required files before executing this prompt.
