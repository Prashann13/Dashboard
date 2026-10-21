import ErrorState from './ErrorState'
import MovieGrid from './MovieGrid'
import Pagination from './Pagination'

export default function MovieResults({
  movies,
  loading = false,
  error = null,
  onRetry,
  empty = null,
  skeletonCount = 12,
  pagination = null,
}) {
  if (error) return <ErrorState error={error} onRetry={onRetry} />
  if (loading) return <MovieGrid movies={[]} loading skeletonCount={skeletonCount} />
  if (movies.length === 0) return empty

  return (
    <>
      <MovieGrid movies={movies} />
      {pagination ? <Pagination {...pagination} /> : null}
    </>
  )
}
