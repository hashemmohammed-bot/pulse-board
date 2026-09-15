# PulseBoard

React 19 + TypeScript + Vite. Tailwind CSS v4. Recharts v3. Playwright for tests.

- `npm run dev` — dev server on http://localhost:5173
- `npm test` — acceptance tests (starts the dev server if needed)
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

- No router. `App.tsx` holds `page: "dashboard" | "users"` in `useState`.
- Tailwind v4: `@import "tailwindcss"` in `src/styles.css`, `@theme` for tokens. There is no
  `tailwind.config.js` in v4.
- Recharts v3: pass `responsive` on the chart component instead of wrapping in
  `ResponsiveContainer`, and give the wrapper a fixed height — a zero-height parent makes
  Recharts log warnings, which fails rule 1.
- Every `data-testid` in `SPEC.md` is exact. Grep the spec before renaming anything.

## Persistence

Users edits are mirrored to `localStorage` under `pulseboard.users.v1` (the spec's bonus).
Reads and writes are wrapped in try/catch — blocked storage must never break the page or
log to the console. Stored users win over `data.json` on load, so clear that key (or run
`localStorage.clear()` in the console) to get back to the shipped dataset. Playwright gives
each test a fresh context, so the store never leaks between acceptance runs.

## Theming

Light and dark share one token set. `@theme` in `src/styles.css` defines the light values;
the dark block redefines the same `--color-*` variables, so components need no `dark:`
variants — they already paint with tokens. Add new colours as tokens, never as hex in a
component.

The theme follows `prefers-color-scheme` until the visitor clicks the toggle, which writes
`data-theme` on `<html>` and stores the choice under `pulseboard.theme.v1`. An inline script
in `index.html` replays that choice before first paint to avoid a flash of light.

Recharts writes colours as presentation attributes, which lose to CSS, so the axis ticks
(`.recharts-cartesian-axis-tick-value` — note v3 does *not* nest the text inside
`.recharts-cartesian-axis-tick`) and grid lines are themed from `styles.css`. Tooltip styling
is inline and uses `var(--color-*)`, which resolves correctly in inline styles.
