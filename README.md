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

TMDB's search endpoint ignores genre and sort. When filtering search results by genre or picking a
non-default sort, that filter is applied to the current page of 20 matches on the client. Year is
sent to TMDB. The UI says so when it applies. Browse and genre pages use `/discover/movie` and
don't have this problem.

## Watchlist storage

The list is stored under `reelist.watchlist.v1` as a JSON array. Each entry keeps what's needed to
render a poster and reopen the detail view, plus an `addedAt` timestamp. 

## Limitations

- TMDB stops at page 500 per list.
- Trending, popular, and top-rated only accept `page`. Choosing a sort switches to
  `/discover/movie`.
- No offline mode. Only the watchlist persists.
- No auth or multi-device sync. The watchlist belongs to one browser profile.

