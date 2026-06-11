import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Filter, Search, Bell, AlertTriangle, Clock, ChevronRight, TrendingUp } from 'lucide-react'
import { alertsAPI } from '../services/api.js'
import ScoreBadge from '../components/ScoreBadge.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import AnimatedCounter from '../components/AnimatedCounter.jsx'
import TableSkeleton from '../components/TableSkeleton.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { useTableSort } from '../hooks/useTableSort.js'

const FRAUD_CATEGORIES = [
  'Lavagem de Dinheiro',
  'Cadastro Suspeito',
  'Fraude Transacional',
  'Comportamento Atípico',
  'Outros',
]

const FRAUD_TYPES = ['Todos', ...FRAUD_CATEGORIES]
const STATUSES = ['Todos', 'Novo', 'Em análise', 'Encerrado']

function formatBRL(v) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0)
}

function formatBRLShort(v) {
  if (v >= 1_000_000) return `R$ ${(v / 1_000_000).toFixed(1)}M`
  if (v >= 1_000) return `R$ ${(v / 1_000).toFixed(0)}k`
  return formatBRL(v)
}

function scoreRowBg(score) {
  const s = Number(score)
  if (s >= 85) return 'bg-driven-danger/[0.05]'
  if (s >= 70) return 'bg-driven-warning/[0.04]'
  return ''
}

function scoreAccent(score) {
  const s = Number(score)
  if (s >= 85) return 'border-l-driven-danger'
  if (s >= 70) return 'border-l-driven-warning'
  if (s >= 50) return 'border-l-driven-gold'
  return 'border-l-driven-success'
}

