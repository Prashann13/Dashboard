import { FilmIcon } from './icons'

export default function EmptyState({ title, message, action, icon }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-surface/60 px-6 py-16 text-center">
      <div className="grid size-12 place-items-center rounded-full bg-elevated text-zinc-500 ring-1 ring-line">
        {icon ?? <FilmIcon className="size-5" />}
      </div>
      <h2 className="mt-4 font-display text-lg font-semibold text-white">{title}</h2>
      {message ? <p className="mt-1.5 max-w-md text-sm leading-relaxed text-muted">{message}</p> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  )
}
