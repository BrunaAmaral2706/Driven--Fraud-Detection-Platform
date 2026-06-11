import { useState, useMemo, useCallback } from 'react'

function getSortValue(item, key) {
  const v = item[key]
  if (v == null) return ''
  if (typeof v === 'number') return v
  if (typeof v === 'string' && /^\d{4}-\d{2}/.test(v)) return new Date(v).getTime()
  return String(v).toLowerCase()
}

export function useTableSort(data, defaultKey = null, defaultDir = 'desc') {
  const [sortKey, setSortKey] = useState(defaultKey)
  const [sortDir, setSortDir] = useState(defaultDir)

  const toggleSort = useCallback((key) => {
    if (sortKey === key) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
  }, [sortKey])

  const sorted = useMemo(() => {
    if (!sortKey) return data
    return [...data].sort((a, b) => {
      const av = getSortValue(a, sortKey)
      const bv = getSortValue(b, sortKey)
      if (av < bv) return sortDir === 'asc' ? -1 : 1
      if (av > bv) return sortDir === 'asc' ? 1 : -1
      return 0
    })
  }, [data, sortKey, sortDir])

  const sortIndicator = (key) => {
    if (sortKey !== key) return '↕'
    return sortDir === 'asc' ? '↑' : '↓'
  }

  return { sorted, sortKey, sortDir, toggleSort, sortIndicator }
}
