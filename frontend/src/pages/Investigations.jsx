import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Search, ClipboardList, ChevronRight, AlertTriangle, Activity, CheckCircle2 } from 'lucide-react'
import { investigationsAPI } from '../services/api.js'
import ScoreBadge from '../components/ScoreBadge.jsx'
import AnimatedCounter from '../components/AnimatedCounter.jsx'
import TableSkeleton from '../components/TableSkeleton.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { useTableSort } from '../hooks/useTableSort.js'

const STATUS_FILTERS = ['Todas', 'Em andamento', 'Concluída', 'Arquivada']

const STATUS_META = {
  'Em andamento': { dot: 'bg-driven-warning', text: 'text-driven-warning', bg: 'bg-driven-warning/10' },
  'Concluída': { dot: 'bg-driven-success', text: 'text-driven-success', bg: 'bg-driven-success/10' },
  'Arquivada': { dot: 'bg-driven-muted', text: 'text-driven-muted', bg: 'bg-driven-cream' },
}

const PRIORITY_STYLES = {
  CRITICAL: { accent: 'border-l-driven-danger', tag: 'text-driven-danger bg-driven-danger/10 border-driven-danger/20' },
  HIGH: { accent: 'border-l-driven-warning', tag: 'text-driven-warning bg-driven-warning/10 border-driven-warning/20' },
  MEDIUM: { accent: 'border-l-driven-gold', tag: 'text-driven-gold bg-driven-gold/10 border-driven-gold/20' },
  LOW: { accent: 'border-l-driven-success', tag: 'text-driven-success bg-driven-success/10 border-driven-success/20' },
}

function PriorityTag({ priority }) {
  const s = PRIORITY_STYLES[priority] || PRIORITY_STYLES.MEDIUM
  return (
    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${s.tag}`}>
      {priority}
    </span>
  )
}

function StatusLabel({ status }) {
  const m = STATUS_META[status] || STATUS_META['Arquivada']
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] text-driven-muted ${m.text}`}>
      <span className={`w-1 h-1 rounded-full ${m.dot}`} />
      {status}
    </span>
  )
}

function scoreRowBg(score) {
  const s = Number(score)
  if (s >= 85) return 'bg-driven-danger/[0.04]'
  if (s >= 70) return 'bg-driven-warning/[0.04]'
  return ''
}

