const DEFAULT_API_BASE = 'https://api.themoviedb.org/3'
const DEFAULT_IMAGE_BASE = 'https://image.tmdb.org/t/p'

function getApiBase() {
  return (import.meta.env.VITE_TMDB_API_BASE_URL || DEFAULT_API_BASE).replace(/\/+$/, '')
}

function getImageBase() {
  return (import.meta.env.VITE_TMDB_IMAGE_BASE_URL || DEFAULT_IMAGE_BASE).replace(/\/+$/, '')
}

export class TMDbError extends Error {
  constructor(message, { status = 0, code = 'unknown' } = {}) {
    super(message)
    this.name = 'TMDbError'
    this.status = status
    this.code = code
  }
}

function getCredentials() {
  const apiKey = (import.meta.env.VITE_TMDB_API_KEY ?? '').trim()
  const readToken = (import.meta.env.VITE_TMDB_READ_TOKEN ?? '').trim()
  return { apiKey, readToken }
}

export function isTMDBConfigured() {
  const { apiKey, readToken } = getCredentials()
  return Boolean(apiKey || readToken)
}

function buildUrl(path, params, apiKey) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  const url = new URL(`${getApiBase()}${normalizedPath}`)

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return
    url.searchParams.set(key, String(value))
  })

  if (apiKey) {
    url.searchParams.set('api_key', apiKey)
  }

  return url
}

async function readErrorMessage(response) {
  try {
    const body = await response.json()
    return body?.status_message || body?.message || ''
  } catch {
    return ''
  }
}

export async function requestTMDB(path, params = {}, { signal } = {}) {
  const { apiKey, readToken } = getCredentials()

  if (!apiKey && !readToken) {
    throw new TMDbError(
      'TMDB credentials are missing. Add VITE_TMDB_API_KEY or VITE_TMDB_READ_TOKEN to your .env file and restart the dev server.',
      { code: 'missing_credentials' },
    )
  }

  const url = buildUrl(path, params, readToken ? null : apiKey)

  let response
  try {
    response = await fetch(url, {
      signal,
      headers: {
        accept: 'application/json',
        ...(readToken ? { authorization: `Bearer ${readToken}` } : {}),
      },
    })
  } catch (error) {
    if (error?.name === 'AbortError') throw error
    throw new TMDbError('Could not reach TMDB. Check your connection and try again.', {
      code: 'network',
    })
  }

  if (!response.ok) {
    const detail = await readErrorMessage(response)
    let message = detail || `TMDB request failed with status ${response.status}.`

    if (response.status === 401) {
      message =
        'TMDB rejected the credentials. Check the API key or read access token in your .env file.'
    } else if (response.status === 404) {
      message = 'That title could not be found on TMDB.'
    } else if (response.status === 429) {
      message = 'TMDB is rate limiting requests. Wait a moment and try again.'
    }

    throw new TMDbError(message, { status: response.status, code: `http_${response.status}` })
  }

  try {
    return await response.json()
  } catch {
    throw new TMDbError('TMDB returned an unreadable response.', {
      status: response.status,
      code: 'invalid_json',
    })
  }
}

export function imageUrl(path, size = 'w500') {
  if (!path) return null
  return `${getImageBase()}/${size}${path}`
}
