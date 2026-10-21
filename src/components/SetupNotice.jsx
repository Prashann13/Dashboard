import Container from './Container'
import { BUTTON_PRIMARY } from '../lib/ui'
import { ArrowUpRightIcon, FilmIcon } from './icons'

const STEPS = [
  'Create a free account at themoviedb.org and request an API key.',
  'Copy the v3 API key (or the v4 read access token).',
  'Add it to a .env.local file in the project root and restart the dev server.',
]

export default function SetupNotice() {
  return (
    <main className="min-h-dvh py-16">
      <Container className="max-w-2xl">
        <div className="flex items-center gap-2.5">
          <span className="grid size-10 place-items-center rounded-xl bg-accent text-canvas">
            <FilmIcon className="size-5" />
          </span>
          <span className="font-display text-xl font-semibold tracking-tight text-white">
            Reelist
          </span>
        </div>

        <h1 className="mt-10 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Connect The Movie Database
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
          Reelist reads its catalog directly from TMDB, so it needs your API credentials before
          it can load a single poster.
        </p>

        <ol className="mt-8 space-y-3">
          {STEPS.map((step, index) => (
            <li key={step} className="flex gap-3 text-sm leading-relaxed text-zinc-300">
              <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-elevated text-xs font-semibold text-accent ring-1 ring-line">
                {index + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>

        <div className="mt-8 overflow-hidden rounded-xl border border-line bg-surface">
          <div className="border-b border-line/80 px-4 py-2.5 text-xs text-muted">.env.local</div>
          <pre className="overflow-x-auto px-4 py-4 font-mono text-sm text-zinc-200">
            <code>VITE_TMDB_API_KEY=your_api_key_here</code>
          </pre>
        </div>

        <p className="mt-4 text-xs leading-relaxed text-muted">
          Using a v4 token instead? Set <code className="text-zinc-400">VITE_TMDB_READ_TOKEN</code>{' '}
          and leave the API key empty. Both options are documented in{' '}
          <code className="text-zinc-400">.env.example</code>.
        </p>

        <a
          href="https://www.themoviedb.org/settings/api"
          target="_blank"
          rel="noopener noreferrer"
          className={`mt-8 inline-flex items-center gap-2 ${BUTTON_PRIMARY}`}
        >
          Open TMDB API settings
          <ArrowUpRightIcon className="size-4" />
        </a>
      </Container>
    </main>
  )
}
