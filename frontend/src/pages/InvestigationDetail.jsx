import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Clock, AlertCircle, Info, CheckCircle, XCircle } from 'lucide-react'
import { investigationsAPI } from '../services/api.js'
import ScoreBadge from '../components/ScoreBadge.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'

function formatBRL(v) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0)
}

const TIMELINE_ICONS = {
  warning: AlertCircle,
  danger: XCircle,
  alert: AlertCircle,
  info: Info,
  success: CheckCircle,
}

const TIMELINE_COLORS = {
  warning: 'text-driven-warning bg-driven-warning-light border-driven-warning/30',
  danger: 'text-driven-danger bg-driven-danger-light border-driven-danger/30',
  alert: 'text-driven-gold bg-driven-gold-pale border-driven-gold/30',
  info: 'text-driven-info bg-driven-info-light border-driven-info/30',
  success: 'text-driven-success bg-driven-success-light border-driven-success/30',
}

export default function InvestigationDetail() {
  const { id } = useParams()
  const [inv, setInv] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    investigationsAPI.get(id)
      .then(r => setInv(r.data))
      .catch(() => setInv(null))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <LoadingSpinner text="Carregando investigação..." />
  if (!inv) return (
    <div className="text-center py-16">
      <p className="text-driven-muted">Investigação não encontrada.</p>
      <Link to="/investigacoes" className="text-driven-gold text-sm mt-2 block">← Voltar</Link>
    </div>
  )

  const alert = inv.alert || {}
  const timeline = inv.timeline || []

  return (
    <div className="space-y-5 max-w-5xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-3">
        <Link to="/investigacoes" className="flex items-center gap-1.5 text-xs text-driven-muted hover:text-driven-text transition-colors">
          <ArrowLeft size={14} /> Investigações
        </Link>
        <span className="text-driven-border">/</span>
        <span className="text-xs font-mono font-bold text-driven-text">{inv.investigation_code}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="font-display font-bold text-driven-text text-xl">{inv.investigation_code}</h1>
            <StatusBadge status={inv.status} />
          </div>
          <p className="text-xs text-driven-muted">
            Analista: <strong>{inv.analyst || '—'}</strong> · Aberta em {new Date(inv.created_at).toLocaleDateString('pt-BR')} · Score: <ScoreBadge score={inv.risk_score} />
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Timeline */}
        <div className="lg:col-span-2 space-y-4">
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Clock size={14} className="text-driven-gold" />
              <h2 className="text-sm font-semibold text-driven-text">Timeline de Eventos</h2>
            </div>
            {timeline.length === 0 ? (
              <p className="text-xs text-driven-muted">Nenhum evento registrado.</p>
            ) : (
              <div className="relative">
                <div className="absolute left-4 top-2 bottom-2 w-px bg-driven-border" />
                <div className="space-y-4">
                  {timeline.map((event, i) => {
                    const type = event.type || 'info'
                    const Icon = TIMELINE_ICONS[type] || Info
                    const colorCls = TIMELINE_COLORS[type] || TIMELINE_COLORS.info
                    return (
                      <div key={i} className="flex gap-4 relative">
                        <div className={`w-8 h-8 rounded-full border flex items-center justify-center flex-none z-10 ${colorCls}`}>
                          <Icon size={13} />
                        </div>
                        <div className="flex-1 pt-0.5">
                          <p className="text-xs font-medium text-driven-text">{event.event}</p>
                          <p className="text-[11px] text-driven-muted mt-0.5">
                            {new Date(event.time).toLocaleString('pt-BR')}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Findings */}
          {inv.findings && (
            <div className="card p-5">
              <h2 className="text-sm font-semibold text-driven-text mb-2">Achados da Investigação</h2>
              <p className="text-xs text-driven-text-secondary leading-relaxed">{inv.findings}</p>
            </div>
          )}
        </div>

        {/* Side info */}
        <div className="space-y-4">
          {/* Alert info */}
          <div className="card p-4">
            <h3 className="text-xs font-semibold text-driven-text uppercase tracking-wide mb-3">Alerta Vinculado</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-driven-muted">Código</span>
                <span className="font-mono font-bold text-driven-info">{alert.alert_code}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-driven-muted">Tipo</span>
                <span className="text-driven-text font-medium">{alert.fraud_type}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-driven-muted">Valor</span>
                <span className="text-driven-text font-semibold">{formatBRL(alert.amount)}</span>
              </div>
              <div className="flex justify-between text-xs items-center">
                <span className="text-driven-muted">Score</span>
                <ScoreBadge score={alert.risk_score} />
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-driven-muted">Dispositivo</span>
                <span className="text-driven-text text-right max-w-[130px]">{alert.device_info || '—'}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-driven-muted">IP</span>
                <span className="font-mono text-driven-text">{alert.ip_address || '—'}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-driven-muted">Local</span>
                <span className="text-driven-text">{alert.location || '—'}</span>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-driven-border-light">
              <Link to={`/alertas/${alert.id}`} className="text-xs text-driven-gold font-semibold hover:text-yellow-600 transition-colors">
                Ver alerta completo →
              </Link>
            </div>
          </div>

          {/* Client */}
          {alert.user && (
            <div className="card p-4">
              <h3 className="text-xs font-semibold text-driven-text uppercase tracking-wide mb-3">Cliente</h3>
              <div className="space-y-2">
                {[
                  ['Nome', alert.user.name],
                  ['E-mail', alert.user.email],
                  ['Documento', alert.user.document],
                  ['Telefone', alert.user.phone],
                ].map(([l, v]) => (
                  <div key={l} className="flex justify-between text-xs">
                    <span className="text-driven-muted">{l}</span>
                    <span className="text-driven-text font-medium text-right max-w-[150px] truncate">{v || '—'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