export default function Alerts() {
  const [alerts, setAlerts] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('Todos')
  const [typeFilter, setTypeFilter] = useState('Todos')
  const [search, setSearch] = useState('')
  const [selectedRow, setSelectedRow] = useState(null)

  useEffect(() => {
    setLoading(true)
    alertsAPI.list({ limit: 50 })
      .then(r => { setAlerts(r.data.items); setTotal(r.data.total) })
      .catch(() => setAlerts([]))
      .finally(() => setLoading(false))
  }, [])

  const baseFiltered = useMemo(() => alerts.filter(a => {
    const matchStatus = statusFilter === 'Todos' || a.status === statusFilter
    const matchSearch = !search || (
      a.alert_code.toLowerCase().includes(search.toLowerCase()) ||
      a.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      a.fraud_type.toLowerCase().includes(search.toLowerCase())
    )
    return matchStatus && matchSearch
  }), [alerts, statusFilter, search])

  const filtered = useMemo(() => typeFilter === 'Todos'
    ? baseFiltered
    : baseFiltered.filter(a => a.fraud_type === typeFilter),
  [baseFiltered, typeFilter])

  const { sorted: sortedFiltered, toggleSort, sortIndicator } = useTableSort(filtered, 'created_at', 'desc')

  const stats = useMemo(() => ({
    novos: alerts.filter(a => a.status === 'Novo').length,
    analise: alerts.filter(a => a.status === 'Em análise').length,
    criticos: alerts.filter(a => Number(a.risk_score) >= 85).length,
    volume: alerts.reduce((s, a) => s + (a.amount || 0), 0),
  }), [alerts])

  const fraudSummary = useMemo(() => {
    const pool = baseFiltered
    const poolTotal = pool.length || 1
    const rows = FRAUD_CATEGORIES.map(cat => {
      const items = pool.filter(a => a.fraud_type === cat)
      const count = items.length
      const volume = items.reduce((s, a) => s + (a.amount || 0), 0)
      const avgScore = count
        ? Math.round(items.reduce((s, a) => s + Number(a.risk_score || 0), 0) / count)
        : 0
      return { cat, count, volume, avgScore, pct: Math.round((count / poolTotal) * 100) }
    })
    const active = rows.filter(r => r.count > 0)
    const maxCount = Math.max(...active.map(r => r.count), 0)
    const maxVolume = Math.max(...active.map(r => r.volume), 0)
    const maxScore = Math.max(...active.map(r => r.avgScore), 0)
    return rows.map(r => ({
      ...r,
      isDominant: r.count > 0 && r.count === maxCount,
      isHighestValue: r.count > 0 && r.volume === maxVolume,
      isHighestRisk: r.count > 0 && r.avgScore === maxScore,
    }))
  }, [baseFiltered])

  return (
    <div className="space-y-3 page-enter">
      <div className="card-interactive px-3 py-2 flex flex-wrap items-stretch divide-x divide-driven-border-light shadow-sm">
        {[
          { icon: Bell, label: 'Total', value: total, numeric: total, color: 'text-driven-info' },
          { icon: AlertTriangle, label: 'Críticos', value: stats.criticos, numeric: stats.criticos, color: 'text-driven-danger' },
          { icon: Clock, label: 'Novos', value: stats.novos, numeric: stats.novos, color: 'text-driven-warning' },
          { icon: TrendingUp, label: 'Volume', value: formatBRLShort(stats.volume), numeric: stats.volume, color: 'text-driven-gold', format: formatBRLShort },
        ].map(({ icon: Icon, label, numeric, color, format }) => (
          <div key={label} className="flex items-center gap-2 px-3 first:pl-0 last:pr-0 min-w-[110px] flex-1 transition-transform duration-200 hover:scale-[1.02]">
            <Icon size={12} className={color} />
            <div className="leading-tight">
              <p className="text-[10px] uppercase tracking-wide text-driven-muted font-medium">{label}</p>
              <p className={`text-sm font-display font-bold tabular-nums ${color}`}>
                <AnimatedCounter value={numeric} formatter={format} />
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="card overflow-hidden shadow-sm">
        <div className="px-3 py-1.5 border-b border-driven-border bg-driven-cream/70 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Filter size={12} className="text-driven-gold" />
            <span className="text-xs font-semibold text-driven-text">Resumo por Tipo de Fraude</span>
            <span className="text-[10px] text-driven-muted">clique para filtrar</span>
          </div>
          {typeFilter !== 'Todos' && (
            <button
              type="button"
              onClick={() => setTypeFilter('Todos')}
              className="text-[10px] text-driven-gold font-semibold hover:underline transition-all active:scale-95"
            >
              Limpar filtro · {typeFilter}
            </button>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead className="bg-driven-cream border-b border-driven-border">
              <tr>
                {['Categoria', 'Alertas', 'Valor Total', 'Score Médio', '% do Total', 'Indicadores'].map(h => (
                  <th
                    key={h}
                    className={`px-2 py-1.5 text-left text-[10px] font-semibold text-driven-muted uppercase tracking-wide whitespace-nowrap ${
                      ['Alertas', 'Score Médio', '% do Total'].includes(h) ? 'text-center' : ''
                    } ${h === 'Valor Total' ? 'text-right' : ''}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-driven-border-light">
              {fraudSummary.map(row => (
                <tr
                  key={row.cat}
                  onClick={() => setTypeFilter(typeFilter === row.cat ? 'Todos' : row.cat)}
                  className={`cursor-pointer transition-all duration-200 hover:bg-driven-gold-pale/40 active:scale-[0.99] ${
                    typeFilter === row.cat ? 'bg-driven-gold-pale/60 ring-1 ring-inset ring-driven-gold/20' : ''
                  }`}
                >
                  <td className="px-2 py-1.5">
                    <span className="text-[11px] font-semibold text-driven-text">{row.cat}</span>
                  </td>
                  <td className="px-2 py-1.5 text-center">
                    <span className="text-[11px] font-bold text-driven-text tabular-nums">{row.count}</span>
                  </td>
                  <td className="px-2 py-1.5 text-right">
                    <span className="text-[11px] font-semibold text-driven-text tabular-nums">{formatBRLShort(row.volume)}</span>
                  </td>
                  <td className="px-2 py-1.5 text-center">
                    <ScoreBadge score={row.avgScore || 0} compact />
                  </td>
                  <td className="px-2 py-1.5 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <div className="w-12 h-1 bg-driven-border-light rounded-full overflow-hidden">
                        <div className="h-full bg-driven-info rounded-full transition-all duration-500 ease-out" style={{ width: `${row.pct}%` }} />
                      </div>
                      <span className="text-[10px] font-bold text-driven-muted tabular-nums w-7">{row.pct}%</span>
                    </div>
                  </td>
                  <td className="px-2 py-1.5">
                    <div className="flex flex-wrap gap-1">
                      {row.isDominant && (
                        <span className="text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded bg-driven-info/10 text-driven-info border border-driven-info/20">
                          Domina fila
                        </span>
                      )}
                      {row.isHighestValue && (
                        <span className="text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded bg-driven-gold/10 text-driven-gold border border-driven-gold/20">
                          Maior valor
                        </span>
                      )}
                      {row.isHighestRisk && (
                        <span className="text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded bg-driven-danger/10 text-driven-danger border border-driven-danger/20">
                          Maior risco
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card overflow-hidden shadow-sm">
        <div className="px-3 py-1.5 border-b border-driven-border bg-driven-cream/70 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Bell size={12} className="text-driven-gold" />
            <span className="text-xs font-semibold text-driven-text">Fila de Triagem</span>
            <span className="text-[10px] text-driven-muted tabular-nums">{filtered.length}/{total}</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <div className="relative">
              <Search size={11} className="absolute left-2 top-1/2 -translate-y-1/2 text-driven-muted" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar..."
                className="pl-6 pr-2 py-1 text-[11px] border border-driven-border rounded-md bg-white input-interactive w-36"
              />
            </div>
            <div className="flex gap-0.5">
              {STATUSES.map(s => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`btn-filter ${statusFilter === s ? 'btn-filter-active' : 'btn-filter-idle'}`}
                >
                  {s}
                </button>
              ))}
            </div>
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className="text-[11px] px-2 py-1 border border-driven-border rounded-md bg-white input-interactive text-driven-text-secondary"
            >
              {FRAUD_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
        </div>

        {loading ? (
          <TableSkeleton rows={8} cols={7} />
        ) : filtered.length === 0 ? (
          <EmptyState title="Nenhum alerta encontrado" description="Tente ajustar os filtros." />
        ) : (
          <div className="overflow-x-auto max-h-[calc(100vh-340px)] overflow-y-auto bg-driven-cream/20">
            <table className="w-full min-w-[900px]">
              <thead className="sticky top-0 z-10 bg-driven-cream border-b border-driven-border shadow-sm">
                <tr>
                  {[
                    { h: 'Score', key: 'risk_score' },
                    { h: 'Tipo', key: 'fraud_type' },
                    { h: 'Cliente', key: null },
                    { h: 'Valor', key: 'amount' },
                    { h: 'Localização', key: null },
                    { h: 'Status', key: 'status' },
                    { h: 'Data', key: 'created_at' },
                    { h: '', key: null },
                  ].map(({ h, key }) => (
                    <th
                      key={h || 'action'}
                      onClick={key ? () => toggleSort(key) : undefined}
                      className={`px-2 py-1.5 text-left text-[10px] font-semibold text-driven-muted uppercase tracking-wide whitespace-nowrap ${
                        ['Score', 'Status'].includes(h) ? 'text-center' : ''
                      } ${h === 'Valor' ? 'text-right' : ''} ${h === '' ? 'w-8' : ''} ${key ? 'cursor-pointer hover:text-driven-gold transition-colors select-none' : ''}`}
                    >
                      {h}{key ? ` ${sortIndicator(key)}` : ''}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-driven-border-light">
                {sortedFiltered.map(a => (
                  <tr
                    key={a.id}
                    onClick={() => setSelectedRow(selectedRow === a.id ? null : a.id)}
                    className={`border-l-2 ${scoreAccent(a.risk_score)} table-row-interactive group ${scoreRowBg(a.risk_score)} ${selectedRow === a.id ? 'table-row-selected' : ''}`}
                  >
                    <td className="px-2 py-1 text-center align-middle">
                      <ScoreBadge score={a.risk_score} compact />
                    </td>
                    <td className="px-2 py-1 align-middle">
                      <p className="text-[11px] font-semibold text-driven-text leading-tight truncate max-w-[160px]">{a.fraud_type}</p>
                      <p className="font-mono text-[10px] text-driven-muted leading-tight">{a.alert_code}</p>
                    </td>
                    <td className="px-2 py-1 align-middle">
                      <p className="text-[11px] font-medium text-driven-text truncate max-w-[140px]">{a.user?.name || '—'}</p>
                    </td>
                    <td className="px-2 py-1 text-right align-middle">
                      <span className="text-[11px] font-semibold text-driven-text tabular-nums whitespace-nowrap">{formatBRL(a.amount)}</span>
                    </td>
                    <td className="px-2 py-1 align-middle">
                      <span className="text-[10px] text-driven-muted truncate max-w-[120px] block">{a.location || '—'}</span>
                    </td>
                    <td className="px-2 py-1 text-center align-middle">
                      <StatusBadge status={a.status} compact />
                    </td>
                    <td className="px-2 py-1 align-middle">
                      <span className="text-[10px] text-driven-muted tabular-nums whitespace-nowrap">
                        {new Date(a.created_at).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
                      </span>
                    </td>
                    <td className="px-2 py-1 align-middle">
                      <Link
                        to={`/alertas/${a.id}`}
                        className="inline-flex items-center text-driven-gold hover:text-yellow-600 opacity-60 group-hover:opacity-100 transition-opacity"
                        title="Abrir alerta"
                      >
                        <ChevronRight size={14} />
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
