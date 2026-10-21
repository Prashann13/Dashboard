import MovieCard from './MovieCard'
import SkeletonCard from './SkeletonCard'

const GRID_CLASSES =
  'grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6'

export default function MovieGrid({ movies, loading = false, skeletonCount = 12 }) {
  if (loading) {
    return (
      <div className={GRID_CLASSES} aria-busy="true" aria-label="Loading movies">
        {Array.from({ length: skeletonCount }, (_, index) => (
          <SkeletonCard key={`skeleton-${index}`} />
        ))}
      </div>
    )
  }

  return (
    <ul className={`${GRID_CLASSES} list-none`}>
      {movies.map((movie) => (
        <li key={movie.id}>
          <MovieCard movie={movie} />
        </li>
      ))}
    </ul>
  )
}
