export const ELLIPSIS = 'ellipsis'

const PAGE_LIMIT = 500
const COMPACT_THRESHOLD = 7

export function buildPageList(current, total, siblings = 1) {
  const pageCount = Math.min(Math.max(Math.trunc(Number(total)) || 0, 0), PAGE_LIMIT)
  if (pageCount < 1) return []
  if (pageCount === 1) return [1]

  const active = Math.min(Math.max(Math.trunc(Number(current)) || 1, 1), pageCount)
  if (pageCount <= COMPACT_THRESHOLD) {
    return Array.from({ length: pageCount }, (_, index) => index + 1)
  }

  const visible = new Set([1, pageCount, active])
  for (let offset = 1; offset <= siblings; offset += 1) {
    if (active - offset > 1) visible.add(active - offset)
    if (active + offset < pageCount) visible.add(active + offset)
  }

  const sorted = [...visible].sort((left, right) => left - right)
  const result = []

  sorted.forEach((page, index) => {
    if (index > 0 && page - sorted[index - 1] > 1) {
      result.push(ELLIPSIS)
    }
    result.push(page)
  })

  return result
}
