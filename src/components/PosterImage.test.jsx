import { render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import PosterImage from './PosterImage'

const completeDescriptor = Object.getOwnPropertyDescriptor(
  HTMLImageElement.prototype,
  'complete',
)
const naturalWidthDescriptor = Object.getOwnPropertyDescriptor(
  HTMLImageElement.prototype,
  'naturalWidth',
)

function restoreImagePrototype() {
  if (completeDescriptor) {
    Object.defineProperty(HTMLImageElement.prototype, 'complete', completeDescriptor)
  }
  if (naturalWidthDescriptor) {
    Object.defineProperty(HTMLImageElement.prototype, 'naturalWidth', naturalWidthDescriptor)
  }
}

afterEach(restoreImagePrototype)

describe('PosterImage', () => {
  it('shows the fallback when there is no poster path', () => {
    render(<PosterImage path={null} title="Heat" />)

    expect(screen.queryByRole('img')).not.toBeInTheDocument()
    expect(screen.getByText('Heat')).toBeInTheDocument()
  })

  it('reveals a poster that was already cached before mount', async () => {
    Object.defineProperty(HTMLImageElement.prototype, 'complete', {
      configurable: true,
      get: () => true,
    })
    Object.defineProperty(HTMLImageElement.prototype, 'naturalWidth', {
      configurable: true,
      get: () => 342,
    })

    render(<PosterImage path="/poster.jpg" title="Heat" />)

    await waitFor(() => {
      expect(screen.getByRole('img', { name: 'Heat poster' })).toHaveClass('opacity-100')
    })
  })
})
