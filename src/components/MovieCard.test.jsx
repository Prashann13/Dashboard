import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import MovieModalProvider from '../context/MovieModalProvider'
import WatchlistProvider from '../context/WatchlistProvider'
import { WATCHLIST_STORAGE_KEY } from '../lib/constants'
import MovieCard from './MovieCard'

const movie = {
  id: 7,
  title: 'Arrival',
  posterPath: null,
  backdropPath: null,
  releaseDate: '2016-11-11',
  voteAverage: 7.6,
  voteCount: 12000,
  overview: 'A linguist works with the military to communicate with alien lifeforms.',
  genreIds: [878, 18],
}

function renderCard() {
  return render(
    <WatchlistProvider>
      <MovieModalProvider>
        <MovieCard movie={movie} />
      </MovieModalProvider>
    </WatchlistProvider>,
  )
}

describe('MovieCard', () => {
  it('renders the title, year, and rating', () => {
    renderCard()

    expect(screen.getByRole('heading', { name: 'Arrival' })).toBeInTheDocument()
    expect(screen.getByText('2016')).toBeInTheDocument()
    expect(screen.getByText('7.6')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /view details for arrival/i }),
    ).toBeInTheDocument()
  })

  it('toggles the watchlist and persists the selection', async () => {
    const user = userEvent.setup()
    renderCard()

    await user.click(screen.getByRole('button', { name: /add arrival to watchlist/i }))

    const removeButton = screen.getByRole('button', {
      name: /remove arrival from watchlist/i,
    })
    expect(removeButton).toHaveAttribute('aria-pressed', 'true')

    const stored = JSON.parse(window.localStorage.getItem(WATCHLIST_STORAGE_KEY))
    expect(stored).toHaveLength(1)
    expect(stored[0].id).toBe(7)
  })
})
