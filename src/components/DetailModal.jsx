import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { imageUrl } from '../api/tmdb'
import { useTMDB } from '../hooks/useTMDB'
import { useWatchlist } from '../hooks/useWatchlist'
import { LANGUAGE } from '../lib/constants'
import {
  formatCount,
  formatDate,
  formatRating,
  formatRuntime,
  getCertification,
  getYear,
} from '../lib/format'
import { normalizeMovie } from '../lib/movies'
import { BUTTON_SECONDARY } from '../lib/ui'
import PosterImage from './PosterImage'
import ErrorState from './ErrorState'
import { HeartIcon, PlayIcon, StarIcon, XIcon } from './icons'

const APPEND_PARAMS = 'credits,videos,release_dates,similar'
const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

function findTrailer(videos) {
  if (!Array.isArray(videos)) return null
  const youtubeVideos = videos.filter((video) => video?.site === 'YouTube' && video?.key)
  return (
    youtubeVideos.find((video) => video.type === 'Trailer' && video.official) ??
    youtubeVideos.find((video) => video.type === 'Trailer') ??
    youtubeVideos.find((video) => video.type === 'Teaser') ??
    null
  )
}

function getWriters(crew) {
  if (!Array.isArray(crew)) return []
  const writers = crew
    .filter((person) => person.job === 'Screenplay' || person.job === 'Writer')
    .map((person) => person.name)
  return [...new Set(writers)].slice(0, 3)
}

function DetailSkeleton() {
  return (
    <div className="space-y-3" aria-hidden="true">
      <div className="skeleton-shimmer h-3 w-24 rounded-full" />
      <div className="skeleton-shimmer h-3 w-full rounded-full" />
      <div className="skeleton-shimmer h-3 w-11/12 rounded-full" />
      <div className="skeleton-shimmer h-3 w-4/5 rounded-full" />
      <div className="skeleton-shimmer mt-6 h-3 w-20 rounded-full" />
      <div className="skeleton-shimmer h-3 w-2/3 rounded-full" />
    </div>
  )
}

