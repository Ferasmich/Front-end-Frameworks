# CineGrid

EPITA Front-End Frameworks — React 18, TypeScript, Vite and React Router 6.

CineGrid implements the Sessions 1–5 movie project: movie discovery, search, genres, sorting, grid/list view, details, API configuration, persistent watchlist and dark/light themes. Read the [PDF requirement analysis](docs/pdf-project-analysis.md) for the page-by-page requirement mapping and implementation choices.

## Run locally

Use Node.js 22, matching the grading workflows.

```bash
npm ci
cp .env.example .env
npm run dev
```

Open http://localhost:5173. No API key is needed for the sample-data mode.

For live data, click **API Key** on the home page and save your TMDB v3 key or API Read Access Token. Alternatively set `VITE_TMDB_API_KEY` in `.env` and restart Vite. A browser-saved credential takes priority over `.env`. Clearing the browser credential restores the environment credential, or sample mode if it is blank.

## Project structure

```text
src/
  App.tsx                 Provider and routing shell
  pages/                  Home, About and 404 views
  components/             Header, search, filters, statistics, cards and dialogs
  context/                Provider/reducer and shared context definitions
  hooks/                  Movie fetching, genres, context access and modal behavior
  services/               TMDB requests and offline movie filtering/sorting
  utils/                  Safe localStorage helpers
  data/                   Sample movies, fallback genres and image helpers
  test/                   Milestone and feature tests
  types.ts                Movie, Genre and service interfaces
  index.css               Responsive dark/light design system
public/                   Static Vite assets
exercises/                Earlier ES6 exercises
tests/                    ES6 exercise tests
sessions-guide/           Original course checklists
vanilaVersion/            Original vanilla reference
.github/workflows/        Milestone and regression checks
```

Favorites and theme are global context state managed with `useReducer`. Components call `useAppContext` from `src/hooks/useAppContext.ts`. The provider file exports only `AppProvider`, preserving Fast Refresh. Movie fetching uses `useEffect` and `AbortController` cleanup. The reducer stays pure; effects persist changes.

## Checks

```bash
npm run type-check       # Check both TypeScript projects
npm run lint             # ESLint, including Fast Refresh
npm run build            # TypeScript and production bundle
npm run test:run         # All milestone, feature and ES6 tests
npm run test:m1
npm run test:m2
npm run test:m3
```

Earlier milestone fixtures include the provider required by the completed Session 5 architecture. Live API tests use mocked responses and a dummy test credential; they do not require a real key.

## Submission

The workflows use Node.js 22 and explicitly pin Ubuntu 24.04. Milestone 2 runs `test:m2` as required in the PDF; Milestone 3 runs `test:m3`. The separate regression workflow runs the complete suite.

Add the teacher-provided `SHEETS_WEBHOOK_URL` repository secret in GitHub Settings before submitting. Once local checks pass, commit the intended files and push the relevant milestone tag:

```bash
git add .
git commit -m "Complete CineGrid Sessions 1–5"
git tag milestone-3
git push origin HEAD
git push origin milestone-3
```

If that tag already exists, review the course's resubmission procedure before replacing it. Local edits do not update an existing submitted tag or historical Actions annotations.

## Data and behavior

Movies come from TMDB's popular, search or discover endpoint. Genre names come from `/genre/movie/list`; an offline genre map is available when no key is configured or the genre request fails. Local and watchlist filtering needs no network request.

Live pagination uses the API result pages. Sorting and average rating apply to the loaded page. Combining title search with genre filtering filters that search page locally; the API's total still describes the unfiltered search results.

Movie dialogs support keyboard opening, Escape/backdrop closing, a focus trap and focus/scroll restoration. Watchlist changes update cards, modal and header together. This product uses the TMDB API but is not endorsed or certified by TMDB.
