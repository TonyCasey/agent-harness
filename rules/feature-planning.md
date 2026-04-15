# Feature Planning Rule

Generic planning standards. For project-specific conventions, create `rules/feature-planning.local.md`.

## File Structure
Planning creates two files:
- **Plan**: `.claude/plans/{feature-name}.md` - The feature specification
- **Execution Plan**: `.claude/plans/{feature-name}-execution-plan.md` - Actionable tasks

## Plan File Format
Plans MUST include these sections:
- **Status**: Planning | Tasks Defined | In Progress | Done
- **Overview**: What and why
- **Requirements**: Bullet list of what it needs to do
- **Technical Approach**: How it will be implemented
- **Acceptance Criteria**: Checkboxes for verification
- **Execution Plan**: Link to execution plan (added by `ah plan split`)
- **Tickets**: Link to parent ticket (added by `ah plan tickets`)

## Execution Plan Format
Execution plans MUST include:
- **Status**: Tasks Defined | In Progress | Done
- **Source Plan**: Link back to the original plan
- **Tasks**: Numbered list with description, acceptance criteria, ticket ID
- **Tickets**: Parent and child ticket links (added by `ah plan tickets`)
- **Dependencies**: Notes on task dependencies
- **Notes**: Additional context

## Task Sizing
Each task MUST be:
- Completable in a single PR
- Independently testable
- Clear and actionable (start with verb)

## Task Ordering
Tasks MUST be ordered by dependency:
1. Schema/data model changes first
2. Backend/API implementation
3. Frontend/UI implementation
4. Integration and testing

## Subtask Naming
Subtask titles MUST:
- Start with an action verb (Add, Implement, Create, Update, Fix)
- Be specific and descriptive
- Not exceed 80 characters

Examples:
- "Set up auth database schema"
- "Implement email/password registration endpoint"
- "Add Google OAuth integration"

## Ticket Structure
Always create:
- **Parent ticket** (Story/Issue) - The feature being implemented
- **Child tickets** (Subtasks/Sub-issues) - Individual tasks linked to the parent

Structure varies by tool:
- Jira: Story + Subtasks
- Linear: Issue + Sub-issues
- ClickUp: Task + Subtasks
- GitHub: Issue + linked Issues (or checklist)

## Status Workflow
- **Planning**: Initial state after `ah plan <feature>`
- **Tasks Defined**: After `ah plan <path> split` creates execution plan
- **In Progress**: After `ah plan <path> tickets` creates tickets
- **Done**: All subtasks completed

## Update Rules

### After `ah plan <path> split`:
1. Create `{feature-name}-execution-plan.md` with tasks
2. Update original plan:
   - Add link to execution plan
   - Change Status to "Tasks Defined"

### After `ah plan <path> tickets`:
1. Update execution plan:
   - Add Tickets section with parent and child ticket links
   - Update each task with its ticket ID
   - Change Status to "In Progress"
2. Update original plan:
   - Add link to parent ticket
   - Change Status to "In Progress"

---

## Local Overrides

To customize for your project, create `rules/feature-planning.local.md` with:
- Custom task sizing guidelines
- Team-specific naming conventions
- Required plan sections
- Integration with specific project tools

The workflow will use the local file if it exists.
