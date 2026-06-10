export function isWithinDateRange(isoDate, startDate, endDate) {
  if (!isoDate) return true
  const d = new Date(isoDate)
  if (startDate) {
    const start = new Date(`${startDate}T00:00:00`)
    if (d < start) return false
  }
  if (endDate) {
    const end = new Date(`${endDate}T23:59:59`)
    if (d > end) return false
  }
  return true
}

export function formatDateBR(dateStr) {
  if (!dateStr) return ''
  const [y, m, d] = dateStr.split('-')
  return `${d}/${m}/${y}`
}
