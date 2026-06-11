import { useState, useEffect, useMemo } from 'react'
import { Shield, Search } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts'
import { rulesAPI } from '../services/api.js'
import AnimatedCounter from '../components/AnimatedCounter.jsx'
import TableSkeleton from '../components/TableSkeleton.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { CHART_ANIMATION, CHART_TOOLTIP_STYLE, ChartTooltip } from '../utils/chartUtils.jsx'
import { useTableSort } from '../hooks/useTableSort.js'

const CATEGORIES = ['Todas', 'Transacional', 'Comportamento', 'Cadastro', 'Lavagem de Dinheiro']

const SEVERITY_LABELS = { LOW: 'Baixa', MEDIUM: 'Média', HIGH: 'Alta', CRITICAL: 'Crítica' }

const SEVERITY_STYLES = {
  LOW: { badge: 'bg-driven-success/15 text-driven-success border-driven-success/25', bar: '#2D7D52', dot: 'bg-driven-success' },
  MEDIUM: { badge: 'bg-driven-gold/15 text-driven-gold border-driven-gold/30', bar: '#C9A84C', dot: 'bg-driven-gold' },
  HIGH: { badge: 'bg-driven-warning/15 text-driven-warning border-driven-warning/25', bar: '#D97B2B', dot: 'bg-driven-warning' },
  CRITICAL: { badge: 'bg-driven-danger/15 text-driven-danger border-driven-danger/25', bar: '#D94040', dot: 'bg-driven-danger' },
}

