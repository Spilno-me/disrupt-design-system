# Findings Library

**Organizational memory. Prevents repeating mistakes.**

---

## For Agents

**Read:** `index.json` (structured metadata)

**Query:**
```bash
jq '.bySeverity.critical' index.json
jq '.byCategory.versioning' index.json
jq '.findings[0].checklist' index.json
```

---

## Current Findings

| ID | Title | Category | Severity |
|----|-------|----------|----------|
| 001 | Versioning Strategy | versioning | CRITICAL |
| 002 | Missing Exports Audit | export | HIGH |

**Details:** See `*.md` files or query `index.json`

---

## Recording New Finding

```bash
# Copy template
cp TEMPLATE.md $(date +%Y-%m-%d)-name.md

# Fill in:
# - Context, Problem, Solution, Prevention
# - Add to index.json

# Commit
git commit -m "docs: add finding - [title]"
```

---

## Template Structure

```
# [Title]
Date: YYYY-MM-DD
Category: versioning|export|component|token|tooling
Severity: critical|high|medium|low

## Problem
What went wrong

## Solution
How fixed

## Prevention
How to avoid

## Tags
#tag1 #tag2
```

---

**Last Updated:** 2025-12-13
**Total Findings:** 2
