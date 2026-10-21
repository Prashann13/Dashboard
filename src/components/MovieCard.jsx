import { memo } from 'react'
import PosterImage from './PosterImage'
import { HeartIcon, StarIcon } from './icons'
import { formatRating, getYear } from '../lib/format'
import { useWatchlist } from '../hooks/useWatchlist'
import { useMovieModal } from '../context/MovieModalContext'

function MovieCard({ movie }) {
  const { isSaved, toggle } = useWatchlist()
  const { openMovie } = useMovieModal()

  const saved = isSaved(movie.id)
  const year = getYear(movie.releaseDate)
  const rating = formatRating(movie.voteAverage)
  const hasRating = rating !== 'NR'

  return (
    <article className="group relative">
      <button
        type="button"
        onClick={() => openMovie(movie)}
        aria-label={`View details for ${movie.title}`}
        className="absolute inset-0 z-10 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
      />

      <div className="relative overflow-hidden rounded-xl bg-elevated ring-1 ring-line/80 transition duration-300 group-hover:ring-accent/40 group-hover:shadow-[0_20px_45px_-20px_rgba(0,0,0,0.9)]">
        <div className="aspect-[2/3]">
          <PosterImage path={movie.posterPath} title={movie.title} />
        </div>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <span
          className={`pointer-events-none absolute bottom-2.5 left-2.5 inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold backdrop-blur-md ${
            hasRating ? 'bg-black/65 text-amber-200' : 'bg-black/55 text-zinc-400'
          }`}
        >
          <StarIcon className="size-3" />
          {rating}
        </span>

        <button
          type="button"
          onClick={() => toggle(movie)}
          aria-pressed={saved}
          aria-label={
            saved
              ? `Remove ${movie.title} from watchlist`
              : `Add ${movie.title} to watchlist`
          }
          title={saved ? 'Remove from watchlist' : 'Add to watchlist'}
          className={`absolute right-2 top-2 z-20 grid size-8 place-items-center rounded-full ring-1 backdrop-blur-md transition duration-200 ${
            saved
              ? 'bg-accent text-canvas ring-accent'
              : 'bg-black/55 text-zinc-100 ring-white/20 hover:bg-black/80 hover:text-white'
          }`}
        >
          <HeartIcon filled={saved} className="size-4" />
        </button>
      </div>

      <div className="mt-2.5 px-0.5">
        <h3 className="line-clamp-2 text-sm font-medium leading-snug text-zinc-100 transition-colors group-hover:text-accent-strong">
          {movie.title}
        </h3>
        <p className="mt-1 text-xs text-muted">{year || 'Year unknown'}</p>
      </div>
    </article>
  )
}

export default memo(MovieCard)
