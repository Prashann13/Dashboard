import { BUTTON_SECONDARY } from '../lib/ui'
import { AlertTriangleIcon, RefreshIcon } from './icons'

export default function ErrorState({ error, onRetry, compact = false }) {
  const message =
    error?.message || 'Something went wrong while loading movies. Please try again.'

  return (
    <div
      role="alert"
      className={`flex flex-col items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/5 px-6 text-center ${
        compact ? 'py-8' : 'py-16'
      }`}
    >
      <div className="grid size-12 place-items-center rounded-full bg-red-500/10 text-red-300 ring-1 ring-red-500/25">
        <AlertTriangleIcon className="size-5" />
      </div>
      <h2 className="mt-4 font-display text-lg font-semibold text-white">
        We couldn&apos;t load this
      </h2>
      <p className="mt-1.5 max-w-md text-sm leading-relaxed text-zinc-400">{message}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className={`mt-5 inline-flex items-center gap-2 ${BUTTON_SECONDARY}`}
        >
          <RefreshIcon className="size-4" />
          Try again
        </button>
      ) : null}
    </div>
  )
}
