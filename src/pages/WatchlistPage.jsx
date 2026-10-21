import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Container from '../components/Container'
import EmptyState from '../components/EmptyState'
import MovieGrid from '../components/MovieGrid'
import PageHeader from '../components/PageHeader'
import { ChevronDownIcon, FilmIcon, TrashIcon } from '../components/icons'
import { useWatchlist } from '../hooks/useWatchlist'
import { compareValues } from '../lib/movies'
import { BUTTON_PRIMARY, SELECT_CLASSES } from '../lib/ui'

const SORT_OPTIONS = [
  { value: 'recent', label: 'Recently added' },
  { value: 'rating', label: 'Highest rated' },
  { value: 'year', label: 'Newest release' },
  { value: 'title', label: 'Title A–Z' },
]

const SORT_CONFIG = {
  recent: { field: 'addedAt', direction: 'desc' },
  rating: { field: 'voteAverage', direction: 'desc' },
  year: { field: 'releaseDate', direction: 'desc' },
  title: { field: 'title', direction: 'asc' },
}

function sortItems(items, sort) {
  const { field, direction } = SORT_CONFIG[sort] ?? SORT_CONFIG.recent
  return [...items].sort((left, right) => compareValues(left, right, field, direction))
}

export default function WatchlistPage() {
  const { items, clear } = useWatchlist()
  const [sort, setSort] = useState('recent')
  const [confirmClear, setConfirmClear] = useState(false)

  const sortedItems = useMemo(() => sortItems(items, sort), [items, sort])
  const count = items.length

  const description =
    count === 0
      ? 'Save films from anywhere in the catalog. Your list stays in this browser — no account needed.'
      : `${count} ${count === 1 ? 'film' : 'films'} saved in this browser. Tap the heart on any cover to remove it.`

  return (
    <Container className="py-6 sm:py-8 lg:py-10">
      <PageHeader
        eyebrow="Your list"
        title="Watchlist"
        description={description}
        actions={
          count > 0 ? (
            <>
              <div className="relative">
                <label htmlFor="watchlist-sort" className="sr-only">
                  Sort watchlist
                </label>
                <select
                  id="watchlist-sort"
                  value={sort}
                  onChange={(event) => setSort(event.target.value)}
                  className={SELECT_CLASSES}
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-muted" />
              </div>

              <button
                type="button"
                onClick={() => setConfirmClear(true)}
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-zinc-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
              >
                <TrashIcon className="size-4" />
                Clear
              </button>
            </>
          ) : null
        }
      />

      {confirmClear ? (
        <div
          role="alert"
          className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-500/25 bg-red-500/5 px-4 py-3"
        >
          <p className="text-sm text-zinc-300">
            Remove all {count} saved {count === 1 ? 'film' : 'films'}? This can&apos;t be undone.
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setConfirmClear(false)}
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-300 transition-colors hover:bg-white/5 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                clear()
                setConfirmClear(false)
              }}
              className="rounded-lg bg-red-500/15 px-3 py-1.5 text-sm font-semibold text-red-300 ring-1 ring-red-500/30 transition-colors hover:bg-red-500/25"
            >
              Clear all
            </button>
          </div>
        </div>
      ) : null}

      {count === 0 ? (
        <EmptyState
          icon={<FilmIcon className="size-5" />}
          title="Your watchlist is empty"
          message="Find something that looks good on the discover feed, then tap the heart on its cover."
          action={
            <Link to="/" className={BUTTON_PRIMARY}>
              Browse films
            </Link>
          }
        />
      ) : (
        <MovieGrid movies={sortedItems} />
      )}
    </Container>
  )
}
