import { useState, useEffect, useMemo } from 'react'
import { ArrowLeftRight, TrendingUp, ShieldAlert, Activity } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts'
import { transactionsAPI } from '../services/api.js'
import ScoreBadge from '../components/ScoreBadge.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import EmptyState from '../components/EmptyState.jsx'

const COLORS = ['#2D5FA6', '#C9A84C', '#2D7D52', '#D97B2B', '#D94040', '#8C8470']

const FEED_COLS = ['Código', 'Cliente / Estab.', 'Tipo', 'Canal', 'Valor', 'Score', 'Status', 'Data']

function formatBRL(v) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0)
}

function formatBRLShort(v) {
  if (v >= 1_000_000) return `R$ ${(v / 1_000_000).toFixed(1)}M`
  if (v >= 1_000) return `R$ ${(v / 1_000).toFixed(0)}k`
  return formatBRL(v)
}

export default function Transactions() {
  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    transactionsAPI.list({ limit: 50 })
      .then(r => { setItems(r.data.items); setTotal(r.data.total) })
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [])

  const metrics = useMemo(() => {
    const volume = items.reduce((s, t) => s + (t.amount || 0), 0)
    const avgScore = items.length
      ? Math.round(items.reduce((s, t) => s + Number(t.risk_score || 0), 0) / items.length)
      : 0
    const blocked = items.filter(t => t.status === 'Bloqueada').length
    return { volume, avgScore, blocked }
  }, [items])

  const byChannel = useMemo(() => {
    const map = {}
    items.forEach(t => { map[t.channel || 'Outros'] = (map[t.channel || 'Outros'] || 0) + 1 })
    return Object.entries(map).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count)
  }, [items])

  const byType = useMemo(() => {
    const map = {}
    items.forEach(t => { map[t.tx_type || 'Outros'] = (map[t.tx_type || 'Outros'] || 0) + 1 })
    return Object.entries(map).map(([name, value]) => ({ name, value }))
  }, [items])

  if (loading) return <LoadingSpinner text="Carregando transações..." />
  if (items.length === 0) return <EmptyState title="Nenhuma transação encontrada" />

  return (
    <div className="space-y-3">
      <div className="card px-3 py-2 flex flex-wrap items-stretch divide-x divide-driven-border-light">
        {[
          { icon: ArrowLeftRight, label: 'Volume', value: formatBRLShort(metrics.volume), color: 'text-driven-info' },
          { icon: TrendingUp, label: 'Score médio', value: metrics.avgScore, color: 'text-driven-gold' },
          { icon: ShieldAlert, label: 'Bloqueadas', value: metrics.blocked, color: 'text-driven-danger' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="flex items-center gap-2 px-4 first:pl-0 last:pr-0 min-w-[140px] flex-1">
            <Icon size={13} className={color} />
            <div className="leading-tight">
              <p className="text-[10px] uppercase tracking-wide text-driven-muted font-medium">{label}</p>
              <p className={`text-sm font-display font-bold ${color}`}>{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
        <div className="card p-3">
          <p className="text-[10px] uppercase tracking-wide font-semibold text-driven-muted mb-1.5">Volume por Canal</p>
          <div className="h-28">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byChannel} layout="vertical" margin={{ left: 0, right: 8, top: 0, bottom: 0 }}>
                <XAxis type="number" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" width={88} tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 11, padding: '4px 8px' }} />
                <Bar dataKey="count" fill="#2D5FA6" radius={[0, 2, 2, 0]} barSize={10} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-3">
          <p className="text-[10px] uppercase tracking-wide font-semibold text-driven-muted mb-1.5">Distribuição por Tipo</p>
          <div className="h-28 flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={byType}
                  dataKey="value"
                  nameKey="name"
                  cx="42%"
                  cy="50%"
                  innerRadius={22}
                  outerRadius={40}
                  paddingAngle={2}
                  stroke="none"
                >
                  {byType.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 11, padding: '4px 8px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-0.5 pl-1">
              {byType.map((t, i) => (
                <div key={t.name} className="flex items-center gap-1.5 text-[10px]">
                  <span className="w-1.5 h-1.5 rounded-full flex-none" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-driven-text-secondary truncate flex-1">{t.name}</span>
                  <span className="font-semibold text-driven-text tabular-nums">{t.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="px-3 py-1.5 border-b border-driven-border bg-driven-cream/60 flex items-center gap-2">
          <Activity size={12} className="text-driven-gold" />
          <span className="text-xs font-semibold text-driven-text">Feed de Transações</span>
          <span className="text-[10px] text-driven-muted tabular-nums">{total} registros</span>
        </div>
        <div className="overflow-x-auto max-h-[calc(100vh-240px)] overflow-y-auto">
          <table className="w-full min-w-[900px]">
            <thead className="sticky top-0 z-10 bg-driven-cream border-b border-driven-border">
              <tr>
                {FEED_COLS.map(h => (
                  <th
                    key={h}
                    className={`px-2 py-1.5 text-left text-[10px] font-semibold text-driven-muted uppercase tracking-wide whitespace-nowrap ${
                      ['Valor', 'Score', 'Status'].includes(h) ? 'text-right' : ''
                    } ${h === 'Score' ? 'text-center' : ''}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-driven-border-light">
              {items.map(t => (
                <tr
                  key={t.id}
                  className="hover:bg-driven-info-light/25 transition-colors group"
                >
                  <td className="px-2 py-1 font-mono text-[11px] font-bold text-driven-info whitespace-nowrap">
                    {t.transaction_code}
                  </td>
                  <td className="px-2 py-1 max-w-[200px]">
                    <p className="text-[11px] font-medium text-driven-text truncate">{t.user_name || '—'}</p>
                    <p className="text-[10px] text-driven-muted truncate">{t.merchant || '—'}</p>
                  </td>
                  <td className="px-2 py-1 text-[11px] text-driven-text-secondary whitespace-nowrap">{t.tx_type}</td>
                  <td className="px-2 py-1 text-[11px] text-driven-muted whitespace-nowrap">{t.channel || '—'}</td>
                  <td className="px-2 py-1 text-[11px] font-semibold text-driven-text text-right whitespace-nowrap tabular-nums">
                    {formatBRL(t.amount)}
                  </td>
                  <td className="px-2 py-1 text-center">
                    <ScoreBadge score={t.risk_score} compact />
                  </td>
                  <td className="px-2 py-1 text-right">
                    <StatusBadge status={t.status} compact />
                  </td>
                  <td className="px-2 py-1 text-[10px] text-driven-muted text-right whitespace-nowrap tabular-nums">
                    {new Date(t.created_at).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
