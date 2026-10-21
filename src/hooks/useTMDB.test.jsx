import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { clearTMDBRequestCache, useTMDB } from './useTMDB'

function jsonResponse(body, { ok = true, status = 200 } = {}) {
  return { ok, status, json: async () => body }
}

describe('useTMDB', () => {
  beforeEach(() => {
    clearTMDBRequestCache()
    vi.stubEnv('VITE_TMDB_API_KEY', 'test-key')
    vi.stubEnv('VITE_TMDB_READ_TOKEN', '')
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  it('loads data once and serves the next mount from cache', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(jsonResponse({ page: 1, results: [], total_pages: 1 }))
    vi.stubGlobal('fetch', fetchMock)

    const first = renderHook(() => useTMDB('/movie/popular', { page: 1 }))
    expect(first.result.current.loading).toBe(true)

    await waitFor(() => expect(first.result.current.loading).toBe(false))
    expect(first.result.current.data).toEqual({ page: 1, results: [], total_pages: 1 })
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock.mock.calls[0][0].toString()).toContain('api_key=test-key')

    first.unmount()

    const second = renderHook(() => useTMDB('/movie/popular', { page: 1 }))
    expect(second.result.current.loading).toBe(false)
    expect(second.result.current.data).toEqual({ page: 1, results: [], total_pages: 1 })
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('reports credential errors and can retry', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse({ status_message: 'Invalid API key' }, { ok: false, status: 401 }))
      .mockResolvedValueOnce(jsonResponse({ page: 2, results: [] }))
    vi.stubGlobal('fetch', fetchMock)

    const { result } = renderHook(() => useTMDB('/movie/popular', { page: 2 }))

    await waitFor(() => expect(result.current.error).not.toBeNull())
    expect(result.current.error.message).toMatch(/rejected the credentials/i)
    expect(result.current.loading).toBe(false)

    act(() => {
      result.current.retry()
    })

    await waitFor(() => expect(result.current.data).toEqual({ page: 2, results: [] }))
    expect(result.current.error).toBeNull()
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('stays idle when disabled', () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    const { result } = renderHook(() => useTMDB(null, {}, { enabled: false }))

    expect(result.current.loading).toBe(false)
    expect(result.current.data).toBeNull()
    expect(fetchMock).not.toHaveBeenCalled()
  })
})
