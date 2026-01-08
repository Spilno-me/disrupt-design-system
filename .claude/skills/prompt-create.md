# Create New DDS Prompt



**Category:** documentation | **Tags:** prompt, meta, documentation, template
**Variables:** `{PROMPT_PURPOSE}`, `{CATEGORY}`
**Read first:** `.claude/component-dev-rules.md`, `.claude/clean-code-rules.md`, `.claude/ux-laws-rules.md`, `.claude/css-styling-rules.md`, `.claude/dark-mode-mapping-rules.md`, `.claude/spacing-rules.md`, `.claude/typography-rules.md`, `.claude/iconography-rules.md`, `.claude/storybook-rules.md`, `.claude/depth-layering-rules.md`

---

Create a new DDS prompt for: {PROMPT_PURPOSE}
Category: {CATEGORY}

## STEP 1: Analyze Purpose & Category

Determine appropriate category from existing options:
| Category | Use When |
|----------|----------|
| `stories` | Storybook story generation |
| `components` | Creating/modifying UI components |
| `tokens` | Adding/auditing design tokens |
| `documentation` | MDX docs, CLAUDE.md updates |
| `planning` | Feature planning, architecture decisions |
| `review` | Code review, compliance checks |
| `styling` | CSS, colors, spacing, typography |
| `responsive` | Mobile-first, breakpoints |
| `icons` | Icon usage, emoji replacement |
| `ux` | UX laws, accessibility |
| `mcp` | MCP tool usage, contrast checks |
| `delivery` | Build, packaging, local dev |

## STEP 2: Check for Existing Prompts

Before creating, search for similar prompts:
```bash
grep -i "{PROMPT_PURPOSE}" src/components/shared/PromptLibrary/prompts.ts
```

## STEP 3: Design Prompt Structure

Every DDS prompt follows this pattern:

### 3.1 Header Section
```typescript
{
  id: 'kebab-case-id',           // Unique, descriptive
  title: 'Human Readable Title',  // Action-oriented (verb first)
  description: 'One-line purpose statement.',
  category: '{CATEGORY}',
  variables: ['VAR1', 'VAR2'],    // SCREAMING_SNAKE, use {VAR} in prompt
  tags: ['relevant', 'keywords'], // For search/filtering
  prompt: `...`
}
```

### 3.2 Prompt Body Structure

```markdown
[One-line task statement with {VARIABLES}]

## PRE-FLIGHT (if MCP tools needed)
\`\`\`
mcp__dds__[relevant_tool]({ param: "value" })
\`\`\`

READ FIRST: [list applicable .claude/*.md rule files here]

## REQUIREMENTS (numbered list)
1. Specific requirement
2. Another requirement
3. Reference to DDS patterns

## PROCESS (if multi-step)
### Step 1: Action
Description

### Step 2: Action
Description

## FORBIDDEN (bullet list)
- Anti-pattern 1
- Anti-pattern 2
- Common mistake to avoid

## OUTPUT
[Describe expected deliverable format]
```

## STEP 4: Include MCP Tools Where Relevant

| Task Type | MCP Tools to Include |
|-----------|---------------------|
| Components | `search_components`, `get_component`, `check_contrast` |
| Colors | `check_contrast`, `get_accessible_colors`, `check_token_usage` |
| Tokens | `get_design_tokens`, `list_color_tokens`, `check_token_usage` |
| Dark backgrounds | `check_contrast`, `get_accessible_colors` (MANDATORY) |
| Review | `check_token_usage`, `get_color_guidance` |

## STEP 5: Reference Relevant Rule Files

| Topic | Rule File |
|-------|-----------|
| Components | `.claude/component-dev-rules.md` |
| Clean code | `.claude/clean-code-rules.md` |
| UX | `.claude/ux-laws-rules.md` |
| Colors/tokens | `.claude/css-styling-rules.md` |
| Dark mode | `.claude/dark-mode-mapping-rules.md` |
| Spacing | `.claude/spacing-rules.md` |
| Typography | `.claude/typography-rules.md` |
| Icons | `.claude/iconography-rules.md` |
| Stories | `.claude/storybook-rules.md` |
| Depth/elevation | `.claude/depth-layering-rules.md` |

## REQUIREMENTS

1. **Variables** - Use `{SCREAMING_SNAKE}` for placeholders
2. **MCP-First** - Include MCP tools for any color/token/component work
3. **Rule References** - Link to relevant .claude/*.md files
4. **Clear Output** - Specify exact deliverable format
5. **Forbidden Section** - List common anti-patterns to avoid
6. **Terse Language** - Agent-optimized, not human prose
7. **Tables** - Use tables for lookups, mappings, options
8. **Code Examples** - Show ✅ correct and ❌ incorrect patterns

## FORBIDDEN

- Creating prompts without checking for existing similar ones
- Vague output descriptions ("make it good")
- Missing MCP tools for color/contrast operations
- Human-style prose (keep it agent-scannable)
- Hardcoded file paths that may change
- Assuming context without variables

## OUTPUT FORMAT

Generate TypeScript object to add to `src/components/shared/PromptLibrary/prompts.ts`:

```typescript
{
  id: '[kebab-case-id]',
  title: '[Title]',
  description: '[One-line description]',
  category: '[category]',
  variables: ['VAR1', 'VAR2'],
  tags: ['tag1', 'tag2', 'tag3'],
  prompt: \`[Full prompt content with {VARIABLES}]

## PRE-FLIGHT
[MCP calls if needed]

READ FIRST: [Rule files]

## REQUIREMENTS
[Numbered list]

## FORBIDDEN
[Bullet list]

## OUTPUT
[Expected deliverable]\`,
},
```

After adding, run:
```bash
npm run sync:prompts      # Generate skill file
npm run validate:prompts  # Verify paths exist
```

---

*Auto-generated from `prompts.ts` — edit source, run `npm run sync:prompts`*
