# Playwright

End-to-end testing framework for web applications.

## Installation

```bash
# Install Playwright
npm install -D @playwright/test

# Install browsers
npx playwright install
```

## CLI Commands

### Running Tests

```bash
# Run all tests
npx playwright test

# Run specific test file
npx playwright test tests/login.spec.ts

# Run tests with specific name
npx playwright test -g "login flow"

# Run in headed mode (see browser)
npx playwright test --headed

# Run in specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# Run in debug mode
npx playwright test --debug
```

### UI Mode

```bash
# Open interactive UI
npx playwright test --ui
```

### Code Generation

```bash
# Record actions and generate test code
npx playwright codegen https://example.com

# Generate with specific viewport
npx playwright codegen --viewport-size=1280,720 https://example.com

# Generate with device emulation
npx playwright codegen --device="iPhone 13" https://example.com
```

### Trace Viewer

```bash
# Run with trace
npx playwright test --trace on

# View trace
npx playwright show-trace trace.zip
```

### Reports

```bash
# Show HTML report
npx playwright show-report

# Generate specific reporter
npx playwright test --reporter=html
npx playwright test --reporter=list
npx playwright test --reporter=json
```

## Configuration

`playwright.config.ts`:

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  retries: 2,
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
    { name: 'firefox', use: { browserName: 'firefox' } },
    { name: 'webkit', use: { browserName: 'webkit' } },
  ],
});
```

## Useful Flags

| Flag | Description |
|------|-------------|
| `--headed` | Run with visible browser |
| `--debug` | Debug mode with inspector |
| `--ui` | Interactive UI mode |
| `--trace on` | Record trace for debugging |
| `--project=<name>` | Run specific browser project |
| `-g "pattern"` | Run tests matching pattern |
| `--workers=1` | Run tests serially |
| `--repeat-each=3` | Repeat each test N times |

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Browsers not found | `npx playwright install` |
| Timeout errors | Increase timeout in config or test |
| Flaky tests | Add `--retries=2` or use `test.retry(2)` |
| Debug test | Run with `--debug` flag |
| CI failures | Check trace files and screenshots |
