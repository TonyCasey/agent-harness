# Tools Reference

Summary of external tools required by workflows.

See `tools/` directory for detailed documentation on each tool.

## Required Tools

| Tool | Purpose | Install |
|------|---------|---------|
| [gh](../tools/gh.md) | GitHub CLI - PR/issue management | `brew install gh` |
| [Node.js v18](../tools/node.md) | JavaScript runtime | `nvm install 18` |
| [git](../tools/git.md) | Version control | Pre-installed on macOS |
| [jq](../tools/jq.md) | JSON processor | `brew install jq` |

## Project Tools (choose one)

| Tool | Purpose | Install |
|------|---------|---------|
| [Jira](../tools/jira.md) | Issue tracking | `brew install jira-cli` |
| [Linear](../tools/linear.md) | Issue tracking | `npm install -g @linear/cli` |
| [ClickUp](../tools/clickup.md) | Task management | API only |
| GitHub Issues | Issue tracking | Uses `gh` CLI |

## Optional Tools

| Tool | Purpose | Install |
|------|---------|---------|
| [Playwright](../tools/playwright.md) | E2E testing | `npm install -D @playwright/test` |

## Quick Setup

```bash
# Install Homebrew tools
brew install gh jq

# Authenticate GitHub
gh auth login

# Install Node.js 18 via nvm
nvm install 18
nvm alias default 18

```

## Environment Variables

Add to `~/.zshrc` or create a `.env` file:

```bash
# Project Tool (choose one: jira, linear, clickup, github-issues)
export PROJECT_TOOL=jira
export PROJECT_BASE_URL=https://your-instance.atlassian.net
export PROJECT_KEY=PROJ
export PROJECT_USER_EMAIL=your-email@example.com

# GitHub
export GITHUB_API_KEY="ghp_xxxxxxxxxxxx"

# Tool-specific (if needed)
# export LINEAR_API_KEY="lin_api_xxxxxxxxxxxx"
# export CLICKUP_API_KEY="pk_xxxxxxxxxx"
```

## Version Requirements

| Tool | Version |
|------|---------|
| Node.js | v18.x |
| gh | Latest |
| Playwright | Latest |

## Verification

```bash
# Check all tools
node --version      # v18.x.x
gh --version        # gh version x.x.x
jq --version        # jq-1.x
git --version       # git version x.x.x
```
