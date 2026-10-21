import { useRef } from 'react'
import Container from '../components/Container'
import EmptyState from '../components/EmptyState'
import FilterBar from '../components/FilterBar'
import MovieResults from '../components/MovieResults'
import PageHeader from '../components/PageHeader'
import { SearchIcon } from '../components/icons'
import { useFilterParams } from '../hooks/useFilterParams'
import { useGenres } from '../hooks/useGenres'
import { useMovieFeed } from '../hooks/useMovieFeed'
import { MIN_SEARCH_LENGTH } from '../lib/constants'
import { formatCount } from '../lib/format'
import { BUTTON_SECONDARY } from '../lib/ui'

export default function SearchPage() {
  const resultsRef = useRef(null)
  const { searchParams, filters, page, changeFilters, clearFilters, goToPage } =
    useFilterParams({ resultsRef })

  const query = (searchParams.get('q') ?? '').trim()
  const queryActive = query.length >= MIN_SEARCH_LENGTH

  const { genres } = useGenres()
  const { movies, loading, error, retry, meta, pageScopedFilters } = useMovieFeed({
    query,
    ...filters,
    page,
    enabled: queryActive,
  })
  const suggestions = useMovieFeed({ feed: 'trending', page: 1, enabled: !queryActive })

  let title = 'Search the catalog'
  let description = 'Search by film title. Results update as you type.'

  if (query.length === 1) {
    title = 'Keep typing'
    description = 'Search starts after two characters. Meanwhile, here’s what’s trending.'
  } else if (queryActive) {
    title = `Results for “${query}”`
    description = 'Narrow the results by year, genre, or sort order.'
  }

  return (
    <Container className="py-6 sm:py-8 lg:py-10">
      <PageHeader eyebrow="Search" title={title} description={description} />

      {queryActive ? (
        <>
          <FilterBar genres={genres} filters={filters} onChange={changeFilters} />
          {pageScopedFilters ? (
            <p className="mt-3 text-xs text-muted">
              Genre and sort filters apply to the current page of search results.
            </p>
          ) : null}

          <section ref={resultsRef} className="mt-6 scroll-mt-28" aria-labelledby="search-heading">
            <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
              <h2
                id="search-heading"
                className="font-display text-xl font-semibold tracking-tight text-white"
              >
                {loading
                  ? 'Searching…'
                  : `${formatCount(meta.totalResults)} ${
                      meta.totalResults === 1 ? 'match' : 'matches'
                    }`}
              </h2>
              {!loading && !error && pageScopedFilters ? (
                <p className="text-xs text-muted">{movies.length} on this page</p>
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
                  title={pageScopedFilters ? 'Nothing on this page matches' : 'No films found'}
                  message={
                    pageScopedFilters
                      ? 'The current page of results has no films for that genre. Try another page or clear the filters.'
                      : 'Check the spelling or try a shorter, more general title.'
                  }
                  action={
                    pageScopedFilters ? (
                      <button type="button" onClick={clearFilters} className={BUTTON_SECONDARY}>
                        Clear filters
                      </button>
                    ) : null
                  }
                />
              }
              pagination={{ page: meta.page, totalPages: meta.totalPages, onChange: goToPage }}
            />
          </section>
        </>
      ) : (
        <div className="space-y-10">
          <div className="flex items-start gap-3 rounded-2xl border border-line bg-surface/70 px-5 py-5">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-elevated text-accent ring-1 ring-line">
              <SearchIcon className="size-4" />
            </span>
            <div>
              <p className="text-sm font-medium text-white">
                {query.length === 1 ? 'One more character to go' : 'Start typing to search'}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-muted">
                {query.length === 1
                  ? 'Search needs at least two characters.'
                  : 'Try a title like “Arrival”, “Spirited Away”, or “Heat”. The field at the top works from every page.'}
              </p>
            </div>
          </div>

          <section aria-labelledby="trending-heading">
            <h2
              id="trending-heading"
              className="mb-4 font-display text-xl font-semibold tracking-tight text-white"
            >
              Trending while you search
            </h2>
            <MovieResults
              movies={suggestions.movies}
              loading={suggestions.loading}
              error={suggestions.error}
              onRetry={suggestions.retry}
              skeletonCount={6}
            />
          </section>
        </div>
      )}
    </Container>
  )
}
