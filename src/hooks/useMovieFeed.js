import { useMemo } from 'react'
import { useTMDB } from './useTMDB'
import {
  DEFAULT_FEED,
  DEFAULT_SORT,
  FEED_SOURCES,
  LANGUAGE,
  MIN_SEARCH_LENGTH,
  PAGE_LIMIT,
} from '../lib/constants'
import { normalizeMovies, sortMovies } from '../lib/movies'

export function useMovieFeed({
  feed = DEFAULT_FEED,
  query = '',
  genre = '',
  year = '',
  sort = DEFAULT_SORT,
  page = 1,
  enabled = true,
} = {}) {
  const pageNumber = Math.min(Math.max(Math.trunc(Number(page)) || 1, 1), PAGE_LIMIT)
  const term = query.trim()
  const isSearch = term.length >= MIN_SEARCH_LENGTH
  const needsDiscover =
    Boolean(genre) || Boolean(year) || sort !== DEFAULT_SORT || !FEED_SOURCES[feed]

  const params = useMemo(() => {
    const next = { page: pageNumber, language: LANGUAGE, include_adult: false }

    if (isSearch) {
      next.query = term
      if (year) next.primary_release_year = year
      return next
    }

    if (needsDiscover) {
      next.sort_by = sort
      if (genre) next.with_genres = genre
      if (year) next.primary_release_year = year
      if (sort === 'vote_average.desc') next['vote_count.gte'] = 100
      return next
    }

    return next
  }, [pageNumber, isSearch, term, year, needsDiscover, sort, genre])

  let path = FEED_SOURCES[feed]?.path ?? null
  if (isSearch) path = '/search/movie'
  else if (needsDiscover) path = '/discover/movie'

  const { data, loading, error, retry } = useTMDB(enabled ? path : null, params, { enabled })

  const movies = useMemo(() => {
    const results = normalizeMovies(data)
    if (!isSearch) return results

    const genreId = Number(genre)
    const filtered =
      genre && Number.isFinite(genreId)
        ? results.filter((movie) => movie.genreIds.includes(genreId))
        : results

    return sortMovies(filtered, sort)
  }, [data, isSearch, genre, sort])

  const totalPages = Math.min(Number(data?.total_pages) || 0, PAGE_LIMIT)
  const totalResults = Number(data?.total_results) || 0

  return {
    movies,
    loading,
    error,
    retry,
    isSearch,
    pageScopedFilters: isSearch && (Boolean(genre) || sort !== DEFAULT_SORT),
    meta: {
      page: pageNumber,
      totalPages,
      totalResults,
    },
  }
}
