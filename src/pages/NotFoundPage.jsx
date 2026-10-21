import { Link } from 'react-router-dom'
import Container from '../components/Container'
import { BUTTON_PRIMARY } from '../lib/ui'

export default function NotFoundPage() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">404</p>
      <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
        This shelf is empty
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
        The page you were looking for doesn't exist. The catalog is still where you left it.
      </p>
      <Link
        to="/"
        className={`mt-6 ${BUTTON_PRIMARY}`}
      >
        Back to discovery
      </Link>
    </Container>
  )
}
