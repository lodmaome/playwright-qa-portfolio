# QA Automation Portfolio — Playwright + TypeScript

## What this covers
| Layer | Tools | Location |
|---|---|---|
| UI E2E | Playwright, Page Object Model | `tests/ui/` |
| API | Playwright APIRequestContext, Zod | `tests/api/` |
| Visual Regression | Playwright snapshots | `*-visual.spec.ts` |
| Accessibility | axe-core | `tests/accessibility/` |
| Performance | Web Vitals via evaluate() | `tests/ui/*/performance` |

## Architecture decisions
- **Fixture composition** — fixtures chain from login → inventory → cart → checkout, keeping tests DRY
- **Zod schema validation** — API tests assert contracts, not just status codes
- **Separate auth project** — storageState reuse avoids re-login on every test

## Running tests
\`\`\`bash
cp .env.example .env   # fill in credentials
npm ci
npx playwright install
npx playwright test                    # all tests
npx playwright test --project=api      # API only
npx playwright test --project=e2e      # E2E only
\`\`\`