import { useCallback, useEffect, useMemo, useState } from 'react'
import { WATCHLIST_STORAGE_KEY } from '../lib/constants'
import { WatchlistContext } from './WatchlistContext'

function sanitizeItem(item) {
  if (!item || typeof item !== 'object') return null

  const id = Number(item.id)
  const voteAverage = Number(item.voteAverage)
  const addedAt = Number(item.addedAt)

  if (!Number.isFinite(id)) return null

  return {
    id,
    title: typeof item.title === 'string' && item.title ? item.title : 'Untitled',
    posterPath: typeof item.posterPath === 'string' ? item.posterPath : null,
    backdropPath: typeof item.backdropPath === 'string' ? item.backdropPath : null,
    releaseDate: typeof item.releaseDate === 'string' ? item.releaseDate : '',
    voteAverage: Number.isFinite(voteAverage) ? voteAverage : 0,
    genreIds: Array.isArray(item.genreIds)
      ? item.genreIds.map(Number).filter(Number.isFinite)
      : [],
    addedAt: Number.isFinite(addedAt) ? addedAt : Date.now(),
  }
}

function readStoredWatchlist() {
  if (typeof window === 'undefined') return []

  try {
    const raw = window.localStorage.getItem(WATCHLIST_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []

    const byId = new Map()
    parsed.forEach((item) => {
      const clean = sanitizeItem(item)
      if (clean && !byId.has(clean.id)) byId.set(clean.id, clean)
    })

    return [...byId.values()]
  } catch {
    return []
  }
}

function persistWatchlist(items) {
  if (typeof window === 'undefined') return

  try {
    const serialized = JSON.stringify(items)
    if (window.localStorage.getItem(WATCHLIST_STORAGE_KEY) !== serialized) {
      window.localStorage.setItem(WATCHLIST_STORAGE_KEY, serialized)
    }
  } catch {
    // Storage can be unavailable (private mode, quota). The in-memory list still works.
  }
}

export default function WatchlistProvider({ children }) {
  const [items, setItems] = useState(readStoredWatchlist)

  useEffect(() => {
    persistWatchlist(items)
  }, [items])

  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key && event.key !== WATCHLIST_STORAGE_KEY) return
      setItems(readStoredWatchlist())
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const savedIds = useMemo(() => new Set(items.map((item) => item.id)), [items])

  const toggle = useCallback((movie) => {
    const id = Number(movie?.id)
    if (!Number.isFinite(id)) return

    setItems((current) => {
      if (current.some((item) => item.id === id)) {
        return current.filter((item) => item.id !== id)
      }

      const clean = sanitizeItem({ ...movie, addedAt: Date.now() })
      return clean ? [clean, ...current] : current
    })
  }, [])

  const clear = useCallback(() => setItems([]), [])

  const isSaved = useCallback((id) => savedIds.has(Number(id)), [savedIds])

  const value = useMemo(
    () => ({ items, isSaved, toggle, clear }),
    [items, isSaved, toggle, clear],
  )

  return <WatchlistContext.Provider value={value}>{children}</WatchlistContext.Provider>
}
