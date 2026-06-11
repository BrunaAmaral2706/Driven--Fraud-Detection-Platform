import { Calendar, RotateCcw } from 'lucide-react'
import { useDateRange } from '../context/DateRangeContext.jsx'
import { DEMO_DATE_START, DEMO_DATE_END } from '../config/demoPeriod.js'

export default function DateRangeFilter({ loading = false }) {
  const { startDate, endDate, setStartDate, setEndDate } = useDateRange()
  const isDefault = startDate === DEMO_DATE_START && endDate === DEMO_DATE_END

  const resetPeriod = () => {
    setStartDate(DEMO_DATE_START)
    setEndDate(DEMO_DATE_END)
  }

  return (
    <div className={`flex items-center gap-2 transition-opacity duration-300 ${loading ? 'opacity-60 pointer-events-none' : ''}`}>
      <Calendar size={14} className={`flex-none transition-colors ${isDefault ? 'text-driven-muted' : 'text-driven-gold'}`} />
      <label className="flex items-center gap-1.5">
        <span className="text-[11px] text-driven-muted font-medium whitespace-nowrap">De</span>
        <input
          type="date"
          value={startDate}
          max={endDate || undefined}
          onChange={e => setStartDate(e.target.value)}
          className="text-xs px-2 py-1.5 border border-driven-border rounded-lg bg-driven-cream input-interactive text-driven-text-secondary"
        />
      </label>
      <label className="flex items-center gap-1.5">
        <span className="text-[11px] text-driven-muted font-medium whitespace-nowrap">Até</span>
        <input
          type="date"
          value={endDate}
          min={startDate || undefined}
          onChange={e => setEndDate(e.target.value)}
          className="text-xs px-2 py-1.5 border border-driven-border rounded-lg bg-driven-cream input-interactive text-driven-text-secondary"
        />
      </label>
      <button
        type="button"
        onClick={resetPeriod}
        title="Restaurar período da base demo (maio/2024)"
        className={`btn-icon border border-driven-border bg-driven-cream ${!isDefault ? 'text-driven-gold border-driven-gold/30' : ''}`}
      >
        <RotateCcw size={12} className={loading ? 'animate-spin' : ''} />
      </button>
      {!isDefault && (
        <span className="text-[10px] font-semibold text-driven-gold bg-driven-gold-pale px-2 py-0.5 rounded-full animate-fade-in">
          Período customizado
        </span>
      )}
    </div>
  )
}
