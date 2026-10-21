import { describe, expect, it } from 'vitest'
import { normalizeMovie, normalizeMovies, sortMovies } from './movies'

describe('normalizeMovie', () => {
  it('fills in safe defaults for incomplete API payloads', () => {
    const movie = normalizeMovie({ id: 9, title: '', poster_path: null })

    expect(movie).toMatchObject({
      id: 9,
      title: 'Untitled',
      overview: '',
      posterPath: null,
      releaseDate: '',
      voteAverage: 0,
      voteCount: 0,
      genreIds: [],
    })
  })

  it('drops malformed results from a list', () => {
    const movies = normalizeMovies({
      results: [null, { id: 1, title: 'One' }, { title: 'Missing id' }],
    })

    expect(movies).toHaveLength(1)
    expect(movies[0].title).toBe('One')
    expect(normalizeMovies({})).toEqual([])
    expect(normalizeMovies(null)).toEqual([])
  })
})

describe('sortMovies', () => {
  const movies = [
    { id: 1, title: 'Low', voteAverage: 6.1, popularity: 10, releaseDate: '2020-01-01' },
    { id: 2, title: 'High', voteAverage: 8.9, popularity: 4, releaseDate: '2024-06-01' },
    { id: 3, title: 'No date', voteAverage: 7.2, popularity: 30, releaseDate: '' },
  ]

  it('sorts by rating and popularity', () => {
    expect(sortMovies(movies, 'vote_average.desc').map((movie) => movie.id)).toEqual([2, 3, 1])
    expect(sortMovies(movies, 'popularity.desc').map((movie) => movie.id)).toEqual([3, 1, 2])
  })

  it('keeps films without a release date at the end in both directions', () => {
    expect(sortMovies(movies, 'primary_release_date.desc').map((movie) => movie.id)).toEqual([
      2, 1, 3,
    ])
    expect(sortMovies(movies, 'primary_release_date.asc').map((movie) => movie.id)).toEqual([
      1, 2, 3,
    ])
  })

  it('does not mutate the source array', () => {
    const original = movies.map((movie) => movie.id)
    sortMovies(movies, 'vote_average.desc')
    expect(movies.map((movie) => movie.id)).toEqual(original)
  })
})
