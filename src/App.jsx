import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { isTMDBConfigured } from './api/tmdb'
import ErrorBoundary from './components/ErrorBoundary'
import Footer from './components/Footer'
import Header from './components/Header'
import PageFallback from './components/PageFallback'
import ScrollToTop from './components/ScrollToTop'
import SetupNotice from './components/SetupNotice'
import MovieModalProvider from './context/MovieModalProvider'
import WatchlistProvider from './context/WatchlistProvider'

const HomePage = lazy(() => import('./pages/HomePage'))
const SearchPage = lazy(() => import('./pages/SearchPage'))
const GenresPage = lazy(() => import('./pages/GenresPage'))
const GenrePage = lazy(() => import('./pages/GenrePage'))
const WatchlistPage = lazy(() => import('./pages/WatchlistPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

export default function App() {
  if (!isTMDBConfigured()) {
    return <SetupNotice />
  }

  return (
    <ErrorBoundary>
      <WatchlistProvider>
        <MovieModalProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-canvas"
          >
            Skip to content
          </a>
          <ScrollToTop />
          <div className="flex min-h-dvh flex-col">
            <Header />
            <main id="main" className="flex-1">
              <Suspense fallback={<PageFallback />}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/genres" element={<GenresPage />} />
                  <Route path="/genres/:genreId" element={<GenrePage />} />
                  <Route path="/watchlist" element={<WatchlistPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
          </div>
        </MovieModalProvider>
      </WatchlistProvider>
    </ErrorBoundary>
  )
}