export default function Investigations() {
  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('Todas')
  const [selectedRow, setSelectedRow] = useState(null)

  useEffect(() => {
    investigationsAPI.list({ limit: 50 })
      .then(r => { setItems(r.data.items); setTotal(r.data.total) })
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [])

  const metrics = useMemo(() => ({
    andamento: items.filter(i => i.status === 'Em andamento').length,
    concluidas: items.filter(i => i.status === 'Concluída').length,
    criticas: items.filter(i => i.priority === 'CRITICAL' || Number(i.risk_score) >= 85).length,
  }), [items])

  const filtered = useMemo(() => items.filter(i => {
    const matchSearch = !search || (
      i.investigation_code.toLowerCase().includes(search.toLowerCase()) ||
      i.alert_code?.toLowerCase().includes(search.toLowerCase()) ||
      i.user_name?.toLowerCase().includes(search.toLowerCase()) ||
      i.fraud_type?.toLowerCase().includes(search.toLowerCase())
    )
    const matchStatus = statusFilter === 'Todas' || i.status === statusFilter
    return matchSearch && matchStatus
  }), [items, search, statusFilter])

  const { sorted: sortedFiltered, toggleSort, sortIndicator } = useTableSort(filtered, 'created_at', 'desc')

  const statusCounts = useMemo(() => {
    const base = search
      ? items.filter(i =>
          i.investigation_code.toLowerCase().includes(search.toLowerCase()) ||
          i.alert_code?.toLowerCase().includes(search.toLowerCase()) ||
          i.user_name?.toLowerCase().includes(search.toLowerCase()) ||
          i.fraud_type?.toLowerCase().includes(search.toLowerCase())
        )
      : items
    return {
      Todas: base.length,
      'Em andamento': base.filter(i => i.status === 'Em andamento').length,
      'Concluída': base.filter(i => i.status === 'Concluída').length,
      'Arquivada': base.filter(i => i.status === 'Arquivada').length,
    }
  }, [items, search])

  return (
    <div className="space-y-3 page-enter">
      <div className="card-interactive px-3 py-2 flex flex-wrap items-stretch divide-x divide-driven-border-light shadow-sm">
        {[
          { icon: ClipboardList, label: 'Total', value: total, color: 'text-driven-text' },
          { icon: Activity, label: 'Em andamento', value: metrics.andamento, color: 'text-driven-warning' },
          { icon: CheckCircle2, label: 'Concluídas', value: metrics.concluidas, color: 'text-driven-success' },
          { icon: AlertTriangle, label: 'Críticas', value: metrics.criticas, color: 'text-driven-danger' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="flex items-center gap-2 px-3 first:pl-0 last:pr-0 min-w-[120px] flex-1 transition-transform duration-200 hover:scale-[1.02]">
            <Icon size={12} className={color} />
            <div className="leading-tight">
              <p className="text-[10px] uppercase tracking-wide text-driven-muted font-medium">{label}</p>
              <p className={`text-sm font-display font-bold tabular-nums ${color}`}>
                <AnimatedCounter value={value} />
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="card overflow-hidden shadow-sm">
        <div className="px-3 py-1.5 border-b border-driven-border bg-driven-cream/70 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ClipboardList size={12} className="text-driven-gold" />
            <span className="text-xs font-semibold text-driven-text">Central Investigativa</span>
            <span className="text-[10px] text-driven-muted tabular-nums">{filtered.length}/{total}</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <div className="relative">
              <Search size={11} className="absolute left-2 top-1/2 -translate-y-1/2 text-driven-muted" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar caso, alerta, cliente..."
                className="pl-6 pr-2 py-1 text-[11px] border border-driven-border rounded-md bg-white input-interactive w-48"
              />
            </div>
            <div className="flex gap-0.5">
              {STATUS_FILTERS.map(s => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`btn-filter flex items-center gap-1 ${statusFilter === s ? 'btn-filter-active' : 'btn-filter-idle'}`}
                >
                  {s}
                  <span className={`tabular-nums ${statusFilter === s ? 'text-white/80' : 'text-driven-muted'}`}>
                    {statusCounts[s]}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <TableSkeleton rows={8} cols={8} />
        ) : filtered.length === 0 ? (
          <EmptyState title="Nenhuma investigação encontrada" description="Tente ajustar os filtros." />
        ) : (
          <div className="overflow-x-auto max-h-[calc(100vh-200px)] overflow-y-auto bg-driven-cream/20">
            <table className="w-full min-w-[960px]">
              <thead className="sticky top-0 z-10 bg-driven-cream border-b border-driven-border shadow-sm">
                <tr>
                  {[
                    { h: 'Caso', key: 'investigation_code' },
                    { h: 'Cliente', key: null },
                    { h: 'Tipo de Fraude', key: 'fraud_type' },
                    { h: 'Score', key: 'risk_score' },
                    { h: 'Prioridade', key: 'priority' },
                    { h: 'Status', key: 'status' },
                    { h: 'Analista', key: null },
                    { h: 'Data', key: 'created_at' },
                    { h: '', key: null },
                  ].map(({ h, key }) => (
                    <th
                      key={h || 'action'}
                      onClick={key ? () => toggleSort(key) : undefined}
                      className={`px-2 py-1.5 text-left text-[10px] font-semibold text-driven-muted uppercase tracking-wide whitespace-nowrap ${
                        ['Score', 'Prioridade', 'Status'].includes(h) ? 'text-center' : ''
                      } ${h === '' ? 'w-8' : ''} ${key ? 'cursor-pointer hover:text-driven-gold transition-colors select-none' : ''}`}
                    >
                      {h}{key ? ` ${sortIndicator(key)}` : ''}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-driven-border-light">
                {sortedFiltered.map(i => {
                  const pri = PRIORITY_STYLES[i.priority] || PRIORITY_STYLES.MEDIUM
                  return (
                    <tr
                      key={i.id}
                      onClick={() => setSelectedRow(selectedRow === i.id ? null : i.id)}
                      className={`border-l-2 ${pri.accent} table-row-interactive group ${scoreRowBg(i.risk_score)} ${selectedRow === i.id ? 'table-row-selected' : ''}`}
                    >
                      <td className="px-2 py-1 align-middle">
                        <p className="font-mono text-[10px] text-driven-muted leading-tight">{i.investigation_code}</p>
                        <p className="font-mono text-[10px] text-driven-info/80 leading-tight">{i.alert_code}</p>
                      </td>
                      <td className="px-2 py-1 align-middle">
                        <p className="text-[11px] font-semibold text-driven-text leading-tight truncate max-w-[160px]">
                          {i.user_name || '—'}
                        </p>
                      </td>
                      <td className="px-2 py-1 align-middle">
                        <p className="text-[11px] text-driven-text-secondary leading-tight truncate max-w-[180px]">
                          {i.fraud_type || '—'}
                        </p>
                      </td>
                      <td className="px-2 py-1 text-center align-middle">
                        <div className="inline-flex items-center justify-center min-w-[36px]">
                          <ScoreBadge score={i.risk_score} compact />
                        </div>
                      </td>
                      <td className="px-2 py-1 text-center align-middle">
                        <PriorityTag priority={i.priority} />
                      </td>
                      <td className="px-2 py-1 text-center align-middle">
                        <StatusLabel status={i.status} />
                      </td>
                      <td className="px-2 py-1 align-middle">
                        <span className="text-[10px] text-driven-muted truncate max-w-[90px] block">
                          {i.analyst || '—'}
                        </span>
                      </td>
                      <td className="px-2 py-1 align-middle">
                        <span className="text-[10px] text-driven-muted tabular-nums whitespace-nowrap">
                          {new Date(i.alert_created_at || i.created_at).toLocaleDateString('pt-BR')}
                        </span>
                      </td>
                      <td className="px-2 py-1 align-middle">
                        <Link
                          to={`/investigacoes/${i.id}`}
                          className="inline-flex items-center text-driven-gold hover:text-yellow-600 opacity-60 group-hover:opacity-100 transition-opacity"
                          title="Abrir investigação"
                        >
                          <ChevronRight size={14} />
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2">
        {Object.entries(STATUS_META).map(([status, meta]) => {
          const count = items.filter(i => i.status === status).length
          const pct = total ? Math.round((count / total) * 100) : 0
          return (
            <div key={status} className={`card-interactive px-3 py-1.5 flex items-center gap-2 shadow-sm ${meta.bg}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${meta.dot} animate-pulse`} />
              <span className={`text-[10px] font-semibold ${meta.text} flex-1`}>{status}</span>
              <span className="text-[10px] font-bold text-driven-text tabular-nums">{count}</span>
              <span className="text-[10px] text-driven-muted tabular-nums">{pct}%</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
