import { useState, useEffect } from 'react'
import { Shield, Search } from 'lucide-react'
import { rulesAPI } from '../services/api.js'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import EmptyState from '../components/EmptyState.jsx'

const CATEGORIES = ['Todas', 'Transacional', 'Comportamento', 'Cadastro', 'Lavagem de Dinheiro']

const SEVERITY_LABELS = {
  LOW: 'Baixa',
  MEDIUM: 'Média',
  HIGH: 'Alta',
  CRITICAL: 'Crítica',
}

function SeverityBadge({ severity }) {
  const cls = {
    LOW: 'bg-driven-success-light text-driven-success',
    MEDIUM: 'bg-driven-gold-pale text-driven-gold',
    HIGH: 'bg-driven-warning-light text-driven-warning',
    CRITICAL: 'bg-driven-danger-light text-driven-danger',
  }[severity] || 'bg-driven-cream text-driven-muted'

  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${cls}`}>
      {SEVERITY_LABELS[severity] || severity}
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

  useEffect(() => {
    rulesAPI.list({ limit: 50 })
      .then(r => { setItems(r.data.items); setTotal(r.data.total) })
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = items.filter(r => {
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
  })

  const activeCount = items.filter(r => r.is_active).length

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-4">
          <p className="text-xs text-driven-muted">Total de regras</p>
          <p className="text-2xl font-bold text-driven-text mt-1">{total}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-driven-muted">Regras ativas</p>
          <p className="text-2xl font-bold text-driven-success mt-1">{activeCount}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-driven-muted">Disparos (30 dias)</p>
          <p className="text-2xl font-bold text-driven-warning mt-1">
            {items.reduce((sum, r) => sum + r.triggers_count, 0)}
          </p>
        </div>
      </div>

      <div className="card p-4">
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield size={14} className="text-driven-gold" />
            <span className="text-sm font-semibold text-driven-text">Regras Antifraude</span>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-driven-muted" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar regra..."
                className="pl-8 pr-3 py-1.5 text-xs border border-driven-border rounded-lg bg-driven-cream focus:outline-none focus:border-driven-gold/60 w-44"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="text-xs px-2.5 py-1.5 border border-driven-border rounded-lg bg-driven-cream focus:outline-none focus:border-driven-gold/60 text-driven-text-secondary"
            >
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
            <div className="flex gap-1">
              {['Todas', 'Ativas', 'Inativas'].map(s => (
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
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <LoadingSpinner text="Carregando regras..." />
        ) : filtered.length === 0 ? (
          <EmptyState title="Nenhuma regra encontrada" description="Tente ajustar os filtros." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-driven-cream border-b border-driven-border">
                <tr>
                  {['Código', 'Nome', 'Categoria', 'Severidade', 'Disparos', 'Status', 'Descrição'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-driven-muted whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-driven-border-light">
                {filtered.map(r => (
                  <tr key={r.id} className="hover:bg-driven-cream/50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs font-bold text-driven-info whitespace-nowrap">{r.rule_code}</td>
                    <td className="px-4 py-3 text-xs font-medium text-driven-text whitespace-nowrap">{r.name}</td>
                    <td className="px-4 py-3 text-xs text-driven-text-secondary whitespace-nowrap">{r.category}</td>
                    <td className="px-4 py-3"><SeverityBadge severity={r.severity} /></td>
                    <td className="px-4 py-3 text-xs font-semibold text-driven-text text-center">{r.triggers_count}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        r.is_active
                          ? 'bg-driven-success-light text-driven-success'
                          : 'bg-driven-cream text-driven-muted'
                      }`}>
                        {r.is_active ? 'Ativa' : 'Inativa'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-driven-muted max-w-xs truncate" title={r.description}>
                      {r.description || '—'}
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
