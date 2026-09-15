# PulseBoard

React 19 + TypeScript + Vite. StyleX for styling, TanStack Router for routing,
react-i18next for copy, Radix for dialog behaviour, Recharts v3 for the chart.
Playwright for tests. There is no Tailwind and no shadcn/ui in this project.

- `npm run dev` — dev server on http://localhost:5173
- `npm test` — acceptance tests (starts their own server on :5174)
- `npm run test:auth` — sign-in tests
- `npm run typecheck` — tsc
- `npm run screenshot` — writes desktop/tablet/mobile PNGs to `screenshots/`

## Sources of truth

| What | Where |
| --- | --- |
| Brief | `SPEC.md` |
| Target UI | `design/*.png` |
| Data | `public/data.json`, types in `src/types.ts` |
| Definition of done | `tests/acceptance.spec.ts` — **never edit**, judges run it as-is |

## Acceptance rules that are easy to break

These come from reading `tests/acceptance.spec.ts`. Violating any one fails a test.

1. **No `console.error` and no page errors on load.** React key warnings, controlled/uncontrolled
   input switches, and failed fetches all fail `page shell loads without console errors`.
   Never leave `console.log`/`console.error` in shipped code.
2. **The table filter matches exactly five fields**: `name`, `owner`, `plan`, `region`, `status`.
   Case-insensitive substring. Do **not** also match email, notes, mrr or seats — the test
   computes expected row counts from those five fields only.
3. **Sort order**: first click on `sort-mrr` sorts **ascending**, second click **descending**.
   Initial table state must be unsorted (source order) so the first click lands ascending.
4. **`cell-mrr` is parsed with `Number(text.replace(/[^0-9.-]/g, ""))`.** The MRR cell may
   contain only the formatted currency — no extra digits, no "/mo" suffix.
5. **The detail drawer is hidden on load**, has `role="dialog"`, and contains the account's
   name, `ownerEmail` and `notes`. Escape closes it as well as `drawer-close`.
6. **KPI cards render in `data.kpis` order.** Card 0 shows `$85,370`; the row contains `3.2%`.
7. **The chart wrapper needs an accessible name** — `aria-label` on `[data-testid="revenue-chart"]`
   (or any descendant), or `role="img"` + `title`.
8. **User form field names are exact**: inputs named `name`, `email`, `team`, and a
   `<select name="role">` whose option values are exactly `Admin`, `Manager`, `Viewer`.
9. **`form-error` must not be in the DOM until a submit fails.** The test asserts it is
   visible only after an invalid save.
10. **New users are created with status `Invited`** and no last login; the row text must show it.
11. **Always `preventDefault()` on form submit** — a native submit reloads the page and wipes state.
12. **Users state lives in `App.tsx`**, above the page switch, so edits survive
    Users → Dashboard → Users navigation.
13. **`users-page` is rendered only on the Users page** (the test asserts it is visible there).

## Formatting

| Kind | Example | Rule |
| --- | --- | --- |
| currency | `$85,370` | `"$" + Math.round(n).toLocaleString("en-US")` — no cents |
| percent | `3.2%` | `(n * 100).toFixed(1) + "%"` |
| delta | `+5.5%` / `-0.4%` | signed, one decimal |
| number / score | `15`, `47` | plain |

Delta colour follows `higherIsBetter`: green when the change is good news, red when it is bad.

## Conventions

- **Routing**: TanStack Router, code-based, whole tree in `src/routes.tsx`. `/` is the
  dashboard and `/users` is Users; the root route renders the header and an `<Outlet/>`.
- **Shared state**: `App.tsx` owns the dataset, the Users edits, the theme and the session
  and publishes them through `src/app-context.ts`. It sits above `RouterProvider`, which is
  what makes edits survive a route change.
- **Styling**: StyleX only. Tokens live in `src/styles/tokens.stylex.ts` (the `.stylex.ts`
  suffix is required by the compiler). Never write a raw hex in a component; add a token.
  Use CSS **longhands** — `backgroundColor`, `borderWidth`, `borderStyle` — because a later
  longhand cannot reliably override an earlier shorthand in StyleX's atomic output.
- **Shared style objects** are in `src/styles/shared.ts`; primitives in `src/components/ui`
  take an `sx` prop rather than `className`.
