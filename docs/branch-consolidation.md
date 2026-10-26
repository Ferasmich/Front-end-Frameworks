# Branch consolidation — 26 October 2026

## Analysis and preserved work

The consolidation base is `01` at `2c2ceb8`. Its merge commit already includes
`02` at `fdab976`: `git rev-list --left-right --count 01...02` returned `7 0`.
The seven additional commits preserve the original JavaScript exercises/tests,
assignment history, workflow, favicon and small React integration corrections.
No commits unique to `02` needed another merge; no merge conflicts occurred.
GitHub previously used `01` as its default branch.

The working tree contained staged page renames, modified source/configuration/
workflows/tests and untracked hooks, services, components, utilities, tests and
documentation. All were protected with an include-untracked stash and a verified
full Git bundle at `../Front-end-Frameworks-pre-consolidation.bundle`, then
committed on `main` as `54aeafc`. No new feature or refactoring was added during
consolidation. The pre-existing test edits were preserved, not rewritten to pass:
M1/M2 now wrap isolated consumers in AppProvider; M2 imports lowercase pages and
sets a dummy credential for mocked live requests; M3 imports the extracted hook;
shared setup explicitly cleans up renders. Existing assertions remain intact.

The initial build/type check failed with TS1261 because the macOS directory
retained the spelling `src/Pages` although Git already tracked `src/pages`.
Renaming the directory through a temporary name corrected its on-disk casing.
No source or test changes were needed to fix this failure.

## Validation

- `npm ci`: passed using the existing lockfile.
- `npm run type-check`: passed after the directory casing correction.
- `npm run test:m1`: 30 tests passed.
- `npm run test:m2`: 23 tests passed.
- `npm run test:m3`: 27 tests passed.
- `npm run lint`: passed.
- `npm run test:run`: 194 tests passed across 14 files, including all exercise tests.
- `npm run build`: passed; Vite production assets generated.

Tests cover routing, mocked TMDB search/discovery/authentication/genres/errors,
local filtering/sorting, modal opening/closing/focus, shared favourites, theme,
Context/reducer state and localStorage initialization/persistence. Live TMDB
requests with a real credential and manual browser interaction were not tested.
Local validation used Node 24.21.0 and npm 11.19.0; Actions specify Node 22.

All four Actions workflows remain enabled. Their commands were checked locally;
there are no references to the obsolete development branches. Triggers remain
submission tags, so pushing `main` does not itself start these workflows.
Existing milestone tags are deliberately unchanged; they continue pointing at
historical submissions rather than the new main commit. Google Sheet notification
steps depend on the existing repository secret and were not invoked or verified.

`npm ci` reports 11 dependency vulnerabilities (4 moderate, 5 high, 2 critical)
and deprecated packages. Dependency upgrades were left out of this consolidation
because they may require separate compatibility work.

## Cleanup

Publish `main` and make it the GitHub default before removing `01` and `02`.
Both branch tips and every milestone tag must be ancestors of published `main`.
The pre-cleanup GitHub inspection found no open pull requests, running Actions,
branch protections/rulesets or deployments; the Pages endpoint returned 404.
Workflows contain no old-branch dependencies. No observable active dependency
requires either obsolete branch. The separate teaching `upstream` remote is
preserved and must not be modified.

The verified external bundle retains the original branch refs and exact original
working-tree/index snapshot for recovery independently of branch cleanup.
