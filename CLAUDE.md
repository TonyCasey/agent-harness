# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Agent Harness (`/ah`) is a Claude Code toolkit that helps developers automate repetitive tasks through a layered architecture.

## Knowledge Base (Load at Session Start)

**At the start of planning or development tasks, consult the organizational knowledge base:**

1. Read `.claude/knowledge/index.json` to see available app summaries
2. Load relevant summaries from `.claude/knowledge/apps/` for context
3. Use this knowledge to:
   - Understand how this repo connects to other apps
   - Find existing APIs, types, and patterns to reuse
   - Identify integration points and dependencies
   - Avoid duplicating functionality that exists elsewhere

**Key files:**
- `.claude/knowledge/self.md` - Summary of this repository
- `.claude/knowledge/apps/*.md` - Summaries of related apps
- `.claude/knowledge/index.json` - Index of all known apps

**Quick commands:**
- `ah knowledge scan` - Generate/update this repo's summary
- `ah knowledge search <query>` - Find relevant context across all apps

## Testing

```bash
claude
```

## Commands

All commands use the `ah` skill with subcommands:

```bash
# Git commands (with AI metadata)
ah git checkout <branch>       # Checkout or create a branch
ah git commit [message]        # Stage and commit with AI trailers
ah git push                    # Push current branch to remote
ah git status                  # Show detailed git status
ah git remember <decision>     # Store a decision in git memory
ah git recall [query]          # Search past decisions/context

# PR commands
ah pr create [title]           # Create a pull request (draft mode)
ah pr watch <pr-number>        # Address comments, make fixes, resolve (loops)
ah pr stop <pr-number>         # Stop watching a PR
ah pr review <repo> <pr>       # Online review (fast, creates pending review)
ah pr review-submit <repo> <pr> # Submit a pending review

# Ticket commands (Jira, Linear, ClickUp, GitHub Issues)
ah ticket create <title>       # Create a ticket
ah ticket view <ticket>        # View ticket details
ah ticket transition <t> <s>   # Transition ticket status

# Planning commands
ah plan <feature-name>         # Document a feature plan
ah plan <path> split           # Break down plan into tasks
ah plan <path> tickets         # Create tickets from tasks

# Knowledge base commands
ah knowledge scan              # Generate summary of current repo
ah knowledge import <path>     # Import summary from another repo
ah knowledge search <query>    # Search across knowledge base

# Testing commands
ah test <repo> [test-file]     # Run Playwright tests for a repo

# Development workflows
ah develop [plan-path]         # Execute tasks from plan (enforces architecture rules)
ah new-feature <name>          # Start a new feature
ah bug-fix <issue>             # Fix a bug
ah pr-ready                    # Prepare branch for PR
ah refactor <target>           # Safe refactoring

# Utilities
ah automate <task>             # Automate a repetitive task
ah workflow <name>             # Run a workflow by name
```

## Architecture

### Component Responsibilities

| Component | Location | Purpose |
|-----------|----------|---------|
| **Skill** | `skills/` | Entry point - routes user command to workflow |
| **Workflow** | `workflows/` | Steps - defines WHAT to do, in what order |
| **Agent** | `agents/` | Executor - defines WHO executes, with what tools, following which rules |
| **Rule** | `rules/` | Constraints - requirements that MUST be followed (formats, standards) |
| **Template** | `templates/` | Artifacts - files to fill in during execution |
| **Tool** | `tools/` | Documentation - external tool setup and usage |

### Command Flow

```
User invokes: ah pr create "My feature"
                         ↓
┌─────────────────────────────────────────────────────────┐
│ 1. SKILL (skills/ah/SKILL.md)                           │
│    - Parses command: "pr" + "create" + "My feature"     │
│    - Routes to appropriate workflow                     │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ 2. WORKFLOW (workflows/pr-create.md)                    │
│    - Defines steps 1-6 (WHAT to do)                     │
│    - Specifies which agent executes                     │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ 3. AGENT (agents/pr-creator.md)                         │
│    - Has allowed-tools: Read, Grep, Glob, Bash, Write   │
│    - Must follow rules: pr-description, commit-standards│
│    - Uses templates: pr-description-template.txt        │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ 4. EXECUTION                                            │
│    Agent executes workflow steps using its tools        │
│    while following its rules as constraints             │
│                                                         │
│    Rules consulted:                                     │
│    - rules/pr-description.md (title format, structure)  │
│    - rules/commit-standards.md (commit format)          │
│                                                         │
│    Templates filled:                                    │
│    - templates/pr-description-template.txt              │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ 5. OUTPUT                                               │
│    - PR URL                                             │
│    - Next action reminder                               │
└─────────────────────────────────────────────────────────┘
```

### Key Principle

- **Workflows** define steps (WHAT)
- **Agents** execute steps (WHO + tools)
- **Rules** constrain execution (HOW - must follow)
- **Templates** are artifacts produced

Rules are NOT step-by-step instructions. They are requirements/constraints the agent must follow during execution.

## Project Structure

