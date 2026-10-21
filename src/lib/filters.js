import { DEFAULT_SORT, SORT_OPTIONS } from './constants'

const SORT_VALUES = new Set(SORT_OPTIONS.map((option) => option.value))
const GENRE_PATTERN = /^\d{1,6}$/
const YEAR_PATTERN = /^\d{4}$/

export function parseFilters(searchParams) {
  const genre = searchParams.get('genre') ?? ''
  const year = searchParams.get('year') ?? ''
  const sort = searchParams.get('sort') ?? ''

  return {
    genre: GENRE_PATTERN.test(genre) ? genre : '',
    year: YEAR_PATTERN.test(year) ? year : '',
    sort: SORT_VALUES.has(sort) ? sort : DEFAULT_SORT,
  }
}

export function parsePage(searchParams) {
  const page = Number.parseInt(searchParams.get('page') ?? '1', 10)
  return Number.isInteger(page) && page > 0 ? page : 1
}

export function hasActiveFilters(filters) {
  return Boolean(filters.genre) || Boolean(filters.year) || filters.sort !== DEFAULT_SORT
}

export function updateSearchParams(current, updates, { resetPage = true } = {}) {
  const next = new URLSearchParams(current)

  Object.entries(updates).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      next.delete(key)
    } else {
      next.set(key, String(value))
    }
  })

  if (resetPage) {
    next.delete('page')
  }

  return next
}
