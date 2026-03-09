# jq - JSON Processor

Lightweight command-line JSON processor used by the review tool.

## Installation

```bash
# macOS
brew install jq

# Verify
jq --version
```

## Basic Usage

```bash
# Pretty print JSON
echo '{"name":"test"}' | jq .

# Extract field
echo '{"name":"test"}' | jq '.name'

# Extract from array
echo '[{"id":1},{"id":2}]' | jq '.[0].id'
```

## Common Patterns

### With gh CLI

```bash
# Get PR file paths
gh pr view 123 --json files | jq -r '.files[].path'

# Get PR title
gh pr view 123 --json title | jq -r '.title'

# Filter by condition
gh pr list --json number,title | jq '.[] | select(.number > 100)'
```

### With curl

```bash
# Parse API response
curl -s https://api.github.com/repos/owner/repo | jq '.description'
```

## Useful Flags

- `-r` - Raw output (no quotes)
- `-c` - Compact output
- `-e` - Exit with error if result is null/false
- `-s` - Slurp multiple inputs into array

## Examples

```bash
# Multiple fields
jq '{name: .name, id: .id}'

# Array length
jq 'length'

# Map over array
jq '.[] | .name'

# Filter array
jq '[.[] | select(.status == "open")]'

# Keys of object
jq 'keys'
```
