import { Calendar, RotateCcw } from 'lucide-react'
import { useDateRange } from '../context/DateRangeContext.jsx'
import { DEMO_DATE_START, DEMO_DATE_END } from '../config/demoPeriod.js'

export default function DateRangeFilter() {
  const { startDate, endDate, setStartDate, setEndDate } = useDateRange()

  const resetPeriod = () => {
    setStartDate(DEMO_DATE_START)
    setEndDate(DEMO_DATE_END)
  }

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
      <button
        type="button"
        onClick={resetPeriod}
        title="Restaurar período da base demo (maio/2024)"
        className="p-1.5 rounded-lg border border-driven-border bg-driven-cream hover:bg-driven-border-light text-driven-muted hover:text-driven-text transition-colors"
      >
        <RotateCcw size={12} />
      </button>
    </div>
  )
}
