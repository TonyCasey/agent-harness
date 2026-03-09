---
name: pr-stop
description: Stop watching a PR
agent: pr-watcher
---

# PR Stop Workflow

Atomic operation to signal pr-watch to stop polling.

## Phase 1: Research

Verify the PR watch should be stopped.

- [ ] Confirm PR number from arguments
- [ ] Check if pr-watch is likely running (optional)

**Output**: PR number confirmed

---

## Phase 2: Plan

Simple operation - create stop signal file.

- [ ] Plan to create `.claude/.pr-watch-stop-{pr_number}`

**Output**: Ready to create signal

---

## Phase 3: Execute

Create stop signal file.

- [ ] Create stop file:
  ```bash
  mkdir -p .claude
  touch .claude/.pr-watch-stop-{pr_number}
  ```

**Output**: Stop signal created

---

## Phase 4: Verify

Confirm signal was created.

- [ ] Verify file exists
- [ ] Output: "Stop signal sent for PR #{pr_number}"
- [ ] Note: pr-watch will exit on next poll cycle (within 120 seconds)
- [ ] The stop file will be removed by pr-watch when it exits

**Output**: Confirmation message

---

## Notes

If pr-watch already stopped, manually remove:
```bash
rm -f .claude/.pr-watch-stop-{pr_number}
```
