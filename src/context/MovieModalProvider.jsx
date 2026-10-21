import { useCallback, useMemo, useState } from 'react'
import DetailModal from '../components/DetailModal'
import { MovieModalContext } from './MovieModalContext'

export default function MovieModalProvider({ children }) {
  const [movie, setMovie] = useState(null)

  const openMovie = useCallback((nextMovie) => {
    if (!nextMovie?.id) return
    setMovie(nextMovie)
  }, [])

  const closeMovie = useCallback(() => setMovie(null), [])

  const value = useMemo(() => ({ openMovie, closeMovie }), [openMovie, closeMovie])

  return (
    <MovieModalContext.Provider value={value}>
      {children}
      <DetailModal movie={movie} onClose={closeMovie} onOpenMovie={openMovie} />
    </MovieModalContext.Provider>
  )
}
