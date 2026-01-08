---
name: prompt-router-execute
enabled: true
event: prompt
action: remind
conditions:
  - field: user_prompt
    operator: regex_match
    pattern: \b(use\s+prompt\s+library|select\s+prompt|choose\s+prompt|auto-select\s+prompt|pick\s+a?\s*prompt)\b
---

## Execute Prompt Router

Read and execute `.claude/skills/prompt-router.md` now.

This skill will:
1. Analyze the conversation context (keywords, intent, artifacts)
2. Match to the best prompt from the library
3. Output the selection with reasoning
4. Execute the selected prompt

**Start with Step 1: Context Analysis**

