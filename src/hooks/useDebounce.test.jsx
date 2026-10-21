import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useDebounce } from './useDebounce'

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('delays the value until the timer completes', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: 'a' },
    })

    expect(result.current).toBe('a')

    rerender({ value: 'ab' })
    expect(result.current).toBe('a')

    act(() => {
      vi.advanceTimersByTime(299)
    })
    expect(result.current).toBe('a')

    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(result.current).toBe('ab')
  })

  it('restarts the delay when the value keeps changing', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: '' },
    })

    rerender({ value: 'h' })
    act(() => {
      vi.advanceTimersByTime(200)
    })

    rerender({ value: 'he' })
    act(() => {
      vi.advanceTimersByTime(200)
    })
    expect(result.current).toBe('')

    act(() => {
      vi.advanceTimersByTime(100)
    })
    expect(result.current).toBe('he')
  })
})
