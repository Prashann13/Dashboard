import { useCallback, useRef } from 'react'
import Container from '../components/Container'
import EmptyState from '../components/EmptyState'
import FilterBar from '../components/FilterBar'
import MovieResults from '../components/MovieResults'
import { SearchIcon } from '../components/icons'
import { useFilterParams } from '../hooks/useFilterParams'
import { useGenres } from '../hooks/useGenres'
import { useMovieFeed } from '../hooks/useMovieFeed'
import { DEFAULT_FEED, FEED_SOURCES } from '../lib/constants'
import { hasActiveFilters } from '../lib/filters'
import { formatCount } from '../lib/format'
import { BUTTON_SECONDARY } from '../lib/ui'

export default function HomePage() {
  const resultsRef = useRef(null)
  const { searchParams, setSearchParams, filters, page, changeFilters, clearFilters, goToPage } =
    useFilterParams({ resultsRef })

  const requestedFeed = searchParams.get('feed')
  const feed = FEED_SOURCES[requestedFeed] ? requestedFeed : DEFAULT_FEED
  const filtered = hasActiveFilters(filters)

  const { genres } = useGenres()
  const { movies, loading, error, retry, meta } = useMovieFeed({ feed, ...filters, page })

  const changeFeed = useCallback(
    (nextFeed) => {
      const next = new URLSearchParams()
      if (nextFeed !== DEFAULT_FEED) next.set('feed', nextFeed)
      setSearchParams(next)
    },
    [setSearchParams],
  )

  const activeSource = FEED_SOURCES[feed]

  return (
    <Container className="py-6 sm:py-8 lg:py-10">
      <section className="relative mb-8 overflow-hidden rounded-2xl border border-line bg-gradient-to-br from-surface to-canvas px-5 py-8 sm:px-8 sm:py-10">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(36rem_18rem_at_85%_-10%,rgba(229,180,90,0.12),transparent_70%)]"
        />
        <div className="relative max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
            Now showing
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
            What are we watching tonight?
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
            Browse thousands of films, narrow them down by genre and year, and keep the ones that
            look good in a watchlist that stays in this browser.
          </p>
        </div>
      </section>

      <section aria-label="Browse feeds" className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {Object.entries(FEED_SOURCES).map(([key, source]) => {
              const active = key === feed
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => changeFeed(key)}
                  aria-pressed={active}
                  className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                    active
                      ? 'bg-accent text-canvas'
                      : 'bg-elevated text-zinc-300 ring-1 ring-line hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {source.label}
                </button>
              )
            })}
          </div>
          <p className="text-xs text-muted">
            {filtered ? 'Filtering the full catalog' : activeSource.blurb}
          </p>
        </div>

        <FilterBar
          className="mt-4"
          genres={genres}
          filters={filters}
          onChange={changeFilters}
        />
      </section>

      <section ref={resultsRef} className="scroll-mt-28" aria-labelledby="browse-heading">
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
          <h2
            id="browse-heading"
            className="font-display text-xl font-semibold tracking-tight text-white"
          >
            {filtered ? 'Filtered films' : activeSource.label}
          </h2>
          {!loading && !error && meta.totalResults > 0 ? (
            <p className="text-xs text-muted">
              {formatCount(meta.totalResults)} {meta.totalResults === 1 ? 'title' : 'titles'}
            </p>
          ) : null}
        </div>

        <MovieResults
          movies={movies}
          loading={loading}
          error={error}
          onRetry={retry}
          empty={
            <EmptyState
              icon={<SearchIcon className="size-5" />}
              title="No films match these filters"
              message="Try a different genre or year, or clear the filters to see the full feed again."
              action={
                <button type="button" onClick={clearFilters} className={BUTTON_SECONDARY}>
                  Clear filters
                </button>
              }
            />
          }
          pagination={{ page: meta.page, totalPages: meta.totalPages, onChange: goToPage }}
        />
      </section>
    </Container>
  )
}
