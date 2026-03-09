# Security Checks Rule

When reviewing code for security:

## Secrets & Credentials
- [ ] No hardcoded API keys, tokens, or passwords
- [ ] No credentials in URLs
- [ ] Secrets loaded from environment/vault
- [ ] No secrets in logs

## Input Validation
- [ ] All user input is validated
- [ ] Input length limits enforced
- [ ] Type checking on inputs
- [ ] Allowlists preferred over denylists

## Injection Prevention
- [ ] SQL queries use parameterized statements
- [ ] No string concatenation for queries
- [ ] HTML output is escaped (XSS prevention)
- [ ] Command arguments are sanitized

## Authentication & Authorization
- [ ] Auth checks on all protected routes
- [ ] Proper session handling
- [ ] Password handling follows best practices
- [ ] Rate limiting on auth endpoints

## Data Protection
- [ ] Sensitive data encrypted at rest
- [ ] HTTPS enforced for sensitive data
- [ ] PII handled appropriately
- [ ] Proper access controls

## Red Flags
If you see any of these, flag as BLOCKING:
- `eval()` or `exec()` with user input
- SQL string concatenation
- `dangerouslySetInnerHTML` with user data
- Disabled security features
- Hardcoded secrets
