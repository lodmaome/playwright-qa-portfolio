# Contributing

Thanks for looking at this project. The suite is a portfolio, so the bar is that
every change is correct, explained, and verified.

## Before you open a pull request

1. Use Node 22 (pinned in `.nvmrc`) and run `npm ci`.
2. Run the same gates CI runs:
   ```bash
   npm run lint:check
   npm run typecheck
   npx playwright test
   ```
   Tests need the variables in `.env.example`. Fork pull requests do not receive
   repository secrets, so CI cannot run them. Run the suite locally first.
3. If a change affects rendered pages, regenerate baselines only after an intentional
   UI change. Local runs write `-win32` files; CI uses `-linux` files. See the README's
   CI notes.

## Commit messages

New commits follow [Conventional Commits](https://www.conventionalcommits.org):

```
<type>: <short imperative summary>

<optional body: why the change is needed, and how it was verified>
```

Types used in this repo:

| Type | Use it for |
|---|---|
| `feat` | a new test layer, fixture, or capability |
| `fix` | a test, config, or CI change that corrects wrong behaviour |
| `refactor` | a change that keeps behaviour the same |
| `test` | adding or changing test cases without changing shared code |
| `docs` | README and `docs/` changes only |
| `ci` | workflow changes |
| `chore` | dependency updates and housekeeping |

Keep one logical change per commit. Do not stack several types in one subject line.

This convention applies to new commits only. Existing history is not rewritten, so
older commits do not follow it.

## Pull requests

- Describe what changed and why, and name the tests or gates you ran.
- Keep test names specific and self-explanatory, following the naming table in
  `docs/TEST-STRATEGY.md`.
- Do not add `beforeEach` setup to spec files. Extend the nearest fixture instead.
- Do not add a `test.skip` for a known application bug. Use `test.fail` with a comment
  that names the expected behaviour (see `docs/TEST-STRATEGY.md`).
