# Reelist

A movie dashboard built with React, Vite, and Tailwind. It pulls its catalog from the
[TMDB API](https://developer.themoviedb.org/docs), and keeps your watchlist in `localStorage`.

## Features

- Trending, popular, and top-rated feeds.
- Genre, year, and sort filters. Everything lives in the URL, so links are shareable and the back
  button works.
- Search with a 400 ms debounce and a two-character minimum.
- Pagination up to TMDB's 500-page limit.
- Detail modal with overview, runtime, certification, director, writers, cast, trailer link, and
  similar titles.
- Watchlist that survives a reload and syncs across tabs. It never leaves the browser.
- Skeletons, poster fallbacks, empty and error states, and an error boundary around the app.
- Two columns on phones, six on wide screens.
- Keyboard navigation and a focus trap in the modal. Reduced-motion users get shorter transitions.

## Stack

| Layer   | Choice                       |
| ------- | ---------------------------- |
| UI      | React 19                     |
| Build   | Vite 8                       |
| Styling | Tailwind CSS 4 (Vite plugin) |
| Routing | React Router 7               |
| Tests   | Vitest + Testing Library     |
| Lint    | ESLint 10 (flat config)      |

## Running it

You'll need Node 20.19 or newer.

```bash
npm install
cp .env.example .env.local
```

Grab a free API key from <https://www.themoviedb.org/settings/api>, then put one of these in
`.env.local`:

```dotenv
VITE_TMDB_API_KEY=your_v3_api_key
# or
VITE_TMDB_READ_TOKEN=your_v4_read_access_token
```

```bash
npm run dev
```

It opens on `http://localhost:5173`. If credentials are missing the app shows a setup screen
instead of an empty dashboard.

### Environment variables

| Variable                   | Required | What it does                                                  |
| -------------------------- | -------- | ------------------------------------------------------------- |
| `VITE_TMDB_API_KEY`        | one of   | v3 key, sent as the `api_key` query parameter.                |
| `VITE_TMDB_READ_TOKEN`     | one of   | v4 read token, sent as a Bearer header.                       |
| `VITE_TMDB_API_BASE_URL`   | no       | Overrides the API origin, e.g. for a proxy.                   |
| `VITE_TMDB_IMAGE_BASE_URL` | no       | Overrides the image CDN origin. Defaults to `image.tmdb.org`. |

If both credentials are set, the read token wins.

## Scripts

```bash
npm run dev        # dev server
npm run build      # production build into dist/
npm run preview    # serve the build
npm run lint       # eslint
npm test           # vitest, single run
npm run test:watch # vitest in watch mode
```

## Layout

```text
src/
├── api/tmdb.js                 # fetch wrapper, auth, error mapping, image URLs
├── components/                 # cards, grid, filters, modal, states
├── context/
│   ├── MovieModalContext.js    # modal context and useMovieModal
│   ├── MovieModalProvider.jsx  # selected film state, renders DetailModal
│   ├── WatchlistContext.js
│   └── WatchlistProvider.jsx   # localStorage-backed watchlist
├── hooks/
│   ├── useDebounce.js          # search input delay
│   ├── useFilterParams.js      # URL filter state shared by Home and Genre
│   ├── useGenres.js            # genre list and id-to-name map
│   ├── useMovieFeed.js         # picks the endpoint, normalizes results
│   ├── useTMDB.js              # request hook with cache and aborting
│   └── useWatchlist.js         # context consumer
├── lib/
│   ├── constants.js            # feeds, sort options, years, storage key
│   ├── filters.js              # URL param parsing and writing
│   ├── format.js               # dates, runtimes, ratings, currency, certification
│   ├── movies.js               # normalization and client-side sorting
│   ├── pagination.js           # page list with ellipses, 500 page clamp
│   ├── scroll.js               # reduced-motion-aware scroll helper
│   └── ui.js                   # shared button, select, and link classes
├── pages/                      # Home, Search, Genres, Genre, Watchlist, NotFound
├── test/setup.js               # Testing Library setup
├── App.jsx
├── index.css                   # Tailwind theme tokens and base styles
└── main.jsx
```

## How data flows

Browse state lives in the URL: feed, genre, year, sort, page, and query are all search params.

`useMovieFeed` turns those params into a request:

| Screen          | Endpoint                                                                |
| --------------- | ----------------------------------------------------------------------- |
| Default feeds   | `/trending/movie/week`, `/movie/popular`, `/movie/top_rated`            |
| Filtered browse | `/discover/movie` with `with_genres`, `primary_release_year`, `sort_by` |
| Search          | `/search/movie` with `query`, plus `primary_release_year` when set      |
| Genre page      | `/discover/movie` filtered by `with_genres`                             |
| Details         | `/movie/{id}?append_to_response=credits,videos,release_dates,similar`   |

Everything goes through `normalizeMovie` before a component sees it. Missing posters, ratings,
dates, or overviews get defaults, so `undefined` doesn't leak into the UI.

`useTMDB` caches responses in a module-level map: 5 minute TTL, 120 entries, least-recently-used
eviction. It aborts in-flight requests when the params change and exposes a manual retry. The cache
survives route changes but not a reload.

### Search limitation

TMDB's search endpoint ignores genre and sort. When you filter search results by genre or pick a
non-default sort, that filter is applied to the current page of 20 matches on the client. Year is
sent to TMDB. The UI says so when it applies. Browse and genre pages use `/discover/movie` and
don't have this problem.

## Watchlist storage

The list is stored under `reelist.watchlist.v1` as a JSON array. Each entry keeps what's needed to
render a poster and reopen the detail view, plus an `addedAt` timestamp. Reads are sanitized and
deduplicated. Bad JSON is treated as an empty list instead of crashing the app. Other tabs are
picked up through the `storage` event.

## Accessibility

- Skip link, visible focus rings, labelled inputs and selects.
- The detail dialog uses `role="dialog"` and `aria-modal`, closes on Escape, wraps Tab, locks body
  scroll, and returns focus to the card that opened it.
- Icon-only buttons have names. Watchlist toggles expose `aria-pressed`.
- Smooth scrolling and transitions are disabled under `prefers-reduced-motion`.

## Deployment

`npm run build` writes a static bundle to `dist/`. Routing is client-side, so the host needs an
SPA fallback:

- Netlify: `public/_redirects` already has `/* /index.html 200`.
- Vercel: `vercel.json` rewrites unknown paths to `index.html`.
- Anything else: use the equivalent rewrite.

Set `VITE_TMDB_API_KEY` or `VITE_TMDB_READ_TOKEN` in the host's environment before building. Vite
inlines env vars at build time, so changes need a rebuild.

The v3 key ends up readable in the browser bundle. That's normal for TMDB single-page apps, but
it does mean anyone can pull it out. If that matters for your deployment, point
`VITE_TMDB_API_BASE_URL` at a small proxy that adds the credential server-side.

## Limitations

- TMDB stops at page 500 per list, which is why pagination is capped there.
- Trending, popular, and top-rated only accept `page`. Choosing a sort switches to
  `/discover/movie`.
- No offline mode. Only the watchlist persists.
- No auth or multi-device sync. The watchlist belongs to one browser profile.
- There's no end-to-end browser test suite yet. Interaction coverage is in Vitest/jsdom.

## Attribution

This product uses the TMDB API but is not endorsed or certified by TMDB. Movie metadata and images
belong to TMDB and their respective rights holders.
