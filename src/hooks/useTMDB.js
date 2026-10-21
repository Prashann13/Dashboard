import { useCallback, useEffect, useMemo, useState } from 'react'
import { requestTMDB } from '../api/tmdb'

const CACHE_TTL = 5 * 60 * 1000
const CACHE_LIMIT = 120
const responseCache = new Map()

function isFreshEntry(entry) {
  return Boolean(entry) && Date.now() - entry.storedAt <= CACHE_TTL
}

function peekCache(key) {
  const entry = responseCache.get(key)
  return isFreshEntry(entry) ? entry.data : null
}

function readCache(key) {
  const entry = responseCache.get(key)
  if (!isFreshEntry(entry)) {
    if (entry) responseCache.delete(key)
    return null
  }

  responseCache.delete(key)
  responseCache.set(key, entry)
  return entry.data
}

function writeCache(key, data) {
  responseCache.delete(key)
  responseCache.set(key, { data, storedAt: Date.now() })

  while (responseCache.size > CACHE_LIMIT) {
    const oldestKey = responseCache.keys().next().value
    responseCache.delete(oldestKey)
  }
}

export function clearTMDBRequestCache() {
  responseCache.clear()
}

export function useTMDB(path, params = {}, { enabled = true } = {}) {
  const paramsKey = JSON.stringify(params ?? {})
  const requestKey = enabled && path ? `${path}::${paramsKey}` : null
  const stableParams = useMemo(() => JSON.parse(paramsKey), [paramsKey])
  const cachedData = useMemo(() => (requestKey ? peekCache(requestKey) : null), [requestKey])

  const [reloadToken, setReloadToken] = useState(0)
  const [state, setState] = useState(() => ({
    key: requestKey,
    data: cachedData,
    error: null,
    loading: Boolean(requestKey && !cachedData),
  }))

  useEffect(() => {
    if (!requestKey || !path) {
      setState({ key: null, data: null, error: null, loading: false })
      return undefined
    }

    const cached = readCache(requestKey)
    if (cached) {
      setState({ key: requestKey, data: cached, error: null, loading: false })
      return undefined
    }

    const controller = new AbortController()
    setState({ key: requestKey, data: null, error: null, loading: true })

    requestTMDB(path, stableParams, { signal: controller.signal })
      .then((data) => {
        writeCache(requestKey, data)
        setState({ key: requestKey, data, error: null, loading: false })
      })
      .catch((error) => {
        if (error?.name === 'AbortError') return
        setState({ key: requestKey, data: null, error, loading: false })
      })

    return () => controller.abort()
  }, [requestKey, path, stableParams, reloadToken])

  const retry = useCallback(() => {
    if (requestKey) responseCache.delete(requestKey)
    setReloadToken((token) => token + 1)
  }, [requestKey])

  const view =
    state.key === requestKey
      ? state
      : {
          data: cachedData,
          error: null,
          loading: Boolean(requestKey && !cachedData),
        }

  return {
    data: view.data,
    error: view.error,
    loading: view.loading,
    retry,
  }
}
