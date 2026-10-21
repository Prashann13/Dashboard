import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import { clearTMDBRequestCache } from './hooks/useTMDB'
import { WATCHLIST_STORAGE_KEY } from './lib/constants'

const matrix = {
  id: 603,
  title: 'The Matrix',
  original_title: 'The Matrix',
  overview: 'A hacker learns the world he knows is a simulation.',
  poster_path: '/matrix.jpg',
  backdrop_path: '/matrix-backdrop.jpg',
  release_date: '1999-03-31',
  vote_average: 8.2,
  vote_count: 25000,
  popularity: 120,
  genre_ids: [28, 878],
}

const genres = [
  { id: 28, name: 'Action' },
  { id: 878, name: 'Science Fiction' },
]

function json(body, { ok = true, status = 200 } = {}) {
  return { ok, status, json: async () => body }
}

function createFetchMock() {
  return vi.fn(async (input) => {
    const url = new URL(input.toString())
    const { pathname } = url

    if (pathname === '/3/genre/movie/list') {
      return json({ genres })
    }

    if (pathname === '/3/movie/603') {
      return json({
        ...matrix,
        runtime: 136,
        tagline: 'Welcome to the real world.',
        genres,
        credits: {
          crew: [
            { job: 'Director', name: 'Lana Wachowski' },
            { job: 'Director', name: 'Lilly Wachowski' },
            { job: 'Screenplay', name: 'Lana Wachowski' },
          ],
          cast: [{ name: 'Keanu Reeves' }, { name: 'Carrie-Anne Moss' }],
        },
        videos: {
          results: [
            { site: 'YouTube', key: 'vKQi3bBA1y8', type: 'Trailer', official: true },
          ],
        },
        release_dates: {
          results: [
            {
              iso_3166_1: 'US',
              release_dates: [{ certification: 'R' }],
            },
          ],
        },
        similar: { results: [] },
      })
    }

    if (pathname === '/3/search/movie') {
      return json({
        page: 1,
        total_pages: 1,
        total_results: 1,
        results: url.searchParams.get('query') === 'matrix' ? [matrix] : [],
      })
    }

    if (pathname === '/3/trending/movie/week' || pathname === '/3/discover/movie') {
      return json({ page: 1, total_pages: 1, total_results: 1, results: [matrix] })
    }

    return json({})
  })
}

function renderApp(initialEntry = '/') {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <App />
    </MemoryRouter>,
  )
}

describe('Reelist app', () => {
  beforeEach(() => {
    clearTMDBRequestCache()
    window.localStorage.clear()
    vi.stubEnv('VITE_TMDB_API_KEY', 'test-key')
    vi.stubEnv('VITE_TMDB_READ_TOKEN', '')
    vi.stubGlobal('fetch', createFetchMock())
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  it('loads the discover feed and keeps saved films on the watchlist page', async () => {
    const user = userEvent.setup()
    renderApp()

    expect(
      await screen.findByRole('heading', { name: 'The Matrix', level: 3 }),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /add the matrix to watchlist/i }))

    const stored = JSON.parse(window.localStorage.getItem(WATCHLIST_STORAGE_KEY))
    expect(stored).toHaveLength(1)
    expect(stored[0].id).toBe(603)

    await user.click(screen.getByRole('link', { name: /watchlist/i }))

    expect(
      await screen.findByRole('heading', { name: 'Watchlist', level: 1 }),
    ).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'The Matrix', level: 3 })).toBeInTheDocument()
  })

  it('searches as the query is typed', async () => {
    const user = userEvent.setup()
    renderApp()

    await screen.findByRole('heading', { name: 'The Matrix', level: 3 })

    await user.type(screen.getByRole('searchbox', { name: /search movies/i }), 'matrix')

    expect(
      await screen.findByRole('heading', { name: /results for/i }, { timeout: 3000 }),
    ).toBeInTheDocument()
    expect(await screen.findByRole('heading', { name: 'The Matrix', level: 3 })).toBeInTheDocument()

    const searchCall = vi
      .mocked(fetch)
      .mock.calls.find(([input]) => input.toString().includes('/search/movie'))
    expect(searchCall).toBeDefined()
    expect(searchCall[0].toString()).toContain('query=matrix')
  })

  it('opens the detail modal with credits and closes on Escape', async () => {
    const user = userEvent.setup()
    renderApp()

    await screen.findByRole('heading', { name: 'The Matrix', level: 3 })
    await user.click(screen.getByRole('button', { name: /view details for the matrix/i }))

    const dialog = await screen.findByRole('dialog')
    expect(
      await within(dialog).findByText(/a hacker learns the world he knows is a simulation/i),
    ).toBeInTheDocument()
    expect(within(dialog).getByText('Lana Wachowski, Lilly Wachowski')).toBeInTheDocument()
    expect(within(dialog).getByText('R')).toBeInTheDocument()
    expect(within(dialog).getByRole('link', { name: /watch trailer/i })).toHaveAttribute(
      'href',
      'https://www.youtube.com/watch?v=vKQi3bBA1y8',
    )

    await user.keyboard('{Escape}')

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  })

  it('explains how to configure TMDB when credentials are missing', () => {
    vi.stubEnv('VITE_TMDB_API_KEY', '')
    renderApp()

    expect(
      screen.getByRole('heading', { name: /connect the movie database/i }),
    ).toBeInTheDocument()
  })
})
