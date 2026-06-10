import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Search } from 'lucide-react'
import { investigationsAPI } from '../services/api.js'
import { useDateRange } from '../context/DateRangeContext.jsx'
import { isWithinDateRange } from '../utils/dateRange.js'
import ScoreBadge from '../components/ScoreBadge.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import EmptyState from '../components/EmptyState.jsx'

const PRIORITY_MAP = {
  CRITICAL: 'bg-driven-danger-light text-driven-danger border border-driven-danger/20',
  HIGH: 'bg-driven-warning-light text-driven-warning border border-driven-warning/20',
  MEDIUM: 'bg-driven-gold-pale text-driven-gold border border-driven-gold/20',
  LOW: 'bg-driven-success-light text-driven-success border border-driven-success/20',
}

export default function Investigations() {
  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const { startDate, endDate } = useDateRange()

  useEffect(() => {
    investigationsAPI.list({ limit: 30 })
      .then(r => { setItems(r.data.items); setTotal(r.data.total) })
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = items.filter(i => {
    const matchSearch = !search || (
      i.investigation_code.toLowerCase().includes(search.toLowerCase()) ||
      i.user_name?.toLowerCase().includes(search.toLowerCase()) ||
      i.fraud_type?.toLowerCase().includes(search.toLowerCase())
    )
    const matchDate = isWithinDateRange(i.alert_created_at || i.created_at, startDate, endDate)
    return matchSearch && matchDate
  })

  return (
    <div className="space-y-5">
      <div className="card p-4 flex items-center justify-between gap-3">
        <p className="text-sm text-driven-muted">{filtered.length} de {total} investigações</p>
        <div className="relative">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-driven-muted" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar..."
            className="pl-8 pr-3 py-1.5 text-xs border border-driven-border rounded-lg bg-driven-cream focus:outline-none focus:border-driven-gold/60 w-44"
          />
        </div>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <LoadingSpinner text="Carregando investigações..." />
        ) : filtered.length === 0 ? (
          <EmptyState title="Nenhuma investigação encontrada" description="Tente ajustar o período ou a busca." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-driven-cream border-b border-driven-border">
                <tr>
                  {['Código', 'Alerta', 'Tipo de Fraude', 'Cliente', 'Score', 'Prioridade', 'Analista', 'Status', 'Data', ''].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-driven-muted whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-driven-border-light">
                {filtered.map(i => (
                  <tr key={i.id} className="hover:bg-driven-cream/50 transition-colors">
                    <td className="px-4 py-3.5">
                      <span className="font-mono text-xs font-bold text-driven-text">{i.investigation_code}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-mono text-xs text-driven-info">{i.alert_code}</span>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-driven-text-secondary whitespace-nowrap">{i.fraud_type || '—'}</td>
                    <td className="px-4 py-3.5 text-xs font-medium text-driven-text whitespace-nowrap">{i.user_name || '—'}</td>
                    <td className="px-4 py-3.5"><ScoreBadge score={i.risk_score} /></td>
                    <td className="px-4 py-3.5">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${PRIORITY_MAP[i.priority] || ''}`}>
                        {i.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-driven-text-secondary whitespace-nowrap">{i.analyst || '—'}</td>
                    <td className="px-4 py-3.5"><StatusBadge status={i.status} /></td>
                    <td className="px-4 py-3.5 text-xs text-driven-muted whitespace-nowrap">
                      {new Date(i.alert_created_at || i.created_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-4 py-3.5">
                      <Link
                        to={`/investigacoes/${i.id}`}
                        className="flex items-center gap-1 text-xs text-driven-gold hover:text-yellow-600 font-medium transition-colors"
                      >
                        Ver <ChevronRight size={12} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
