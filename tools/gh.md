# GitHub CLI (gh)

GitHub's official command line tool for PR and issue management.

## Installation

```bash
# macOS
brew install gh

# Verify
gh --version
```

## Authentication

```bash
gh auth login
```

Select:
- GitHub.com
- HTTPS
- Login with browser

## Common Commands

### Pull Requests

```bash
# Create PR
gh pr create --title "Title" --body "Body" --label "TEST" --base master

# View PR
gh pr view 123
gh pr view 123 --json title,body,files,commits

# List PRs
gh pr list

# Check PR status
gh pr status

# Review PR
gh pr review 123 --approve
gh pr review 123 --request-changes --body "Needs fixes"
gh pr review 123 --comment --body "Looks good"

# Diff
gh pr diff 123

# Checkout PR locally
gh pr checkout 123

# Merge
gh pr merge 123 --squash
```

### Issues

```bash
# View issue
gh issue view 123

# List issues
gh issue list

# Create issue
gh issue create --title "Title" --body "Body"
```

### API Access

```bash
# Get PR comments
gh api repos/{owner}/{repo}/pulls/123/comments

# Get PR reviews
gh api repos/{owner}/{repo}/pulls/123/reviews
```

### Inline Review Comments

Comment on specific files/lines in a PR:

```bash
# Single comment on a specific line
gh api repos/{owner}/{repo}/pulls/123/comments \
  -f body="This could use better error handling" \
  -f path="src/utils/helper.ts" \
  -f commit_id="$(gh pr view 123 --json headRefOid -q .headRefOid)" \
  -F line=42

# Comment on a range of lines (multi-line comment)
gh api repos/{owner}/{repo}/pulls/123/comments \
  -f body="Consider extracting this into a helper function" \
  -f path="src/services/api.ts" \
  -f commit_id="$(gh pr view 123 --json headRefOid -q .headRefOid)" \
  -F start_line=10 \
  -F line=25

# Submit a full review with inline comments
gh api repos/{owner}/{repo}/pulls/123/reviews \
  -f event="COMMENT" \
  -f body="Overall review summary" \
  --input - <<'EOF'
{
  "comments": [
    {
      "path": "src/file1.ts",
      "line": 15,
      "body": "Suggestion for this line"
    },
    {
      "path": "src/file2.ts",
      "start_line": 20,
      "line": 30,
      "body": "Multi-line comment"
    }
  ]
}
EOF
```

**Review events:**
- `PENDING` - Create draft review (not visible to PR author until submitted)
- `COMMENT` - General feedback
- `APPROVE` - Approve the PR
- `REQUEST_CHANGES` - Request changes before merge

### Pending (Draft) Reviews

Create a pending review that you can review before publishing:

```bash
# Create pending review with inline comments
gh api repos/{owner}/{repo}/pulls/123/reviews \
  -f commit_id="$(gh pr view 123 --json headRefOid -q .headRefOid)" \
  --input - <<'EOF'
{
  "event": "PENDING",
  "body": "Review summary (optional)",
  "comments": [
    {
      "path": "src/file.ts",
      "line": 42,
      "body": "Issue description"
    }
  ]
}
EOF

# List pending reviews
gh api repos/{owner}/{repo}/pulls/123/reviews \
  --jq '.[] | select(.state == "PENDING")'

# Submit a pending review
REVIEW_ID=$(gh api repos/{owner}/{repo}/pulls/123/reviews \
  --jq '.[] | select(.state == "PENDING") | .id' | head -1)

gh api repos/{owner}/{repo}/pulls/123/reviews/$REVIEW_ID/events \
  -f event="APPROVE" \
  -f body="LGTM!"

# Delete a pending review (discard without submitting)
gh api repos/{owner}/{repo}/pulls/123/reviews/$REVIEW_ID -X DELETE
```

**Required fields for inline comments:**
- `path` - File path relative to repo root
- `line` - Line number to comment on (for additions/changes)
- `body` - Comment text
- `commit_id` - HEAD commit SHA of the PR

**For multi-line comments:**
- `start_line` - Starting line of the range
- `line` - Ending line of the range

## Environment Variables

```bash
# Token (usually set via gh auth login)
export GH_TOKEN="your_token"

# Or
export GITHUB_TOKEN="your_token"
```

## Useful Flags

- `--json <fields>` - Output specific fields as JSON
- `--jq <expression>` - Filter JSON output
- `--web` - Open in browser
- `-R owner/repo` - Specify repository

## Examples

```bash
# Create PR with heredoc body
gh pr create --title "[PROJ-1234] - Feature" --label "TEST" --base master --body "$(cat <<'EOF'
### Changes
- Change 1
- Change 2
EOF
)"

# Get PR files as JSON
gh pr view 123 --json files --jq '.files[].path'

# Check CI status
gh pr checks 123
```
