import { useEffect, useRef, useState } from 'react'
import { imageUrl } from '../api/tmdb'
import { FilmIcon } from './icons'

const POSTER_WIDTHS = [185, 342, 500, 780, 1280]

export default function PosterImage({
  path,
  title = '',
  size = 'w342',
  sizes = '(max-width: 640px) 45vw, 220px',
  className = '',
}) {
  const src = imageUrl(path, size)
  const imageRef = useRef(null)
  const [status, setStatus] = useState(src ? 'loading' : 'error')

  useEffect(() => {
    setStatus(src ? 'loading' : 'error')
  }, [src])

  useEffect(() => {
    if (status !== 'loading') return
    const image = imageRef.current
    if (!image || !image.complete) return
    setStatus(image.naturalWidth > 0 ? 'loaded' : 'error')
  }, [status])

  if (status === 'error' || !src) {
    return (
      <div
        className={`flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-elevated via-surface to-canvas p-3 text-center ${className}`}
      >
        <FilmIcon className="size-6 text-zinc-600" />
        <span className="line-clamp-3 text-xs font-medium leading-snug text-zinc-500">
          {title || 'Poster unavailable'}
        </span>
      </div>
    )
  }

  const srcSet = POSTER_WIDTHS.map((width) => `${imageUrl(path, `w${width}`)} ${width}w`).join(
    ', ',
  )

  return (
    <div className={`relative h-full w-full overflow-hidden ${className}`}>
      {status === 'loading' ? (
        <div className="skeleton-shimmer absolute inset-0" aria-hidden="true" />
      ) : null}
      <img
        ref={imageRef}
        src={src}
        srcSet={srcSet}
        sizes={sizes}
        alt={`${title} poster`}
        loading="lazy"
        decoding="async"
        onLoad={() => setStatus('loaded')}
        onError={() => setStatus('error')}
        className={`h-full w-full object-cover transition duration-500 group-hover:scale-[1.04] ${
          status === 'loaded' ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  )
}
