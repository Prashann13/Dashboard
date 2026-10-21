import { DEFAULT_SORT } from './constants'

const SORT_CONFIG = {
  'popularity.desc': { field: 'popularity', direction: 'desc' },
  'vote_average.desc': { field: 'voteAverage', direction: 'desc' },
  'primary_release_date.desc': { field: 'releaseDate', direction: 'desc' },
  'primary_release_date.asc': { field: 'releaseDate', direction: 'asc' },
}

export function normalizeMovie(raw) {
  const voteAverage = Number(raw?.vote_average)

  return {
    id: raw.id,
    title: raw.title || raw.original_title || 'Untitled',
    overview: typeof raw.overview === 'string' ? raw.overview : '',
    posterPath: raw.poster_path || null,
    backdropPath: raw.backdrop_path || null,
    releaseDate: raw.release_date || '',
    voteAverage: Number.isFinite(voteAverage) ? voteAverage : 0,
    voteCount: Number.isFinite(Number(raw.vote_count)) ? Number(raw.vote_count) : 0,
    popularity: Number.isFinite(Number(raw.popularity)) ? Number(raw.popularity) : 0,
    genreIds: Array.isArray(raw.genre_ids)
      ? raw.genre_ids.map(Number).filter(Number.isFinite)
      : [],
  }
}

export function normalizeMovies(data) {
  if (!Array.isArray(data?.results)) return []
  return data.results.filter((movie) => movie && movie.id != null).map(normalizeMovie)
}

export function compareValues(left, right, field, direction) {
  const leftValue = left[field]
  const rightValue = right[field]
  const leftEmpty = leftValue === '' || leftValue === null || leftValue === undefined
  const rightEmpty = rightValue === '' || rightValue === null || rightValue === undefined

  if (leftEmpty && rightEmpty) return 0
  if (leftEmpty) return 1
  if (rightEmpty) return -1

  const result =
    typeof leftValue === 'string' && typeof rightValue === 'string'
      ? leftValue.localeCompare(rightValue)
      : Number(leftValue) - Number(rightValue)

  if (result === 0) return 0
  const normalized = result < 0 ? -1 : 1
  return direction === 'asc' ? normalized : -normalized
}

export function sortMovies(movies, sortValue) {
  const config = SORT_CONFIG[sortValue] ?? SORT_CONFIG[DEFAULT_SORT]

  return [...movies].sort((left, right) =>
    compareValues(left, right, config.field, config.direction),
  )
}
