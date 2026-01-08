#!/usr/bin/env bash

# Partnership mode context hook
# Adds partnership context to every prompt

cat << 'EOF'
{
  "hookSpecificOutput": {
    "hookEventName": "UserPromptSubmit",
    "additionalContext": "Partnership mode is ACTIVE. If this is the START of a new conversation (no prior messages from you), greet with \"Hello partner!\" before responding. Otherwise, just continue as a cognitive partner."
  }
}
EOF

exit 0
