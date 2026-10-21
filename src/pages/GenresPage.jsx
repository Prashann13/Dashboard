import { Link } from 'react-router-dom'
import Container from '../components/Container'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'
import PageHeader from '../components/PageHeader'
import { ArrowUpRightIcon, FilmIcon } from '../components/icons'
import { useGenres } from '../hooks/useGenres'

function GenreSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 12 }, (_, index) => (
        <div
          key={`genre-skeleton-${index}`}
          className="skeleton-shimmer h-[104px] rounded-xl ring-1 ring-line/60"
          aria-hidden="true"
        />
      ))}
    </div>
  )
}

export default function GenresPage() {
  const { genres, loading, error, retry } = useGenres()

  return (
    <Container className="py-6 sm:py-8 lg:py-10">
      <PageHeader
        eyebrow="Browse"
        title="Genres"
        description="Pick a corner of the catalog and go from there. Every genre opens a filterable grid."
      />

      {error ? (
        <ErrorState error={error} onRetry={retry} />
      ) : loading ? (
        <GenreSkeleton />
      ) : genres.length === 0 ? (
        <EmptyState
          icon={<FilmIcon className="size-5" />}
          title="No genres available"
          message="TMDB didn't return a genre list. Try again in a moment."
        />
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {genres.map((genre, index) => (
            <li key={genre.id}>
              <Link
                to={`/genres/${genre.id}`}
                className="group relative block overflow-hidden rounded-xl border border-line bg-surface p-4 transition-colors hover:border-accent/40 hover:bg-elevated sm:p-5"
              >
                <span className="text-[11px] font-medium tabular-nums text-zinc-600">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="mt-6 block font-display text-lg font-semibold tracking-tight text-white transition-colors group-hover:text-accent-strong">
                  {genre.name}
                </span>
                <ArrowUpRightIcon className="absolute right-4 top-4 size-4 text-zinc-600 transition-colors group-hover:text-accent" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Container>
  )
}
