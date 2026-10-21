import { describe, expect, it } from 'vitest'
import { buildPageList, ELLIPSIS } from './pagination'

describe('buildPageList', () => {
  it('returns a single page when there is nothing to paginate', () => {
    expect(buildPageList(1, 1)).toEqual([1])
    expect(buildPageList(1, 0)).toEqual([])
  })

  it('shows every page when the set is small', () => {
    expect(buildPageList(3, 5)).toEqual([1, 2, 3, 4, 5])
    expect(buildPageList(7, 7)).toEqual([1, 2, 3, 4, 5, 6, 7])
  })

  it('inserts gaps around the active page', () => {
    expect(buildPageList(5, 10)).toEqual([1, ELLIPSIS, 4, 5, 6, ELLIPSIS, 10])
    expect(buildPageList(1, 10)).toEqual([1, 2, ELLIPSIS, 10])
    expect(buildPageList(10, 10)).toEqual([1, ELLIPSIS, 9, 10])
  })

  it('clamps to the TMDB page ceiling', () => {
    expect(buildPageList(900, 2000)).toEqual([1, ELLIPSIS, 499, 500])
  })

  it('normalizes invalid input', () => {
    expect(buildPageList(undefined, undefined)).toEqual([])
    expect(buildPageList(-4, 3)).toEqual([1, 2, 3])
  })
})
