#!/bin/bash
# Lint on Save — runs ESLint on the just-edited TypeScript file.
# PostToolUse hook on Edit|Write. Informational only — never blocks.

RESULT=$(python3 -c "
import sys, json, subprocess

raw = sys.stdin.read()
try:
    data = json.loads(raw)
except Exception:
    sys.exit(0)

file_path = data.get('tool_input', {}).get('file_path', '')

# Only lint .ts and .tsx source files
if not (file_path.endswith('.ts') or file_path.endswith('.tsx')):
    sys.exit(0)

# Run ESLint on the specific file
try:
    proc = subprocess.run(
        ['pnpm', 'exec', 'eslint', '--no-warn-ignored', file_path],
        capture_output=True, text=True, timeout=30
    )
except Exception:
    sys.exit(0)

# Exit 0 from ESLint means no issues — stay silent
if proc.returncode == 0:
    sys.exit(0)

output = (proc.stdout + proc.stderr).strip()
if not output:
    sys.exit(0)

# Truncate to first 20 lines to avoid flooding context
lines = output.splitlines()
if len(lines) > 20:
    lines = lines[:20]
    lines.append('... (truncated — run pnpm exec eslint \$file_path for full output)')
msg = chr(10).join(lines)

result = {'hookEventName': 'PostToolUse', 'additionalContext': 'Lint:\\n' + msg}
print(json.dumps(result))
")

if [ -n "$RESULT" ]; then
  echo "$RESULT"
fi
