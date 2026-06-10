import { useState, useEffect } from 'react'
import { Users, Search } from 'lucide-react'
import { clientsAPI } from '../services/api.js'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import EmptyState from '../components/EmptyState.jsx'

const RISK_LEVELS = ['Todos', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL']

const RISK_LABELS = {
  LOW: 'Baixo',
  MEDIUM: 'Médio',
  HIGH: 'Alto',
  CRITICAL: 'Crítico',
}

function RiskLevelBadge({ level }) {
  const cls = {
    LOW: 'bg-driven-success-light text-driven-success',
    MEDIUM: 'bg-driven-gold-pale text-driven-gold',
    HIGH: 'bg-driven-warning-light text-driven-warning',
    CRITICAL: 'bg-driven-danger-light text-driven-danger',
  }[level] || 'bg-driven-cream text-driven-muted'

  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${cls}`}>
      {RISK_LABELS[level] || level}
    </span>
  )
}

export default function Clients() {
  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [riskFilter, setRiskFilter] = useState('Todos')
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

  return (
    <div className="space-y-5">
      <div className="card p-4">
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="flex items-center gap-2">
            <Users size={14} className="text-driven-gold" />
            <span className="text-sm font-semibold text-driven-text">Clientes Monitorados</span>
            <span className="text-xs text-driven-muted ml-1">({filtered.length} de {total} cadastros)</span>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-driven-muted" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar nome, e-mail ou CPF..."
                className="pl-8 pr-3 py-1.5 text-xs border border-driven-border rounded-lg bg-driven-cream focus:outline-none focus:border-driven-gold/60 w-52"
              />
            </div>
            <div className="flex gap-1">
              {RISK_LEVELS.map(level => (
                <button
                  key={level}
                  onClick={() => setRiskFilter(level)}
                  className={`text-xs px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
                    riskFilter === level
                      ? 'bg-driven-gold text-white'
                      : 'bg-driven-cream border border-driven-border text-driven-text-secondary hover:bg-driven-border-light'
                  }`}
                >
                  {level === 'Todos' ? 'Todos' : RISK_LABELS[level]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <LoadingSpinner text="Carregando clientes..." />
        ) : filtered.length === 0 ? (
          <EmptyState title="Nenhum cliente encontrado" description="Tente ajustar os filtros." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-driven-cream border-b border-driven-border">
                <tr>
                  {['Nome', 'E-mail', 'CPF/CNPJ', 'Telefone', 'Risco', 'Alertas', 'Transações', 'Status', 'Cadastro'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-driven-muted whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-driven-border-light">
                {filtered.map(c => (
                  <tr key={c.id} className="hover:bg-driven-cream/50 transition-colors">
                    <td className="px-4 py-3 text-xs font-medium text-driven-text whitespace-nowrap">{c.name}</td>
                    <td className="px-4 py-3 text-xs text-driven-text-secondary whitespace-nowrap">{c.email}</td>
                    <td className="px-4 py-3 font-mono text-xs text-driven-muted whitespace-nowrap">{c.document || '—'}</td>
                    <td className="px-4 py-3 text-xs text-driven-text-secondary whitespace-nowrap">{c.phone || '—'}</td>
                    <td className="px-4 py-3"><RiskLevelBadge level={c.risk_level} /></td>
                    <td className="px-4 py-3 text-xs font-semibold text-driven-text text-center">{c.alerts_count}</td>
                    <td className="px-4 py-3 text-xs font-semibold text-driven-text text-center">{c.transactions_count}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        c.is_active
                          ? 'bg-driven-success-light text-driven-success'
                          : 'bg-driven-danger-light text-driven-danger'
                      }`}>
                        {c.is_active ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-driven-muted whitespace-nowrap">
                      {new Date(c.created_at).toLocaleDateString('pt-BR')}
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
