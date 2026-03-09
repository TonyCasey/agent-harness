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
