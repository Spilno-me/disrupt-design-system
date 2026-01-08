---
name: warn-console-log
enabled: false  # DEPRECATED: Use code-quality instead (consolidated)
event: file
action: warn
conditions:
  - field: file_path
    operator: regex_match
    pattern: \.(tsx?|jsx?)$
  - field: content
    operator: regex_match
    pattern: console\.(log|debug|info)\(
---

## ⚠️ Console Log Detected

You're adding a `console.log` statement.

### Is this intentional?

| Purpose | Action |
|---------|--------|
| **Debugging** | Remove before commit |
| **Error logging** | Use `console.error()` instead |
| **User feedback** | Show in UI, not console |

### Clean Code Rule:
Production code should not have debug logs. Users never see the console.

### If keeping for errors:
```tsx
// ✅ OK - error logging with user feedback
} catch (err) {
  console.error('Operation failed:', err)
  setError('Operation failed. Please try again.')  // User sees this
}

// ❌ Bad - silent console log
} catch (err) {
  console.log(err)  // User sees nothing
}
```
