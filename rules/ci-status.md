# CI Status Rule

When interpreting CI status:

## Status Meanings

### ✓ Success
- All checks passed
- Safe to proceed

### ✗ Failure
- Something broke
- Must investigate and fix

### ⏳ Pending
- Still running
- Wait or check for stuck jobs

### ⊘ Skipped
- Intentionally not run
- Usually conditional workflows

## Common CI Failures

### Test Failures
```bash
# Get test logs
gh run view --log-failed
```
- Identify which tests failed
- Check if related to PR changes
- Look for flaky tests

### Lint/Format Failures
- Usually auto-fixable
- Run local lint and push fix

### Build Failures
- Check for missing dependencies
- Type errors
- Compilation issues

### Security Scan Failures
- Review flagged vulnerabilities
- Check if false positive
- Prioritize by severity

## Actionable Output

Always provide:
1. Clear status of each check
2. For failures: what failed and why
3. Suggested fix or next step
4. Commands to run locally to reproduce
