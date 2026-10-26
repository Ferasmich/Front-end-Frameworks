# PDF analysis and project alignment

Source: `ilovepdf_merged.pdf`, 61 pages, supplied on October 5, 2026. All pages were text-extracted and rendered for inspection, including the screenshots. The document is a sequence of teaching stages rather than a single final implementation specification. Several separator pages are blank or almost blank.

## Requirements by session

| PDF pages | Topic | Final project implementation |
| --- | --- | --- |
| 1–2 | ES6 fundamentals: const/let, arrow functions, destructuring, immutable updates, modules, array methods, async/await, optional chaining | Existing exercises 1–9 retained; React code uses typed modules and immutable array updates. |
| 3–17 | Typed Movie props; semantic cards; posters, ratings, year, vote count, genre tags; reusable MovieList and SearchBar; React DevTools | `types.ts`, `MovieCard`, `MovieList`, `SearchBar`. Cards have keyboard access, accessible labels and lazy poster loading. Fixed the year incorrectly labelled as votes. |
| 18–23 | Controlled search state and case-insensitive movie filtering | `HomePage` owns search; `Header` composes the controlled `SearchBar`; local filtering ignores case. |
| 24–28 | Milestone 1 testing and submission | `test:m1` retained. Submission instructions documented; no remote tags, commits or grading submissions performed. |
| 29–35 | Genre map, stateful movie data, service layer and side effects | `data/genres.ts`, `services/movieService.ts`, `utils/storage.ts`, `hooks/useMovies.ts`. |
| 36–41 | Real fetch requests; response errors; custom hook separation | TMDB service handles authentication and HTTP errors. `useMovies` owns loading/error/results and aborts requests when filters change or the component unmounts. |
| 42–44 | Genre interface and live genre hook | `Genre` interface and `useGenres`; fetched names populate the filters, cards and movie modal. Offline names remain available without credentials or if genre fetching fails. |
| 45–47 | Milestone 2 SPA and workflow correction | `/`, `/about`, wildcard route; milestone-02 workflow explicitly runs `npm run test:m2`. |
| 48–54 | Routing shell; lowercase pages directory; full UI shell; runtime API configuration, genres and sorting | `App` contains provider and router only. `pages/HomePage` owns movie/filter state. Separate `Header`, `FilterBar`, `StatsBanner`, `ApiConfigModal`. |
| 55–60 | Movie detail overlay and event propagation | Clicking or pressing Enter/Space on a card opens `MovieModal`. Content clicks keep it open. Backdrop, close button and Escape close it. Focus and scrolling are restored on close. |
| 61 | Context + useReducer; persistent shared theme and favorites | `AppProvider` wraps all routes; `TOGGLE_FAVOURITE` and `SET_THEME` use a pure reducer. Effects persist state through storage utilities. Header, card and modal read the same context. |

## Final behavior

Without a credential, movies and genres come from the existing sample data. Search, genre filtering, sorting, grid/list view, movie details, watchlist and theme work locally. Favorites and theme persist across reloads. A runtime TMDB credential triggers a new movie and genre request. Runtime credentials take priority over the environment credential. Short v3 keys use `api_key`; Read Access Tokens use a Bearer header.

Live requests use `/movie/popular`, `/search/movie`, `/discover/movie`, and `/genre/movie/list`. API pagination is exposed through Previous/Next controls and capped at TMDB's 500-page limit. Local sorting and average ratings apply to the currently loaded page, not the complete TMDB catalog. Search combined with a genre filters the search result page by genre; TMDB's search endpoint does not support `with_genres`, so its total result count remains the API's search total.

A live movie failure is shown to the user with a retry action. A live genre failure retains offline genre names and displays a status message. Credentials remain in the browser's local storage when entered in settings. No real credential was supplied, so authenticated TMDB behavior was tested with mocked responses rather than a user's account.

## Architecture choices

- `.ts` service and utility files follow the TypeScript project even where lecture text uses `.js` filenames.
- `useMovies` remains the reusable fetch hook shown in the PDF, and `HomePage` consumes it.
- `MovieList` and `SearchBar` remain useful components from Session 2, composed by the final UI. They are not unused copies.
- The reducer remains pure. Persistence belongs in effects, avoiding duplicate storage mutations under React Strict Mode.
- The provider, context value and consuming hook use separate files. `AppContext.tsx` exports only a component.
- `src/Pages` was renamed to `src/pages` and recorded in Git for Linux compatibility.
- Existing exercises, course checklists, tests and the vanilla reference remain available. Replacing unrelated learning materials would not improve compliance.
- CSS Modules are an optional bonus in the repository checklist. The final app reuses the reference's existing responsive design system rather than replacing it.

## Warning and notice

The Fast Refresh warning came from exporting a hook and a component from the same `.tsx` file. The context hook now lives in `hooks/useAppContext.ts`; shared context types and the context object live in `context/appContextValue.ts`. ESLint's Fast Refresh rule remains enabled.

The Ubuntu notice concerns GitHub's planned `ubuntu-latest` migration, not a failed application test. Workflows now use `ubuntu-24.04` explicitly, following the mitigation in https://github.com/actions/runner-images/issues/14748. Historical annotations remain attached to their original runs; new workflow runs will use the revised files.

The TypeScript script now checks both project configurations via `tsc -b`, rather than running `tsc --noEmit` on the root configuration that only declares project references. Build caches are ignored. `.env.example` contains a blank credential so copying it does not accidentally enable a fake live API key.

## Verification and limits

The original milestone assertions remain. Earlier component fixtures now mount the provider required by Session 5, imports follow lowercase pages, and Milestone 2 supplies a test credential to actually exercise the mocked live API. Context tests import the hook from its new file. No assertions were removed to make the implementation pass.

Additional tests cover offline and authenticated service routing, encoded search queries, immutable sorting, invalid storage, HTTP errors, dynamic genres, runtime configuration, modal/card/header synchronization, Escape/backdrop behavior, focus restoration, genre/view controls and abort cleanup.

Final local verification: all 194 tests passed across 14 test files; ESLint passed with no warnings; TypeScript and the production build passed. Browser visual review was attempted but was unavailable because macOS Accessibility and Screen Recording permissions were pending. Matching the source CSS and PDF examples does not establish pixel-perfect visual verification. A real TMDB key and a browser review remain appropriate before presentation.
