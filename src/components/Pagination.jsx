import { buildPageList, ELLIPSIS } from '../lib/pagination'
import { ChevronLeftIcon, ChevronRightIcon } from './icons'

const BUTTON_BASE =
  'grid size-9 place-items-center rounded-lg text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-35'
const IDLE_BUTTON = 'text-zinc-300 ring-1 ring-line hover:bg-elevated hover:text-white'

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null

  const pages = buildPageList(page, totalPages)
  const goTo = (nextPage) => {
    const target = Math.min(Math.max(nextPage, 1), totalPages)
    if (target !== page) onChange(target)
  }

  return (
    <nav aria-label="Pagination" className="mt-10 flex flex-wrap items-center justify-center gap-1.5">
      <button
        type="button"
        onClick={() => goTo(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
        className={`${BUTTON_BASE} ${IDLE_BUTTON}`}
      >
        <ChevronLeftIcon className="size-4" />
      </button>

      {pages.map((item, index) =>
        item === ELLIPSIS ? (
          <span
            key={`ellipsis-${index}`}
            aria-hidden="true"
            className="grid size-9 place-items-center text-sm text-zinc-600"
          >
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => goTo(item)}
            aria-label={`Page ${item}`}
            aria-current={item === page ? 'page' : undefined}
            className={`${BUTTON_BASE} ${
              item === page ? 'bg-accent text-canvas' : IDLE_BUTTON
            }`}
          >
            {item}
          </button>
        ),
      )}

      <button
        type="button"
        onClick={() => goTo(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
        className={`${BUTTON_BASE} ${IDLE_BUTTON}`}
      >
        <ChevronRightIcon className="size-4" />
      </button>

      <p className="w-full pt-2 text-center text-xs text-muted">
        Page {page} of {totalPages}
      </p>
    </nav>
  )
}
