export default function SkeletonCard() {
  return (
    <div aria-hidden="true">
      <div className="skeleton-shimmer aspect-[2/3] rounded-xl ring-1 ring-line/60" />
      <div className="mt-3 h-3.5 w-4/5 rounded-full bg-elevated" />
      <div className="mt-2 h-3 w-1/3 rounded-full bg-elevated" />
    </div>
  )
}
