import { createContext, useContext } from 'react'

export const MovieModalContext = createContext(null)

export function useMovieModal() {
  const context = useContext(MovieModalContext)
  if (!context) {
    throw new Error('useMovieModal must be used inside a MovieModalProvider')
  }
  return context
}