```
manifest.json                # Package manifest
skills/                      # Entry points (slash commands)
  ah/                        # ah <command> [subcommand] [args]
workflows/                   # Step sequences (WHAT to do)
  git-checkout.md            # Branch checkout/creation
  git-commit.md              # Commit with AI trailers
  git-push.md                # Push to remote
  git-status.md              # Detailed status
  git-remember.md            # Store decisions
  git-recall.md              # Search decisions
  pr-create.md               # Create PR (draft mode)
  pr-watch.md                # Auto-fix PR comments
  pr-stop.md                 # Stop watching a PR
  pr-review.md               # Online review (fast, no local setup)
  pr-review-local.md         # Full local review (clones repos)
  pr-ready.md                # Pre-PR checks
  ticket-create.md             # Create ticket (multi-tool)
  ticket-view.md               # View ticket details
  ticket-transition.md         # Transition ticket status
  plan.md                      # Document feature plans
  plan-split.md                # Break plans into tasks
  plan-tickets.md              # Create tickets from tasks
  knowledge-scan.md            # Generate repo summary
  knowledge-import.md          # Import from other repos
  knowledge-search.md          # Search knowledge base
  test.md                      # Run Playwright tests
  develop.md                   # Execute tasks from plan (enforces rules)
  new-feature.md
  bug-fix.md
  refactor.md
  automate.md
agents/                      # Executors (WHO + tools + rules)
  developer.md               # General development
  planner.md                 # Feature planning
  knowledge-agent.md         # Knowledge base management
  pr-creator.md              # PR creation
  pr-watcher.md              # PR monitoring
  pr-reviewer.md             # Code review
  project-agent.md           # Ticket operations (multi-tool)
  task-automator.md          # Task automation
rules/                       # Constraints (MUST follow)
  project-tool.md            # Ticket format, workflow (multi-tool)
  feature-planning.md        # Task sizing, plan format
  knowledge-format.md        # Knowledge base structure
  pr-description.md          # PR format, draft mode, test coverage
  code-review.md             # Review structure
  security-checks.md         # Security checklist
  commit-standards.md        # Commit message format
  ci-status.md               # CI interpretation
  shared/                    # Language-agnostic principles
    clean-architecture.md    # Layer structure, SOLID, DI
    testing-principles.md    # Testing pyramid, FIRST, AAA
  typescript/                # TypeScript-specific
    coding-standards.md
    testing.md
    typescript-config-guide.md
templates/                   # Artifacts to fill
  pr-description-template.txt
  commit-message-template.txt
  code-review-comment-template.txt
  bug-report-template.txt
  feature-checklist-template.txt
  feature-plan-template.txt
  execution-plan-template.txt
  app-summary-template.txt
knowledge/                   # Organizational knowledge base
  self.md                    # This repo's summary
  apps/                      # Imported app summaries
  index.json                 # Index of known apps
tools/                       # External tool docs
  gh.md                      # GitHub CLI (inline comments)
  git.md, node.md, jq.md, jira.md, playwright.md
hooks/hooks.json             # Event automation
scripts/                     # Shell scripts
```

## Adding Components

**Skill**: `skills/<name>/SKILL.md`
- Entry point invoked by users
- Routes to workflow based on arguments

**Workflow**: `workflows/<name>.md`
- Frontmatter: `agent: <agent-name>`
- Body: numbered steps (WHAT to do)

**Agent**: `agents/<name>.md`
- Frontmatter: `allowed-tools`, `rules`, `templates`
- Body: capabilities and behavior

**Rule**: `rules/<name>.md`
- Constraints and requirements
- NOT step-by-step instructions
- Format: "X MUST be Y", "Always include Z"

**Template**: `templates/<name>.txt`
- Artifacts with placeholders
- Filled by agent during execution

<!-- AGENT-HARNESS:START -->
## Agent Harness

This project uses Agent Harness (`/ah`) for automated workflows.

### Session Start: Load Knowledge Base

**Before planning or development tasks, always load organizational context:**

1. Check `.claude/knowledge/index.json` for available app summaries
2. Read relevant summaries from `.claude/knowledge/apps/` for:
   - Related systems and integration points
   - Existing APIs, types, and patterns to reuse
   - Dependencies and data flows
3. Read `.claude/knowledge/self.md` to understand this repo's architecture

### Available Commands

```bash
# Knowledge & Planning
ah knowledge scan              # Generate/update this repo's summary
ah knowledge import <path>     # Import summary from another repo
ah knowledge search <query>    # Search across all apps
ah plan <feature>              # Plan feature with knowledge context

# Git (with AI metadata)
ah git commit [message]        # Commit with AI trailers
ah git checkout <branch>       # Checkout or create branch

# Pull Requests
ah pr create [title]           # Create PR in draft mode
ah pr watch <pr-number>        # Auto-fix PR comments
ah pr review [pr-number]       # Review with inline comments

# Tickets (Jira, Linear, ClickUp, GitHub Issues)
ah ticket create <title>       # Create ticket
ah ticket view <ticket>        # View ticket details
```

### Rules to Follow

When executing tasks, consult rules in `.claude/rules/`:
- `commit-standards.md` - Commit message format
- `pr-description.md` - PR format and requirements
- `typescript/coding-standards.md` - TypeScript conventions
- `typescript/testing.md` - Testing patterns

### Project Structure

```
.claude/
├── knowledge/          # Organizational knowledge (NEVER modify directly)
│   ├── self.md         # This repo's summary
│   ├── apps/           # Other repos' summaries
│   └── index.json      # Knowledge index
├── workflows/          # Step-by-step workflows
├── agents/             # Agent definitions with tools/rules
├── rules/              # Constraints and standards
├── templates/          # Output templates
└── README.md           # Full AH documentation
```

See `.claude/README.md` for complete documentation.
<!-- AGENT-HARNESS:END -->
