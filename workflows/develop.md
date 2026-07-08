---
name: develop
description: Execute development tasks from a plan with strict adherence to architecture and coding standards
agent: developer
---

# Develop Workflow

Execute tasks from an execution plan with strict adherence to architectural principles and coding standards.

## Required Rules

**You MUST read and follow these rules before writing any code:**

1. `.claude/rules/shared/clean-architecture.md` - Layer structure, SOLID, dependency inversion
2. `.claude/rules/shared/testing-principles.md` - Testing pyramid, FIRST principles, AAA pattern
3. `.claude/rules/typescript/coding-standards.md` - TypeScript conventions, strict null checks, naming
4. **Commit Standards**: Check for `.claude/rules/commit-standards.local.md` first, fall back to `.claude/rules/commit-standards.md`

**These are not optional.** Consult them before implementation and verify compliance before committing.

---

## Phase 1: Research

Load context and understand the task to be implemented.

- [ ] Read the execution plan from `.claude/plans/<feature>-execution-plan.md`
- [ ] Identify the next uncompleted task
- [ ] Load agent memory from `.claude/memory/developer.json`
- [ ] **Read required rules** (listed above) - understand layer boundaries and testing requirements
- [ ] Analyze existing codebase for patterns and conventions
- [ ] Identify which architectural layer this task belongs to (domain, application, infrastructure)
- [ ] Check for existing interfaces/types that should be used or extended

**Output**: Clear understanding of task scope, target layer, and applicable patterns

---

## Phase 2: Plan

Design implementation following Clean Architecture.

- [ ] **Verify layer placement**: Domain has no dependencies, Application depends on Domain only, Infrastructure implements interfaces
- [ ] Plan file locations following project structure
- [ ] Define interfaces FIRST (in domain layer if applicable)
- [ ] Plan test cases following testing pyramid (unit tests for business logic)
- [ ] Identify dependencies to inject (constructor injection)
- [ ] Check for potential null/undefined scenarios to handle

**Output**: Implementation plan with:
- Target files and their layers
- Interfaces to create/implement
- Test cases to write
- Dependencies to inject

---

## Phase 3: Execute

Implement following TDD and Clean Architecture.

### 3.1 Setup
- [ ] Fetch latest `staging`
- [ ] Create/checkout task branch (ticket ID or descriptive name)

### 3.2 Interfaces First
- [ ] Create domain interfaces if needed (prefix with `I`)
- [ ] Define contracts before implementations

### 3.3 Test-Driven Implementation
- [ ] Write failing test(s) for the task
- [ ] Implement minimum code to pass tests
- [ ] Refactor while keeping tests green

### 3.4 Code Quality Checks
- [ ] **Strict null checks**: Every potentially undefined value is handled
- [ ] **No `any` types**: Use proper types, generics, or `unknown`
- [ ] **Constructor injection**: Dependencies injected, not instantiated
- [ ] **Layer boundaries respected**: No domain imports from infrastructure

### 3.5 Commit
- [ ] Run full test suite
- [ ] Stage changes
- [ ] Commit with conventional format: `feat|fix|refactor: <description>`

**Output**: Task implemented with passing tests

---

## Phase 4: Verify

Confirm implementation meets standards.

### Architecture Compliance
- [ ] Domain layer has zero external dependencies
- [ ] Application layer only imports from domain
- [ ] Infrastructure implements domain interfaces
- [ ] No circular dependencies

### Code Quality
- [ ] All strict null checks pass
- [ ] No `any` types used
- [ ] Explicit return types on public functions
- [ ] Interfaces prefixed with `I`

### Testing
- [ ] Unit tests cover business logic (mocked dependencies)
- [ ] Tests follow AAA pattern (Arrange-Act-Assert)
- [ ] Test names describe behavior
- [ ] Coverage meets project threshold

### Documentation
- [ ] Update execution plan - mark task complete
- [ ] Record any decisions to `.claude/memory/developer.json`
- [ ] Save test output to `.claude/.tmp/evidence/develop/`

**Output**: Verification report confirming standards compliance

---

## Evidence Checklist

| Artifact | Path | Status |
|----------|------|--------|
| Test output | `.claude/.tmp/evidence/develop/test-output.txt` | |
| Coverage report | `.claude/.tmp/evidence/develop/coverage.txt` | |
| Layer compliance | `.claude/.tmp/evidence/develop/architecture-check.txt` | |

---

## Quick Reference

### Layer Rules
```
Domain (core)     → NO external dependencies
Application       → Imports Domain only  
Infrastructure    → Implements Domain interfaces
```

### Null Safety Pattern
```typescript
const user = await userRepository.getById(id);
if (!user) {
  throw new UserNotFoundError(id);  // Handle explicitly
}
return user;  // TypeScript knows this is defined
```

### Dependency Injection Pattern
```typescript
export class OrderService {
  constructor(
    private readonly orderRepo: IOrderRepository,  // Interface, not class
    private readonly logger: ILogger
  ) {}
}
```
