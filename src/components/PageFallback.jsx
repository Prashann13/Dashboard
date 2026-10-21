import Container from './Container'
import MovieGrid from './MovieGrid'

export default function PageFallback() {
  return (
    <Container className="py-6 sm:py-8 lg:py-10" aria-busy="true" aria-label="Loading page">
      <div className="skeleton-shimmer h-4 w-24 rounded-full" />
      <div className="skeleton-shimmer mt-4 h-9 w-64 max-w-full rounded-xl" />
      <div className="skeleton-shimmer mt-3 h-4 w-96 max-w-full rounded-full" />
      <div className="mt-8">
        <MovieGrid movies={[]} loading skeletonCount={10} />
      </div>
    </Container>
  )
}
