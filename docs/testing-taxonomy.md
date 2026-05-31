# Testing Taxonomy

Each test file in a repo must clearly fit one of four tiers. Tier choice drives folder, runner, and mocking policy. **Stop mixing test intent, runner choice, and mock strategy.**

## The four tiers

### unit — `tests/unit/`
- One module/class/function in isolation.
- Mocks, fakes, spies are expected for external collaborators.
- No real DB, queue, filesystem, network, SMTP, Redis, or cross-service calls.
- Runner: **Vitest**.
- Rule: if the test uses `vi.mock(...)` or injected mock collaborators to isolate the subject, it is a unit test.

### integration — `tests/integration/`
- A small group of real components together.
- Real infrastructure inside the boundary being validated (real DB, real ORM, real serialization).
- Mocks only dependencies *outside* that boundary.
- Runner: **Vitest**.
- Rule: repository tests must not mock `pg`, `drizzle-orm`, or schema modules. They must run against a disposable real Postgres.

### system — `tests/system/`
- The assembled application/service running with real internal dependencies.
- Validates whole-system behavior: smoke, routing, startup, auth wiring, job execution, API contracts, background workflows.
- Not necessarily a full user journey.
- Runner: **Playwright** (browser-driven smoke) or **Vitest** (HTTP-driven contract checks).
- Rule: no mocks for internal app/service boundaries. External third parties may use controlled test doubles only when unavoidable.

### e2e — `tests/e2e/`
- Real browser-driven end-to-end user journeys.
- Uses the assembled system with real internal dependencies.
- Reserved for high-value journeys only (sign in, forgot/reset password, sign up + provisioning, account flows).
- Runner: **Playwright**.
- Rule: **no `page.route(...)` mocking of the app's own APIs**. If the backend is mocked, it is not E2E — rewrite as a unit/system test or upgrade to a real-stack E2E.

## Folder structure (per workspace)

```
tests/
  fixtures/              # Reusable test data and builders
  mocks/                 # Mocks for unit tests only
  unit/
    domain/
    application/
    infrastructure/
    components/          # React component-style unit tests live here as the suite grows
  integration/
    application/
    infrastructure/
  system/                # apps + services only; packages do not get a system tier
  e2e/                   # apps only
  setup/                 # tier-specific setup files; default tests/setup.ts continues to work
    unit.ts
    integration.ts
    system.ts
```

Notes:
- `components/` is a subfolder under `unit/`, not a fifth tier.
- Keep `mocks/` for unit tests only — integration/system tests should use real collaborators or controlled doubles.
- Prefer `fixtures/` or builders over ad-hoc inline test data.

## Naming

- Vitest: `*.test.ts` or `*.test.tsx`
- Playwright: `*.spec.ts`
- Mirror the source module name where possible.
- Avoid intent-only names like `smoke.spec.ts` or `debug.test.ts` unless that is genuinely the suite purpose.

Examples:
- `src/application/services/AccountService.ts` → `tests/unit/application/services/AccountService.test.ts`
- `src/infrastructure/services/ProvisionJobRepository.ts` → `tests/integration/infrastructure/services/ProvisionJobRepository.test.ts`
- `tests/system/auth-routes.spec.ts`
- `tests/e2e/sign-in.spec.ts`

## Mocking policy

| Tier | Mocks of internal collaborators | Mocks of own backend |
|------|---------------------------------|----------------------|
| unit | Expected | n/a |
| integration | Outside the boundary only — never the persistence stack | n/a |
| system | None for internal boundaries | None |
| e2e | None | **Forbidden** — `page.route(...)` of own APIs disqualifies the test |

External third parties (Stripe, SMTP, etc.) may use controlled test doubles in integration/system/e2e when unavoidable.

## Runner / config

- **Vitest** picks up `tests/unit/**` and `tests/integration/**` only (`vitest.shared.ts` `include` patterns).
- **Playwright** owns `tests/system/**` and `tests/e2e/**`. A separate `playwright.system.config.ts` per app is wired in Phase 2.
- All workspace `vitest.config.ts` files extend `vitest.shared.ts` via `mergeConfig`.

## Per-workspace scripts

Every workspace with a vitest config exposes:

```
test            # Vitest run across unit + integration (default)
test:unit       # Vitest, scoped to tests/unit
test:integration  # Vitest, scoped to tests/integration
test:system     # apps + services only; vitest no-op until Playwright system config lands
test:e2e        # apps only; playwright test
```

Root `package.json` exposes the same set, fanned out via Turbo. CI order: `test:unit` → `test:integration` → `test:system` → `test:e2e`.

## Acceptance criteria for test refactors

- Every test file fits exactly one of unit, integration, system, or e2e.
- No repository test mocks the entire DB stack while claiming "unit" coverage.
- No Playwright test under `e2e/` mocks the app's own backend routes.
- No placeholder `example.test.ts` files committed.
- Root scripts `test:unit` / `test:integration` / `test:system` / `test:e2e` exist and CI stages map to them.
- Folder structure communicates test intent without reading the implementation.
