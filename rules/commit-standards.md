# Commit Standards Rule

Generic commit standards. For project-specific conventions, create `rules/commit-standards.local.md`.

Follow conventional commits format:

## Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

## Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Formatting, no code change
- `refactor`: Code change that neither fixes nor adds
- `perf`: Performance improvement
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

## Subject Line
- Use imperative mood: "add" not "added" or "adds"
- No period at the end
- Max 72 characters
- Lowercase

## Body
- Explain what and why, not how
- Wrap at 72 characters
- Separate from subject with blank line

## Footer
- Reference issues: `Fixes #123`
- Breaking changes: `BREAKING CHANGE: description`

## Examples

Good:
```
feat(auth): add OAuth2 login support

Implement Google and GitHub OAuth providers.
Users can now link social accounts.

Fixes #456
```

Bad:
```
updated stuff
```

---

## Local Overrides

To customize for your project, create `rules/commit-standards.local.md` with:
- Custom scopes for your codebase
- Additional commit types
- Company-specific footer requirements
- Required ticket references

The workflow will use the local file if it exists.
