import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Filter, Search, ChevronRight } from 'lucide-react'
import { alertsAPI } from '../services/api.js'
import { useDateRange } from '../context/DateRangeContext.jsx'
import { isWithinDateRange } from '../utils/dateRange.js'
import ScoreBadge from '../components/ScoreBadge.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import EmptyState from '../components/EmptyState.jsx'

const FRAUD_TYPES = ['Todos', 'Fraude Transacional', 'Lavagem de Dinheiro', 'Cadastro Suspeito', 'Comportamento Atípico', 'Outros']
const STATUSES = ['Todos', 'Novo', 'Em análise', 'Encerrado']

function formatBRL(v) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0)
}

export default function Alerts() {
  const [alerts, setAlerts] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('Todos')
  const [typeFilter, setTypeFilter] = useState('Todos')
  const [search, setSearch] = useState('')
  const { startDate, endDate } = useDateRange()

  useEffect(() => {
    setLoading(true)
    const params = {
      limit: 30,
      ...(statusFilter !== 'Todos' && { status: statusFilter }),
      ...(typeFilter !== 'Todos' && { fraud_type: typeFilter }),
    }
    alertsAPI.list(params)
      .then(r => { setAlerts(r.data.items); setTotal(r.data.total) })
      .catch(() => setAlerts([]))
      .finally(() => setLoading(false))
  }, [statusFilter, typeFilter])

  const filtered = alerts.filter(a => {
    const matchSearch = !search || (
      a.alert_code.toLowerCase().includes(search.toLowerCase()) ||
      a.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      a.fraud_type.toLowerCase().includes(search.toLowerCase())
    )
    const matchDate = isWithinDateRange(a.created_at, startDate, endDate)
    return matchSearch && matchDate
  })

  return (
    <div className="space-y-5">
      {/* Header + filters */}
      <div className="card p-4">
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-driven-muted" />
            <span className="text-sm font-semibold text-driven-text">Filtros</span>
            <span className="text-xs text-driven-muted ml-1">({filtered.length} de {total} alertas)</span>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            {/* Search */}
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-driven-muted" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar..."
                className="pl-8 pr-3 py-1.5 text-xs border border-driven-border rounded-lg bg-driven-cream focus:outline-none focus:border-driven-gold/60 w-40"
              />
            </div>
            {/* Status filter */}
            <div className="flex gap-1">
              {STATUSES.map(s => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`text-xs px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
                    statusFilter === s
                      ? 'bg-driven-gold text-white'
                      : 'bg-driven-cream border border-driven-border text-driven-text-secondary hover:bg-driven-border-light'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            {/* Type filter */}
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className="text-xs px-2.5 py-1.5 border border-driven-border rounded-lg bg-driven-cream focus:outline-none focus:border-driven-gold/60 text-driven-text-secondary"
            >
              {FRAUD_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <LoadingSpinner text="Carregando alertas..." />
        ) : filtered.length === 0 ? (
          <EmptyState title="Nenhum alerta encontrado" description="Tente ajustar os filtros." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-driven-cream border-b border-driven-border">
                <tr>
                  {['ID Alerta', 'Tipo de Fraude', 'Cliente', 'Score', 'Valor', 'Localização', 'Data', 'Status', ''].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-driven-muted whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-driven-border-light">
                {filtered.map(a => (
                  <tr key={a.id} className="hover:bg-driven-cream/50 transition-colors">
                    <td className="px-4 py-3.5">
                      <span className="font-mono text-xs font-bold text-driven-info">{a.alert_code}</span>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-driven-text-secondary whitespace-nowrap">{a.fraud_type}</td>
                    <td className="px-4 py-3.5 text-xs font-medium text-driven-text whitespace-nowrap">{a.user?.name || '—'}</td>
                    <td className="px-4 py-3.5"><ScoreBadge score={a.risk_score} /></td>
                    <td className="px-4 py-3.5 text-xs font-medium text-driven-text whitespace-nowrap">{formatBRL(a.amount)}</td>
                    <td className="px-4 py-3.5 text-xs text-driven-muted whitespace-nowrap">{a.location || '—'}</td>
                    <td className="px-4 py-3.5 text-xs text-driven-muted whitespace-nowrap">
                      {new Date(a.created_at).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
                    </td>
                    <td className="px-4 py-3.5"><StatusBadge status={a.status} /></td>
                    <td className="px-4 py-3.5">
                      <Link
                        to={`/alertas/${a.id}`}
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