function SeverityTag({ severity }) {
  const s = SEVERITY_STYLES[severity] || SEVERITY_STYLES.MEDIUM
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded border ${s.badge}`}>
      <span className={`w-1 h-1 rounded-full ${s.dot}`} />
      {SEVERITY_LABELS[severity] || severity}
    </span>
  )
}

function StatusTag({ active }) {
  return active ? (
    <span className="text-[10px] font-bold uppercase tracking-wide text-driven-success bg-driven-success/10 px-1.5 py-0.5 rounded border border-driven-success/20">
      Ativa
    </span>
  ) : (
    <span className="text-[10px] font-bold uppercase tracking-wide text-driven-muted bg-driven-cream px-1.5 py-0.5 rounded border border-driven-border">
      Inativa
    </span>
  )
}

export default function Rules() {
  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('Todas')
  const [statusFilter, setStatusFilter] = useState('Todas')
  const [selectedRow, setSelectedRow] = useState(null)

  useEffect(() => {
    rulesAPI.list({ limit: 50 })
      .then(r => { setItems(r.data.items); setTotal(r.data.total) })
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => items.filter(r => {
    const matchSearch = !search || (
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.rule_code.toLowerCase().includes(search.toLowerCase()) ||
      r.description?.toLowerCase().includes(search.toLowerCase())
    )
    const matchCategory = categoryFilter === 'Todas' || r.category === categoryFilter
    const matchStatus = statusFilter === 'Todas'
      || (statusFilter === 'Ativas' && r.is_active)
      || (statusFilter === 'Inativas' && !r.is_active)
    return matchSearch && matchCategory && matchStatus
  }), [items, search, categoryFilter, statusFilter])

  const { sorted: sortedFiltered, toggleSort, sortIndicator } = useTableSort(filtered, 'triggers_count', 'desc')

  const activeCount = items.filter(r => r.is_active).length
  const totalTriggers = items.reduce((sum, r) => sum + r.triggers_count, 0)
  const maxTriggers = Math.max(...items.map(r => r.triggers_count), 1)

  const chartData = useMemo(() =>
    [...filtered]
      .sort((a, b) => b.triggers_count - a.triggers_count)
      .slice(0, 6)
      .map(r => ({ name: r.rule_code, triggers: r.triggers_count, severity: r.severity })),
  [filtered])

  const byCategory = useMemo(() => {
    const map = {}
    items.forEach(r => { map[r.category] = (map[r.category] || 0) + 1 })
    return Object.entries(map).sort((a, b) => b[1] - a[1])
  }, [items])

  return (
    <div className="space-y-3 page-enter">
      <div className="card-interactive px-3 py-2 flex flex-wrap items-stretch divide-x divide-driven-border-light">
        {[
          { label: 'Total', value: total, color: 'text-driven-text' },
          { label: 'Ativas', value: activeCount, color: 'text-driven-success' },
          { label: 'Disparos', value: totalTriggers, color: 'text-driven-warning' },
        ].map(({ label, value, color }) => (
          <div key={label} className="flex items-baseline gap-2 px-4 first:pl-0 last:pr-0 min-w-[100px] flex-1 transition-transform duration-200 hover:scale-[1.02]">
            <p className="text-[10px] uppercase tracking-wide text-driven-muted font-medium">{label}</p>
            <p className={`text-sm font-display font-bold tabular-nums ${color}`}>
              <AnimatedCounter value={value} />
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
        <div className="card-interactive p-3">
          <p className="text-[10px] uppercase tracking-wide font-semibold text-driven-muted mb-1.5">Top Disparos</p>
          <div className="h-28">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 0, bottom: 0, left: -20, right: 4 }}>
                <XAxis dataKey="name" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9 }} axisLine={false} tickLine={false} width={28} />
                <Tooltip content={<ChartTooltip />} contentStyle={CHART_TOOLTIP_STYLE} />
                <Bar dataKey="triggers" radius={[2, 2, 0, 0]} barSize={14} {...CHART_ANIMATION}>
                  {chartData.map((entry, i) => (
                    <Cell key={i} fill={SEVERITY_STYLES[entry.severity]?.bar || '#8C8470'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-interactive p-3">
          <p className="text-[10px] uppercase tracking-wide font-semibold text-driven-muted mb-1.5">Por Categoria</p>
          <div className="space-y-1.5">
            {byCategory.map(([cat, count]) => (
              <div key={cat} className="flex items-center gap-2 group cursor-default">
                <span className="text-[10px] text-driven-text-secondary w-28 truncate group-hover:text-driven-text transition-colors">{cat}</span>
                <div className="flex-1 h-1 bg-driven-border-light rounded-full overflow-hidden">
                  <div className="h-full bg-driven-gold rounded-full transition-all duration-500 ease-out" style={{ width: `${(count / total) * 100}%` }} />
                </div>
                <span className="text-[10px] font-bold text-driven-text tabular-nums w-4 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="px-3 py-1.5 border-b border-driven-border bg-driven-cream/60 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Shield size={12} className="text-driven-gold" />
            <span className="text-xs font-semibold text-driven-text">Catálogo de Regras</span>
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
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="text-[11px] px-2 py-1 border border-driven-border rounded-md bg-white input-interactive text-driven-text-secondary"
            >
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
            <div className="flex gap-0.5">
              {['Todas', 'Ativas', 'Inativas'].map(s => (
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
          </div>
        </div>

        {loading ? (
          <TableSkeleton rows={8} cols={6} />
        ) : filtered.length === 0 ? (
          <EmptyState title="Nenhuma regra encontrada" description="Tente ajustar os filtros." />
        ) : (
          <div className="overflow-x-auto max-h-[calc(100vh-240px)] overflow-y-auto">
            <table className="w-full min-w-[820px]">
              <thead className="sticky top-0 z-10 bg-driven-cream border-b border-driven-border">
                <tr>
                  {[
                    { h: 'Código', key: 'rule_code' },
                    { h: 'Regra', key: 'name' },
                    { h: 'Categoria', key: 'category' },
                    { h: 'Severidade', key: 'severity' },
                    { h: 'Status', key: null },
                    { h: 'Disparos', key: 'triggers_count' },
                  ].map(({ h, key }) => (
                    <th
                      key={h}
                      onClick={key ? () => toggleSort(key) : undefined}
                      className={`px-2 py-1.5 text-left text-[10px] font-semibold text-driven-muted uppercase tracking-wide whitespace-nowrap ${
                        ['Severidade', 'Status', 'Disparos'].includes(h) ? 'text-center' : ''
                      } ${key ? 'cursor-pointer hover:text-driven-gold transition-colors select-none' : ''}`}
                    >
                      {h}{key ? ` ${sortIndicator(key)}` : ''}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-driven-border-light">
                {sortedFiltered.map(r => {
                  const sev = SEVERITY_STYLES[r.severity] || SEVERITY_STYLES.MEDIUM
                  return (
                    <tr
                      key={r.id}
                      onClick={() => setSelectedRow(selectedRow === r.id ? null : r.id)}
                      className={`table-row-interactive hover:bg-driven-gold-pale/30 ${selectedRow === r.id ? 'table-row-selected' : ''}`}
                    >
                      <td className="px-2 py-1.5 font-mono text-[11px] font-bold text-driven-info whitespace-nowrap align-top">
                        {r.rule_code}
                      </td>
                      <td className="px-2 py-1.5 max-w-[280px] align-top">
                        <p className="text-[11px] font-semibold text-driven-text leading-tight truncate">{r.name}</p>
                        <p className="text-[10px] text-driven-muted leading-tight truncate mt-0.5">{r.description || '—'}</p>
                      </td>
                      <td className="px-2 py-1.5 text-[10px] text-driven-text-secondary whitespace-nowrap align-top">
                        {r.category}
                      </td>
                      <td className="px-2 py-1.5 text-center align-top">
                        <SeverityTag severity={r.severity} />
                      </td>
                      <td className="px-2 py-1.5 text-center align-top">
                        <StatusTag active={r.is_active} />
                      </td>
                      <td className="px-2 py-1.5 align-top">
                        <div className="flex items-center gap-2 min-w-[120px]">
                          <span className="text-[11px] font-bold text-driven-text tabular-nums w-7 text-right">
                            {r.triggers_count}
                          </span>
                          <div className="flex-1 h-1 bg-driven-border-light rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500 ease-out"
                              style={{
                                width: `${(r.triggers_count / maxTriggers) * 100}%`,
                                backgroundColor: sev.bar,
                              }}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
