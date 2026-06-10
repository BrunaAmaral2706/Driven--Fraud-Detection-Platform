import { useState, useEffect } from 'react'
import { ArrowLeftRight } from 'lucide-react'
import { transactionsAPI } from '../services/api.js'
import { useDateRange } from '../context/DateRangeContext.jsx'
import { isWithinDateRange } from '../utils/dateRange.js'
import ScoreBadge from '../components/ScoreBadge.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import EmptyState from '../components/EmptyState.jsx'

function formatBRL(v) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0)
}

export default function Transactions() {
  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const { startDate, endDate } = useDateRange()

  useEffect(() => {
    transactionsAPI.list({ limit: 50 })
      .then(r => { setItems(r.data.items); setTotal(r.data.total) })
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = items.filter(t => isWithinDateRange(t.created_at, startDate, endDate))

  return (
    <div className="space-y-5">
      <div className="card p-4 flex items-center gap-2">
        <ArrowLeftRight size={14} className="text-driven-gold" />
        <span className="text-sm font-semibold text-driven-text">Transações Monitoradas</span>
        <span className="text-xs text-driven-muted ml-1">({filtered.length} de {total} registros)</span>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <LoadingSpinner text="Carregando transações..." />
        ) : filtered.length === 0 ? (
          <EmptyState title="Nenhuma transação encontrada" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-driven-cream border-b border-driven-border">
                <tr>
                  {['Código', 'Tipo', 'Cliente', 'Valor', 'Estabelecimento', 'Canal', 'Score', 'Status', 'Localização', 'Data'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-driven-muted whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-driven-border-light">
                {filtered.map(t => (
                  <tr key={t.id} className="hover:bg-driven-cream/50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-driven-info">{t.transaction_code}</td>
                    <td className="px-4 py-3 text-xs text-driven-text-secondary whitespace-nowrap">{t.tx_type}</td>
                    <td className="px-4 py-3 text-xs font-medium text-driven-text whitespace-nowrap">{t.user_name || '—'}</td>
                    <td className="px-4 py-3 text-xs font-semibold text-driven-text whitespace-nowrap">{formatBRL(t.amount)}</td>
                    <td className="px-4 py-3 text-xs text-driven-text-secondary whitespace-nowrap">{t.merchant || '—'}</td>
                    <td className="px-4 py-3 text-xs text-driven-text-secondary">{t.channel || '—'}</td>
                    <td className="px-4 py-3"><ScoreBadge score={t.risk_score} /></td>
                    <td className="px-4 py-3"><StatusBadge status={t.status} /></td>
                    <td className="px-4 py-3 text-xs text-driven-muted whitespace-nowrap">{t.location || '—'}</td>
                    <td className="px-4 py-3 text-xs text-driven-muted whitespace-nowrap">
                      {new Date(t.created_at).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
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
