export default function PageHeader({ eyebrow, title, description, actions }) {
  return (
    <header className="mb-6 sm:mb-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          {eyebrow ? (
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="mt-1.5 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
              {description}
            </p>
          ) : null}
        </div>
        {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
      </div>
    </header>
  )
}
