import { useState, useEffect, useMemo } from 'react'
import { Users, Search } from 'lucide-react'
import { clientsAPI } from '../services/api.js'
import AnimatedCounter from '../components/AnimatedCounter.jsx'
import { KpiSkeleton } from '../components/TableSkeleton.jsx'
import EmptyState from '../components/EmptyState.jsx'

const RISK_LEVELS = ['Todos', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL']

const RISK_LABELS = {
  LOW: 'Baixo',
  MEDIUM: 'Médio',
  HIGH: 'Alto',
  CRITICAL: 'Crítico',
}

const RISK_COLORS = {
  LOW: { bar: 'bg-driven-success', border: 'border-t-driven-success', text: 'text-driven-success', bg: 'bg-driven-success-light' },
  MEDIUM: { bar: 'bg-driven-gold', border: 'border-t-driven-gold', text: 'text-driven-gold', bg: 'bg-driven-gold-pale' },
  HIGH: { bar: 'bg-driven-warning', border: 'border-t-driven-warning', text: 'text-driven-warning', bg: 'bg-driven-warning-light' },
  CRITICAL: { bar: 'bg-driven-danger', border: 'border-t-driven-danger', text: 'text-driven-danger', bg: 'bg-driven-danger-light' },
}

function RiskMeter({ level }) {
  const pct = { LOW: 25, MEDIUM: 50, HIGH: 75, CRITICAL: 100 }[level] || 0
  const colors = RISK_COLORS[level] || RISK_COLORS.LOW
  return (
    <div className="w-full">
      <div className="flex justify-between text-[10px] text-driven-muted mb-1">
        <span>Nível de risco</span>
        <span className={`font-semibold ${colors.text}`}>{RISK_LABELS[level] || level}</span>
      </div>
      <div className="h-1.5 bg-driven-border-light rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ease-out ${colors.bar}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

function ClientAvatar({ name }) {
  const initials = (name || '?').split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
  return (
    <div className="w-10 h-10 rounded-full bg-driven-gold-pale border border-driven-gold/30 flex items-center justify-center text-sm font-bold text-driven-gold flex-none transition-transform duration-300 group-hover:scale-105">
      {initials}
    </div>
  )
}

export default function Clients() {
  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [riskFilter, setRiskFilter] = useState('Todos')
  const [selectedCard, setSelectedCard] = useState(null)

  useEffect(() => {
    clientsAPI.list({ limit: 50 })
      .then(r => { setItems(r.data.items); setTotal(r.data.total) })
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = items.filter(c => {
    const matchSearch = !search || (
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.document?.includes(search)
    )
    const matchRisk = riskFilter === 'Todos' || c.risk_level === riskFilter
    return matchSearch && matchRisk
  })

  const riskDistribution = useMemo(() => {
    const counts = { LOW: 0, MEDIUM: 0, HIGH: 0, CRITICAL: 0 }
    items.forEach(c => { if (counts[c.risk_level] !== undefined) counts[c.risk_level]++ })
    const max = Math.max(...Object.values(counts), 1)
    return Object.entries(counts).map(([level, count]) => ({ level, count, pct: (count / max) * 100 }))
  }, [items])

  if (loading) {
    return (
      <div className="space-y-5 page-enter">
        <KpiSkeleton count={4} />
      </div>
    )
  }

  return (
    <div className="space-y-5 page-enter">
      <div className="card-interactive p-5">
        <div className="flex items-center gap-2 mb-4">
          <Users size={14} className="text-driven-gold" />
          <span className="text-sm font-semibold text-driven-text">Mapa de Risco — Clientes</span>
          <span className="text-xs text-driven-muted">({total} cadastros)</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {riskDistribution.map(({ level, count, pct }) => {
            const colors = RISK_COLORS[level]
            const active = riskFilter === level
            return (
              <button
                type="button"
                key={level}
                onClick={() => setRiskFilter(active ? 'Todos' : level)}
                className={`rounded-lg p-3 text-left transition-all duration-200 hover:scale-[1.02] hover:shadow-card-hover ${colors.bg} ${active ? 'ring-2 ring-driven-gold/40 shadow-sm' : ''}`}
              >
                <p className={`text-xs font-semibold ${colors.text}`}>{RISK_LABELS[level]}</p>
                <p className="text-2xl font-display font-bold text-driven-text mt-1 tabular-nums">
                  <AnimatedCounter value={count} />
                </p>
                <div className="h-1 bg-white/60 rounded-full mt-2 overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-700 ease-out ${colors.bar}`} style={{ width: `${pct}%` }} />
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <div className="card-interactive p-4">
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <span className="text-sm font-semibold text-driven-text">Perfis Monitorados</span>
          <div className="flex flex-wrap gap-2 items-center">
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-driven-muted" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar nome, e-mail ou CPF..."
                className="pl-8 pr-3 py-1.5 text-xs border border-driven-border rounded-lg bg-driven-cream input-interactive w-52"
              />
            </div>
            <div className="flex gap-1">
              {RISK_LEVELS.map(level => (
                <button
                  type="button"
                  key={level}
                  onClick={() => setRiskFilter(level)}
                  className={`text-xs px-2.5 py-1.5 rounded-lg font-medium btn-filter ${riskFilter === level ? 'btn-filter-active' : 'btn-filter-idle'}`}
                >
                  {level === 'Todos' ? 'Todos' : RISK_LABELS[level]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="Nenhum cliente encontrado" description="Tente ajustar os filtros." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(c => {
            const colors = RISK_COLORS[c.risk_level] || RISK_COLORS.LOW
            const isSelected = selectedCard === c.id
            return (
              <div
                key={c.id}
                onClick={() => setSelectedCard(isSelected ? null : c.id)}
                className={`card-interactive p-4 border-t-4 ${colors.border} cursor-pointer group ${isSelected ? 'ring-2 ring-driven-gold/30 shadow-card-hover' : ''}`}
              >
                <div className="flex items-start gap-3 mb-4">
                  <ClientAvatar name={c.name} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-driven-text truncate">{c.name}</p>
                    <p className="text-xs text-driven-text-secondary truncate">{c.email}</p>
                    <p className="font-mono text-[10px] text-driven-muted mt-0.5">{c.document || '—'}</p>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full transition-colors ${colors.bg} ${colors.text}`}>
                    {c.is_active ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
                <RiskMeter level={c.risk_level} />
                <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-driven-border-light">
                  <div className="text-center">
                    <p className="text-lg font-bold text-driven-text tabular-nums">
                      <AnimatedCounter value={c.alerts_count} />
                    </p>
                    <p className="text-[10px] text-driven-muted">Alertas</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-driven-text tabular-nums">
                      <AnimatedCounter value={c.transactions_count} />
                    </p>
                    <p className="text-[10px] text-driven-muted">Transações</p>
                  </div>
                </div>
                <p className="text-[10px] text-driven-muted mt-3 text-right">
                  Cadastro: {new Date(c.created_at).toLocaleDateString('pt-BR')}
                </p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