export default function DetailModal({ movie, onClose, onOpenMovie }) {
  const panelRef = useRef(null)
  const scrollRef = useRef(null)
  const movieId = movie?.id ?? null
  const isOpen = movieId != null

  const { data, loading, error, retry } = useTMDB(
    isOpen ? `/movie/${movieId}` : null,
    { language: LANGUAGE, append_to_response: APPEND_PARAMS },
    { enabled: isOpen },
  )
  const { isSaved, toggle } = useWatchlist()

  useEffect(() => {
    if (!isOpen) return undefined

    const previouslyFocused = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key !== 'Tab' || !panelRef.current) return

      const focusable = panelRef.current.querySelectorAll(FOCUSABLE_SELECTOR)
      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const active = document.activeElement

      if (event.shiftKey && (active === first || active === panelRef.current)) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus()
    }
  }, [isOpen, onClose])

  useEffect(() => {
    if (!isOpen) return
    if (scrollRef.current) scrollRef.current.scrollTop = 0
    panelRef.current?.focus()
  }, [isOpen, movieId])

  if (!isOpen) return null

  const details = data && data.id === movieId ? data : null
  const title = details?.title || movie.title || 'Movie details'
  const releaseDate = details?.release_date ?? movie.releaseDate ?? ''
  const posterPath = details?.poster_path ?? movie.posterPath ?? null
  const backdropPath = details?.backdrop_path ?? movie.backdropPath ?? null
  const voteAverage = details?.vote_average ?? movie.voteAverage
  const rating = formatRating(voteAverage)
  const voteCount = details?.vote_count ?? movie.voteCount ?? 0
  const runtime = formatRuntime(details?.runtime)
  const certification = getCertification(details?.release_dates)
  const year = getYear(releaseDate)
  const genres = Array.isArray(details?.genres) ? details.genres : []
  const credits = details?.credits
  const directors = (credits?.crew ?? [])
    .filter((person) => person.job === 'Director')
    .map((person) => person.name)
  const writers = getWriters(credits?.crew)
  const cast = (credits?.cast ?? []).slice(0, 6).map((person) => person.name)
  const trailer = findTrailer(details?.videos?.results)
  const similar = Array.isArray(details?.similar?.results)
    ? details.similar.results.filter((item) => item?.id).slice(0, 6)
    : []
  const overview = details?.overview?.trim() || movie.overview?.trim() || ''
  const saved = isSaved(movieId)

  const toggleWatchlist = () => {
    toggle({
      id: movieId,
      title,
      posterPath,
      backdropPath,
      releaseDate,
      voteAverage: Number(voteAverage) || 0,
      genreIds: genres.length ? genres.map((genre) => genre.id) : movie.genreIds,
    })
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
      <div
        className="animate-fade-in absolute inset-0 bg-black/75 backdrop-blur-[3px]"
        onClick={onClose}
        role="presentation"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="movie-dialog-title"
        tabIndex={-1}
        className="animate-modal-in relative z-10 flex max-h-[92dvh] w-full max-w-4xl flex-col overflow-hidden rounded-t-3xl border border-line bg-surface shadow-2xl outline-none sm:max-h-[90vh] sm:rounded-3xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close movie details"
          className="absolute right-3 top-3 z-30 grid size-9 place-items-center rounded-full bg-black/60 text-zinc-200 ring-1 ring-white/15 backdrop-blur transition-colors hover:bg-black/80 hover:text-white"
        >
          <XIcon className="size-4" />
        </button>

        <div ref={scrollRef} className="overflow-y-auto overscroll-contain">
          <div className="relative">
            <div className="absolute inset-x-0 top-0 h-64 overflow-hidden sm:h-72">
              {backdropPath ? (
                <img
                  src={imageUrl(backdropPath, 'w780')}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover opacity-40"
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-elevated to-canvas" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/80 to-surface/10" />
            </div>

            <div className="relative px-5 pb-8 pt-20 sm:px-8 sm:pt-32">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
                <div className="w-28 shrink-0 overflow-hidden rounded-xl bg-elevated shadow-2xl ring-1 ring-white/10 sm:w-40">
                  <div className="aspect-[2/3]">
                    <PosterImage path={posterPath} title={title} size="w500" sizes="160px" />
                  </div>
                </div>

                <div className="min-w-0 flex-1 pb-1">
                  <h2
                    id="movie-dialog-title"
                    className="font-display text-2xl font-semibold leading-tight tracking-tight text-white sm:text-3xl"
                  >
                    {title}
                  </h2>
                  {details?.tagline ? (
                    <p className="mt-1 text-sm italic text-zinc-500">{details.tagline}</p>
                  ) : null}

                  <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-zinc-400">
                    {releaseDate ? <span>{formatDate(releaseDate) || year}</span> : null}
                    {certification ? (
                      <span className="rounded border border-zinc-600 px-1.5 py-0.5 text-[11px] font-semibold text-zinc-300">
                        {certification}
                      </span>
                    ) : null}
                    {runtime ? <span>{runtime}</span> : null}
                    <span
                      className="inline-flex items-center gap-1 text-amber-200"
                      aria-label={`Rated ${rating} out of 10 on TMDB`}
                    >
                      <StarIcon className="size-3.5" />
                      {rating}
                      <span className="text-zinc-500">/10</span>
                    </span>
                    {voteCount > 0 ? (
                      <span className="text-xs text-zinc-500">{formatCount(voteCount)} votes</span>
                    ) : null}
                  </div>

                  {genres.length > 0 ? (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {genres.map((genre) => (
                        <span
                          key={genre.id}
                          className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-zinc-300 ring-1 ring-line"
                        >
                          {genre.name}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  <div className="mt-5 flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={toggleWatchlist}
                      aria-pressed={saved}
                      className={`inline-flex items-center gap-2 ${
                        saved
                          ? 'rounded-lg bg-accent px-4 py-2 text-sm font-medium text-canvas transition-colors hover:bg-accent-strong'
                          : BUTTON_SECONDARY
                      }`}
                    >
                      <HeartIcon filled={saved} className="size-4" />
                      {saved ? 'In watchlist' : 'Add to watchlist'}
                    </button>

                    {trailer ? (
                      <a
                        href={`https://www.youtube.com/watch?v=${trailer.key}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-2 ${BUTTON_SECONDARY}`}
                      >
                        <PlayIcon className="size-4" />
                        Watch trailer
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="mt-8">
                {error ? (
                  <ErrorState error={error} onRetry={retry} compact />
                ) : loading && !details ? (
                  <div className="space-y-4">
                    <div className="skeleton-shimmer h-3 w-20 rounded-full" />
                    <DetailSkeleton />
                  </div>
                ) : (
                  <div className="space-y-8">
                    <section>
                      <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                        Overview
                      </h3>
                      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-zinc-300">
                        {overview || 'No overview is available for this title yet.'}
                      </p>
                    </section>

                    {directors.length > 0 || writers.length > 0 || cast.length > 0 ? (
                      <section className="grid gap-6 border-t border-line/80 pt-6 sm:grid-cols-2">
                        {directors.length > 0 ? (
                          <div>
                            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                              Director
                            </h3>
                            <p className="mt-1.5 text-sm text-zinc-300">{directors.join(', ')}</p>
                          </div>
                        ) : null}
                        {writers.length > 0 ? (
                          <div>
                            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                              Written by
                            </h3>
                            <p className="mt-1.5 text-sm text-zinc-300">{writers.join(', ')}</p>
                          </div>
                        ) : null}
                        {cast.length > 0 ? (
                          <div className="sm:col-span-2">
                            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                              Cast
                            </h3>
                            <p className="mt-1.5 text-sm text-zinc-300">{cast.join(', ')}</p>
                          </div>
                        ) : null}
                      </section>
                    ) : null}

                    {similar.length > 0 ? (
                      <section className="border-t border-line/80 pt-6">
                        <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                          More like this
                        </h3>
                        <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-6">
                          {similar.map((item) => (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => onOpenMovie?.(normalizeMovie(item))}
                              className="group text-left"
                            >
                              <div className="overflow-hidden rounded-lg bg-elevated ring-1 ring-line transition group-hover:ring-accent/50">
                                <div className="aspect-[2/3]">
                                  <PosterImage
                                    path={item.poster_path}
                                    title={item.title}
                                    size="w185"
                                    sizes="120px"
                                  />
                                </div>
                              </div>
                              <span className="mt-1.5 line-clamp-2 text-xs leading-snug text-zinc-400 transition-colors group-hover:text-zinc-200">
                                {item.title}
                              </span>
                            </button>
                          ))}
                        </div>
                      </section>
                    ) : null}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