- **The StyleX compiler resolves `*.stylex.ts` imports itself**, so the `@` alias is declared
  twice in `vite.config.ts`: once in `resolve.alias` for Vite, once in the plugin's `aliases`
  option. Adding an alias to only one of them fails the build.
- **i18n**: copy lives in `src/i18n/en.ts` and `fr.ts`; `fr` is typed against `en`, so a
  missing French key is a type error.
- **Dataset values split in two.** Closed enumerations — KPI label (by id), account and user
  status, plan, role — are translated through `useDataLabel()` in `src/i18n/labels.ts`, whose
  English entries must match `data.json` **exactly** because the acceptance test runs in
  English and matches them literally. Free text (names, emails, teams, notes) and region codes
  (NA/EMEA/APAC/LATAM) pass through untranslated, and `useDataLabel` falls back to the raw
  value so a team a user typed is never mangled.
- The role `<option>` keeps its English `value` and translates only its text: the test's
  `selectOption("Viewer")` matches on the value.
- Currency and percentages stay en-US in both languages — the spec fixes those formats and the
  test parses them. Dates follow the active language.
- **Recharts**: keep the chart wrapper at a fixed height — a zero-height parent makes
  ResponsiveContainer log warnings, which fails rule 1.
- **The role field must stay a native `<select>`**. The test drives it with `selectOption()`,
  which needs a real `<select name="role">`.
- Every `data-testid` in `SPEC.md` is exact. Grep the spec before renaming anything.

## Persistence

Users edits are mirrored to `localStorage` under `pulseboard.users.v1` (the spec's bonus).
Reads and writes are wrapped in try/catch — blocked storage must never break the page or
log to the console. Stored users win over `data.json` on load, so clear that key (or run
`localStorage.clear()` in the console) to get back to the shipped dataset. Playwright gives
each test a fresh context, so the store never leaks between acceptance runs.

## Theming

Light and dark share one token set. `tokens.stylex.ts` holds the light values with a
`prefers-color-scheme: dark` variant on each, so the page is themed before any JavaScript
runs. `src/styles/themes.ts` then builds explicit `lightTheme`/`darkTheme` with
`stylex.createTheme`, and `App.tsx` applies one of them to a wrapper that encloses the login
screen, the router and every portalled dialog.

The toggle also writes `data-theme` on `<html>`, and an inline script in `index.html` replays
the stored choice before first paint to avoid a flash of light.

`src/styles/global.css` starts with `@stylex;` — that is where the compiled atomic CSS is
injected. It also holds the only two things StyleX cannot reach:

- the document element, which repeats the canvas colours literally because StyleX variable
  names are hashed at build time and cannot be referenced from a stylesheet;
- the Recharts axis and grid. Recharts writes colours as presentation attributes, which lose
  to any CSS rule. The tick selector is `.recharts-cartesian-axis-tick-value`: in Recharts v3
  the label text is **not** a descendant of `.recharts-cartesian-axis-tick`, so the obvious
  selector silently leaves the labels at the library default.

## Dialogs

The account detail and the user form are centred modals built on `Modal.tsx`; the delete
confirmation has its own `ConfirmDialog.tsx`. The reference designs draw the first two as
right-hand drawers — the centred treatment is a deliberate departure, not drift.

Their testids are still `detail-drawer` and `drawer-close`: the acceptance test hard-codes
those strings, so the names are historical and say nothing about the layout. Renaming them
fails the suite.

## Authentication

Both pages sit behind a sign-in screen. It is a **mock**: the credential is compared in the
browser and the session is a string in `localStorage` (`pulseboard.session.v1`). It provides
no security at all — anyone can read the credential out of the bundle or write the storage
key by hand. Do not copy this shape into anything real.

- Demo credential: `root` / `root` (shown on the screen itself).
- `VITE_REQUIRE_AUTH=false` disables the gate. It is on in every other case.
- `playwright.config.ts` starts its dev server with that variable set, because
  `acceptance.spec.ts` expects the dashboard immediately on load and cannot be edited.
- `?login=1` forces the login screen even when the gate is off — that is how the login
  screenshot and `tests/auth.spec.ts` reach it.

Tests run their own server on **port 5174** with `reuseExistingServer: false`, so a dev
server on 5173 is never reused and the two cannot interfere. An earlier version shared the
port and reused whatever was running — which meant a dev server started with the gate on sent
all 13 tests to the login screen.

Run `npm run test:auth` for the sign-in tests (not part of the acceptance contract).
