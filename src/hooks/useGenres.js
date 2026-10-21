import { useMemo } from 'react'
import { useTMDB } from './useTMDB'
import { LANGUAGE } from '../lib/constants'

export function useGenres() {
  const { data, loading, error, retry } = useTMDB('/genre/movie/list', { language: LANGUAGE })

  const genres = useMemo(
    () => (Array.isArray(data?.genres) ? data.genres : []),
    [data],
  )

  const genreMap = useMemo(
    () => new Map(genres.map((genre) => [genre.id, genre.name])),
    [genres],
  )

  return { genres, genreMap, loading, error, retry }
}
