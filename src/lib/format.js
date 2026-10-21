const dateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
})

const countFormatter = new Intl.NumberFormat('en-US')

export function formatDate(value) {
  if (!value) return ''
  const date = new Date(`${value}T00:00:00`)
  if (Number.isNaN(date.getTime())) return ''
  return dateFormatter.format(date)
}

export function getYear(value) {
  return typeof value === 'string' && value.length >= 4 ? value.slice(0, 4) : ''
}

export function formatRuntime(minutes) {
  if (!Number.isFinite(minutes) || minutes <= 0) return ''
  const hours = Math.floor(minutes / 60)
  const remainder = minutes % 60
  if (hours === 0) return `${remainder}m`
  return remainder === 0 ? `${hours}h` : `${hours}h ${remainder}m`
}

export function formatRating(value) {
  if (!Number.isFinite(value) || value <= 0) return 'NR'
  return value.toFixed(1)
}

export function formatCount(value) {
  if (!Number.isFinite(value)) return '0'
  return countFormatter.format(value)
}

export function getCertification(releaseDates) {
  const results = releaseDates?.results
  if (!Array.isArray(results)) return ''

  const usRelease = results.find((entry) => entry.iso_3166_1 === 'US')
  const certification = usRelease?.release_dates?.find((entry) => entry.certification)?.certification

  return certification || ''
}
