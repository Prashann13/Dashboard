import { describe, expect, it } from 'vitest'
import {
  formatCount,
  formatDate,
  formatRating,
  formatRuntime,
  getCertification,
  getYear,
} from './format'

describe('format helpers', () => {
  it('formats runtimes into hours and minutes', () => {
    expect(formatRuntime(142)).toBe('2h 22m')
    expect(formatRuntime(120)).toBe('2h')
    expect(formatRuntime(45)).toBe('45m')
    expect(formatRuntime(0)).toBe('')
    expect(formatRuntime(undefined)).toBe('')
  })

  it('formats ratings and falls back when unrated', () => {
    expect(formatRating(8.26)).toBe('8.3')
    expect(formatRating(7)).toBe('7.0')
    expect(formatRating(0)).toBe('NR')
    expect(formatRating(undefined)).toBe('NR')
  })

  it('formats release dates safely', () => {
    expect(formatDate('2024-03-15')).toBe('Mar 15, 2024')
    expect(formatDate('nonsense')).toBe('')
    expect(formatDate('')).toBe('')
    expect(getYear('2024-03-15')).toBe('2024')
    expect(getYear(undefined)).toBe('')
  })

  it('extracts a US certification when one exists', () => {
    const releaseDates = {
      results: [
        {
          iso_3166_1: 'US',
          release_dates: [{ certification: '' }, { certification: 'PG-13' }],
        },
      ],
    }

    expect(getCertification(releaseDates)).toBe('PG-13')
    expect(getCertification({ results: [] })).toBe('')
    expect(getCertification(null)).toBe('')
  })

  it('formats large counts', () => {
    expect(formatCount(12345)).toBe('12,345')
    expect(formatCount(undefined)).toBe('0')
  })
})
