import { act, renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import WatchlistProvider from '../context/WatchlistProvider'
import { WATCHLIST_STORAGE_KEY } from '../lib/constants'
import { useWatchlist } from './useWatchlist'

const wrapper = ({ children }) => <WatchlistProvider>{children}</WatchlistProvider>

const movie = {
  id: 42,
  title: 'Heat',
  posterPath: '/heat.jpg',
  backdropPath: null,
  releaseDate: '1995-12-15',
  voteAverage: 8.3,
  genreIds: [80, 18],
}

describe('useWatchlist', () => {
  it('adds, removes, and persists a film', async () => {
    const { result } = renderHook(() => useWatchlist(), { wrapper })

    expect(result.current.items).toHaveLength(0)

    act(() => {
      result.current.toggle(movie)
    })

    expect(result.current.items).toHaveLength(1)
    expect(result.current.isSaved(42)).toBe(true)

    await waitFor(() => {
      const stored = JSON.parse(window.localStorage.getItem(WATCHLIST_STORAGE_KEY))
      expect(stored).toHaveLength(1)
      expect(stored[0].title).toBe('Heat')
    })

    act(() => {
      result.current.toggle(movie)
    })

    expect(result.current.items).toHaveLength(0)
    expect(result.current.isSaved(42)).toBe(false)
  })

  it('restores stored films and drops duplicates', () => {
    window.localStorage.setItem(
      WATCHLIST_STORAGE_KEY,
      JSON.stringify([{ ...movie, addedAt: 1 }, { ...movie, addedAt: 2 }]),
    )

    const { result } = renderHook(() => useWatchlist(), { wrapper })

    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0].addedAt).toBe(1)
    expect(result.current.isSaved(42)).toBe(true)
  })

  it('ignores malformed storage instead of crashing', () => {
    window.localStorage.setItem(WATCHLIST_STORAGE_KEY, '{not json')

    const { result } = renderHook(() => useWatchlist(), { wrapper })

    expect(result.current.items).toEqual([])
  })

  it('clears everything at once', () => {
    const { result } = renderHook(() => useWatchlist(), { wrapper })

    act(() => {
      result.current.toggle(movie)
      result.current.toggle({ ...movie, id: 43, title: 'Collateral' })
    })
    expect(result.current.items).toHaveLength(2)

    act(() => {
      result.current.clear()
    })
    expect(result.current.items).toHaveLength(0)
  })
})
