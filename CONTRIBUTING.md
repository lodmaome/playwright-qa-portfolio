# Contributing

## Adding a new test

1. Identify the right fixture in `fixtures/`. If none fit, extend
   the nearest one — never use `beforeEach` directly in spec files.
2. Add your Page Object method before writing the test.
3. Run `npx playwright test --project=e2e` locally before pushing.
4. Visual tests: run `--update-snapshots` only after intentional UI changes.

## Naming conventions

- Spec files: `feature-name.spec.ts`
- Page objects: `FeaturePage.ts`
- Fixtures: `feature.fixture.ts`
- Schemas: `resource.schema.ts`