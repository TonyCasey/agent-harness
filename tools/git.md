# Git

Version control system for all repository operations.

## Branch Workflow

### Feature Branch

```bash
# Start from latest master
git fetch origin master
git checkout -b feature-branch origin/master

# Work, commit, push
git add .
git commit -m "feat: add feature"
git push -u origin feature-branch
```

### Sequential PR Workflow

For subtasks with dependencies, use sequential branches from master:

```
master ──┬──────────────────┬──────────────────┬──▶
         │                  │                  │
         └─ PROJ-1234 ──PR──┘                  │
                            └─ PROJ-1235 ──PR──┘
```

```bash
# Complete first subtask
git checkout -b feature-branch origin/master
# ... work, PR, wait for merge

# Start next subtask from updated master
git fetch origin master
git checkout -b PROJ-1235 origin/master
```

## Common Commands

### Status & History

```bash
git status
git log --oneline -10
git log origin/master..HEAD --oneline  # Commits since branching
git diff origin/master..HEAD            # Changes since branching
```

### Branching

```bash
git branch                    # List local branches
git branch -r                 # List remote branches
git checkout -b <branch>      # Create and switch
git checkout <branch>         # Switch
git branch -d <branch>        # Delete local branch
```

### Staging & Committing

```bash
git add <file>                # Stage specific file
git add .                     # Stage all
git commit -m "message"       # Commit
git commit --amend            # Amend last commit (careful!)
```

### Remote Operations

```bash
git fetch origin              # Fetch updates
git pull origin master        # Pull master
git push -u origin <branch>   # Push and set upstream
git push                      # Push to upstream
```

### Undoing

```bash
git checkout -- <file>        # Discard file changes
git reset HEAD <file>         # Unstage file
git reset --soft HEAD~1       # Undo last commit, keep changes
git stash                     # Stash changes
git stash pop                 # Restore stash
```

## Commit Message Format

```
type: short description

Longer explanation if needed.

Fixes #123
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Merge conflicts | `git status`, edit files, `git add`, `git commit` |
| Detached HEAD | `git checkout <branch>` |
| Wrong branch | `git stash`, `git checkout correct-branch`, `git stash pop` |
| Undo last push | `git revert HEAD`, then push (don't force push) |
