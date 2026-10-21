import Container from './Container'

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-line/70">
      <Container className="flex flex-col gap-2 py-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted">
          Reelist — a small shelf for films you mean to watch.
        </p>
        <p className="text-xs text-muted">
          <a
            href="https://www.themoviedb.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-400 underline-offset-2 transition-colors hover:text-accent hover:underline"
          >
            This product uses the TMDB API
          </a>{' '}
          but is not endorsed or certified by TMDB.
        </p>
      </Container>
    </footer>
  )
}
