export const LANGUAGE = 'en-US'
export const PAGE_LIMIT = 500
export const DEFAULT_SORT = 'popularity.desc'
export const MIN_SEARCH_LENGTH = 2

export const FEED_SOURCES = {
  trending: {
    label: 'Trending',
    path: '/trending/movie/week',
    blurb: 'What everyone is watching this week.',
  },
  popular: {
    label: 'Popular',
    path: '/movie/popular',
    blurb: 'The most popular films on TMDB right now.',
  },
  top_rated: {
    label: 'Top rated',
    path: '/movie/top_rated',
    blurb: 'The highest rated films in the catalog.',
  },
}

export const DEFAULT_FEED = 'trending'

export const SORT_OPTIONS = [
  { value: 'popularity.desc', label: 'Most popular' },
  { value: 'vote_average.desc', label: 'Highest rated' },
  { value: 'primary_release_date.desc', label: 'Newest releases' },
  { value: 'primary_release_date.asc', label: 'Oldest releases' },
]

export const WATCHLIST_STORAGE_KEY = 'reelist.watchlist.v1'

const CURRENT_YEAR = new Date().getFullYear()

export const YEARS = Array.from(
  { length: CURRENT_YEAR - 1899 },
  (_, index) => String(CURRENT_YEAR - index),
)
