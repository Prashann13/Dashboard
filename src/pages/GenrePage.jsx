import { useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import Container from '../components/Container'
import EmptyState from '../components/EmptyState'
import FilterBar from '../components/FilterBar'
import MovieResults from '../components/MovieResults'
import PageHeader from '../components/PageHeader'
import { SearchIcon } from '../components/icons'
import { useFilterParams } from '../hooks/useFilterParams'
import { useGenres } from '../hooks/useGenres'
import { useMovieFeed } from '../hooks/useMovieFeed'
import { formatCount } from '../lib/format'
import { BUTTON_SECONDARY } from '../lib/ui'

export default function GenrePage() {
  const { genreId: genreParam } = useParams()
  const resultsRef = useRef(null)
  const { filters, page, changeFilters, clearFilters, goToPage } = useFilterParams({
    includeGenre: false,
    resultsRef,
  })

  const genreId = Number(genreParam)
  const validGenreId = Number.isInteger(genreId) && genreId > 0

  const { genres, genreMap, loading: genresLoading, error: genresError } = useGenres()
  const genreName = validGenreId ? genreMap.get(genreId) : null

  const { movies, loading, error, retry, meta } = useMovieFeed({
    genre: validGenreId ? String(genreId) : '',
    year: filters.year,
    sort: filters.sort,
    page,
    enabled: validGenreId,
  })

  const genreMissing =
    !validGenreId ||
    (!genresLoading && !genresError && genres.length > 0 && !genreName)

  if (genreMissing) {
    return (
      <Container className="py-6 sm:py-8 lg:py-10">
        <PageHeader
          eyebrow="Genre"
          title="That genre isn't in the catalog"
          description="The link may be old, or the genre id doesn't match anything TMDB knows about."
        />
        <EmptyState
          icon={<SearchIcon className="size-5" />}
          title="Nothing to explore here"
          message="Head back to the genre list and pick a different corner of the catalog."
          action={
            <Link to="/genres" className={BUTTON_SECONDARY}>
              Browse all genres
            </Link>
          }
        />
      </Container>
    )
  }

  const displayName = genreName ?? 'Genre'

  return (
    <Container className="py-6 sm:py-8 lg:py-10">
      <PageHeader
        eyebrow="Genre"
        title={displayName}
        description={`Browse films in ${displayName}. Filter by year or change the sort order.`}
      />

      {genres.length > 0 ? (
        <nav
          aria-label="All genres"
          className="-mx-4 mb-6 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0"
        >
          {genres.map((genre) => {
            const active = genre.id === genreId
            return (
              <Link
                key={genre.id}
                to={`/genres/${genre.id}`}
                aria-current={active ? 'page' : undefined}
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium ring-1 transition-colors ${
                  active
                    ? 'bg-accent text-canvas ring-accent'
                    : 'bg-surface text-zinc-400 ring-line hover:text-white hover:ring-zinc-600'
                }`}
              >
                {genre.name}
              </Link>
            )
          })}
        </nav>
      ) : null}

      <FilterBar
        genres={genres}
        filters={filters}
        onChange={changeFilters}
        showGenre={false}
      />

      <section ref={resultsRef} className="mt-6 scroll-mt-28" aria-labelledby="genre-heading">
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
          <h2
            id="genre-heading"
            className="font-display text-xl font-semibold tracking-tight text-white"
          >
            {displayName} films
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
              title="No films match this corner"
              message="Try a different year, or clear the filters to see everything in this genre."
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
