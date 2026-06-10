import { Calendar } from 'lucide-react'
import { useDateRange } from '../context/DateRangeContext.jsx'

export default function DateRangeFilter() {
  const { startDate, endDate, setStartDate, setEndDate } = useDateRange()

  return (
    <div className="flex items-center gap-2">
      <Calendar size={14} className="text-driven-muted flex-none" />
      <label className="flex items-center gap-1.5">
        <span className="text-[11px] text-driven-muted font-medium whitespace-nowrap">De</span>
        <input
          type="date"
          value={startDate}
          max={endDate || undefined}
          onChange={e => setStartDate(e.target.value)}
          className="text-xs px-2 py-1.5 border border-driven-border rounded-lg bg-driven-cream focus:outline-none focus:border-driven-gold/60 text-driven-text-secondary"
        />
      </label>
      <label className="flex items-center gap-1.5">
        <span className="text-[11px] text-driven-muted font-medium whitespace-nowrap">Até</span>
        <input
          type="date"
          value={endDate}
          min={startDate || undefined}
          onChange={e => setEndDate(e.target.value)}
          className="text-xs px-2 py-1.5 border border-driven-border rounded-lg bg-driven-cream focus:outline-none focus:border-driven-gold/60 text-driven-text-secondary"
        />
      </label>
    </div>
  )
}
