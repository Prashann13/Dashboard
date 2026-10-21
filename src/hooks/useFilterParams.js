import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { DEFAULT_SORT } from '../lib/constants'
import { parseFilters, parsePage, updateSearchParams } from '../lib/filters'
import { scrollToElement } from '../lib/scroll'

export function useFilterParams({ includeGenre = true, resultsRef = null } = {}) {
  const [searchParams, setSearchParams] = useSearchParams()
  const filters = useMemo(() => parseFilters(searchParams), [searchParams])
  const page = parsePage(searchParams)

  const changeFilters = useCallback(
    (nextFilters) => {
      const next = updateSearchParams(searchParams, {
        ...(includeGenre ? { genre: nextFilters.genre } : {}),
        year: nextFilters.year,
        sort: nextFilters.sort === DEFAULT_SORT ? '' : nextFilters.sort,
      })
      if (!includeGenre) next.delete('genre')
      setSearchParams(next)
    },
    [includeGenre, searchParams, setSearchParams],
  )

  const clearFilters = useCallback(() => {
    changeFilters({ genre: '', year: '', sort: DEFAULT_SORT })
  }, [changeFilters])

  const goToPage = useCallback(
    (nextPage) => {
      setSearchParams(
        updateSearchParams(
          searchParams,
          { page: nextPage <= 1 ? '' : nextPage },
          { resetPage: false },
        ),
      )
      scrollToElement(resultsRef?.current)
    },
    [resultsRef, searchParams, setSearchParams],
  )

  return {
    searchParams,
    setSearchParams,
    filters,
    page,
    changeFilters,
    clearFilters,
    goToPage,
  }
}
