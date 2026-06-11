export default function TableSkeleton({ rows = 6, cols = 6 }) {
  return (
    <div className="p-4 space-y-2 animate-fade-in">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-3">
          {Array.from({ length: cols }).map((_, c) => (
            <div
              key={c}
              className="h-6 flex-1 rounded-md skeleton-shimmer"
              style={{ maxWidth: c === 0 ? '80px' : undefined }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

export function KpiSkeleton({ count = 4 }) {
  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 animate-fade-in">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card p-5 space-y-3">
          <div className="flex gap-3">
            <div className="w-9 h-9 rounded-lg skeleton-shimmer" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-20 rounded skeleton-shimmer" />
              <div className="h-7 w-16 rounded skeleton-shimmer" />
            </div>
          </div>
          <div className="h-3 w-32 rounded skeleton-shimmer" />
          <div className="h-10 rounded skeleton-shimmer" />
        </div>
      ))}
    </div>
  )
}
