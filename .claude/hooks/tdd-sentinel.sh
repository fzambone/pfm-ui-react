#!/bin/bash
# TDD Sentinel — warns when a production .ts/.tsx file is written without a corresponding test.
# Used as a PostToolUse hook in Claude Code settings.json.
# WARNING only, not blocking — a nudge to write tests first.

# Extract file_path from stdin JSON and check for test file
RESULT=$(python3 -c "
import sys, json, os

raw = sys.stdin.read()
try:
    data = json.loads(raw)
except Exception:
    sys.exit(0)

tool_input = data.get('tool_input', {})
file_path = tool_input.get('file_path', '')

# Only check .ts and .tsx files
if not (file_path.endswith('.ts') or file_path.endswith('.tsx')):
    sys.exit(0)

# Skip test files — they ARE the test
if file_path.endswith('.test.ts') or file_path.endswith('.test.tsx'):
    sys.exit(0)
if file_path.endswith('.spec.ts') or file_path.endswith('.spec.tsx'):
    sys.exit(0)

# Only check files under src/
if '/src/' not in file_path:
    sys.exit(0)

# Exempt test utility directory
if '/src/test/' in file_path:
    sys.exit(0)

# Exempt index.ts/index.tsx barrel exports
basename = os.path.basename(file_path)
if basename in ('index.ts', 'index.tsx'):
    sys.exit(0)

# Exempt main.tsx (app entry point)
if basename == 'main.tsx':
    sys.exit(0)

# Exempt type declaration files
if file_path.endswith('.d.ts'):
    sys.exit(0)

# Check if corresponding test file exists
if file_path.endswith('.tsx'):
    test_file = file_path[:-4] + '.test.tsx'
elif file_path.endswith('.ts'):
    test_file = file_path[:-3] + '.test.ts'
else:
    sys.exit(0)

if os.path.exists(test_file):
    sys.exit(0)

# Also check for .spec variant
spec_file = test_file.replace('.test.', '.spec.')
if os.path.exists(spec_file):
    sys.exit(0)

# Extract relative path for readability
rel = file_path
if '/src/' in file_path:
    idx = file_path.index('src/')
    rel = file_path[idx:]

test_rel = test_file
if '/src/' in test_file:
    idx = test_file.index('src/')
    test_rel = test_file[idx:]

msg = (
    f'TDD Reminder: {rel} was written but no corresponding test file exists ({test_rel}). '
    f'Consider writing the test first.'
)
result = {'hookEventName': 'PostToolUse', 'additionalContext': msg}
print(json.dumps(result))
")

if [ -n "$RESULT" ]; then
  echo "$RESULT"
fi
