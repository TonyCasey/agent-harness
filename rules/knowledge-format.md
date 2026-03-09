# Knowledge Format Rule

Defines the structure and conventions for app/repo knowledge summaries.

## Summary File Location

- Self summary: `.claude/knowledge/self.md`
- Imported summaries: `.claude/knowledge/apps/{app-name}.md`
- Index: `.claude/knowledge/index.json`

## Required Sections

Every summary MUST include these sections in order:

1. **Overview** - Purpose, tech stack, repository URL
2. **Architecture** - Folder structure, patterns, entry points
3. **Public APIs** - Endpoints, events, shared utilities
4. **Data Models** - Key types, database schemas, shared packages
5. **Dependencies** - Internal packages, external services
6. **Integration Points** - How other apps connect

## Section Guidelines

### Overview
- Purpose: One sentence describing what the app does
- Tech Stack: Comma-separated list (e.g., "Node.js, TypeScript, Express, PostgreSQL")
- Repository: Full GitHub URL

### Architecture
- List top-level folders with one-line descriptions
- Identify architectural patterns (Clean Architecture, MVC, CQRS)
- Note main entry points (server.ts, index.ts, main router)

### Public APIs
- REST endpoints: `METHOD /path` format
- GraphQL: List query/mutation names
- Events: `event-name` with direction (publishes/subscribes)
- Exported utilities: Function signatures

### Data Models
- List key entities with brief descriptions
- Reference shared type packages if applicable
- Note database type (Firestore, PostgreSQL, etc.)

### Dependencies
- Internal: List internal packages used
- External services: APIs called (Stripe, SendGrid, etc.)
- Dependents: Apps that import from this package

### Integration Points
- Data flows between apps
- Shared state or caches
- Common workflows that span multiple apps

## Index File Format

```json
{
  "version": "1.0",
  "updatedAt": "ISO-8601 timestamp",
  "apps": [
    {
      "name": "api",
      "path": "apps/api.md",
      "scannedAt": "ISO-8601 timestamp",
      "source": "import" | "scan"
    }
  ]
}
```

## Naming Conventions

- App names: lowercase, hyphenated (e.g., `admin`, `dashboards`)
- Summary files: `{app-name}.md`
- Use repo name as app name when scanning

## Content Guidelines

- Be concise but complete
- Focus on information useful for planning new features
- Include version numbers for major dependencies
- Update summaries when architecture changes significantly
- Mark outdated summaries in index.json
