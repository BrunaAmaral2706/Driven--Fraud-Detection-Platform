import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Sparkles, Monitor, MapPin, User, CreditCard, Loader2, Copy, CheckCircle } from 'lucide-react'
import { alertsAPI } from '../services/api.js'
import ScoreBadge from '../components/ScoreBadge.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'

function formatBRL(v) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0)
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-start justify-between py-2.5 border-b border-driven-border-light last:border-0">
      <span className="text-xs text-driven-muted w-32 flex-none">{label}</span>
      <span className="text-xs font-medium text-driven-text text-right">{value || '—'}</span>
    </div>
  )
}

export default function AlertDetail() {
  const { id } = useParams()
  const [alert, setAlert] = useState(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [report, setReport] = useState(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    alertsAPI.get(id)
      .then(r => setAlert(r.data))
      .catch(() => setAlert(null))
      .finally(() => setLoading(false))
  }, [id])

  const handleGenerateReport = async () => {
    setGenerating(true)
    setReport(null)
    try {
      const r = await alertsAPI.generateReport(id)
      setReport(r.data)
    } catch {
      setReport({ summary: 'Erro ao gerar parecer. Verifique a conexão com o backend.' })
    } finally {
      setGenerating(false)
    }
  }

  const handleCopy = () => {
    if (report?.summary) {
      navigator.clipboard.writeText(report.summary)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (loading) return <LoadingSpinner text="Carregando alerta..." />
  if (!alert) return (
    <div className="text-center py-16">
      <p className="text-driven-muted">Alerta não encontrado.</p>
      <Link to="/alertas" className="text-driven-gold text-sm mt-2 block">← Voltar</Link>
    </div>
  )

  const scoreRiskLabel = alert.risk_score >= 85 ? 'Crítico' : alert.risk_score >= 70 ? 'Alto' : alert.risk_score >= 50 ? 'Médio' : 'Baixo'

  return (
    <div className="space-y-5 max-w-5xl">
      {/* Back + header */}
      <div className="flex items-center gap-3">
        <Link to="/alertas" className="flex items-center gap-1.5 text-xs text-driven-muted hover:text-driven-text transition-colors">
          <ArrowLeft size={14} /> Alertas
        </Link>
        <span className="text-driven-border">/</span>
        <span className="text-xs font-mono font-bold text-driven-info">{alert.alert_code}</span>
      </div>

      {/* Title row */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="font-display font-bold text-driven-text text-xl">{alert.fraud_type}</h1>
            <ScoreBadge score={alert.risk_score} />
            <StatusBadge status={alert.status} />
          </div>
          <p className="text-xs text-driven-muted">
            Registrado em {new Date(alert.created_at).toLocaleString('pt-BR')} · Nível de risco: <strong>{scoreRiskLabel}</strong>
          </p>
        </div>
        <button
          onClick={handleGenerateReport}
          disabled={generating}
          className="flex items-center gap-2 bg-driven-gold text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-yellow-600 transition-colors disabled:opacity-60 shadow-sm"
        >
          {generating ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
          {generating ? 'Gerando análise...' : 'Gerar análise automática'}
        </button>
      </div>

      {/* AI Report */}
      {report && (
        <div className="card p-5 border-l-4 border-driven-gold bg-driven-gold-pale/40">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-driven-gold" />
              <h3 className="text-sm font-semibold text-driven-text">Parecer Investigativo Automático</h3>
              {report.risk_level && (
                <span className="text-xs bg-driven-gold text-white px-2 py-0.5 rounded-full font-semibold">{report.risk_level}</span>
              )}
            </div>
            <button onClick={handleCopy} className="flex items-center gap-1 text-xs text-driven-muted hover:text-driven-text transition-colors">
              {copied ? <CheckCircle size={13} className="text-driven-success" /> : <Copy size={13} />}
              {copied ? 'Copiado!' : 'Copiar'}
            </button>
          </div>
          <pre className="text-xs text-driven-text-secondary leading-relaxed whitespace-pre-wrap font-sans">
            {report.summary}
          </pre>
          <p className="text-[10px] text-driven-muted mt-3">
            Gerado em {report.generated_at ? new Date(report.generated_at).toLocaleString('pt-BR') : new Date().toLocaleString('pt-BR')}
            {' '}· Análise baseada em regras — estrutura pronta para integração com IA generativa.
          </p>
        </div>
      )}

      {/* Details grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Client info */}
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-3">
            <User size={14} className="text-driven-gold" />
            <h3 className="text-xs font-semibold text-driven-text uppercase tracking-wide">Cliente</h3>
          </div>
          <InfoRow label="Nome" value={alert.user?.name} />
          <InfoRow label="E-mail" value={alert.user?.email} />
          <InfoRow label="Documento" value={alert.user?.document} />
          <InfoRow label="Telefone" value={alert.user?.phone} />
          <InfoRow label="Nível de risco" value={alert.user?.risk_level} />
        </div>

        {/* Device + IP */}
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-3">
            <Monitor size={14} className="text-driven-gold" />
            <h3 className="text-xs font-semibold text-driven-text uppercase tracking-wide">Dispositivo & Rede</h3>
          </div>
          <InfoRow label="Dispositivo" value={alert.device_info} />
          <InfoRow label="Endereço IP" value={alert.ip_address} />
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-driven-border-light">
            <MapPin size={13} className="text-driven-muted" />
            <span className="text-xs text-driven-text-secondary">{alert.location || '—'}</span>
          </div>
        </div>

        {/* Transaction summary */}
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-3">
            <CreditCard size={14} className="text-driven-gold" />
            <h3 className="text-xs font-semibold text-driven-text uppercase tracking-wide">Transação</h3>
          </div>
          <InfoRow label="Alerta" value={alert.alert_code} />
          <InfoRow label="Tipo" value={alert.fraud_type} />
          <InfoRow label="Valor" value={formatBRL(alert.amount)} />
          <InfoRow label="Score" value={`${alert.risk_score}/100`} />
          <InfoRow label="Status" value={alert.status} />
        </div>
      </div>

      {/* Transactions table */}
      {alert.transactions?.length > 0 && (
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-driven-text mb-4">Histórico de Transações Vinculadas</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-driven-border-light">
                <tr>
                  {['Código', 'Tipo', 'Valor', 'Status', 'Score', 'Data'].map(h => (
                    <th key={h} className="pb-2.5 px-2 text-left text-xs font-semibold text-driven-muted first:pl-0">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-driven-border-light">
                {alert.transactions.map(t => (
                  <tr key={t.id} className="hover:bg-driven-cream/40 transition-colors">
                    <td className="py-3 px-2 first:pl-0 font-mono text-xs text-driven-info">{t.transaction_code}</td>
                    <td className="py-3 px-2 text-xs text-driven-text-secondary">{t.tx_type}</td>
                    <td className="py-3 px-2 text-xs font-medium text-driven-text">{formatBRL(t.amount)}</td>
                    <td className="py-3 px-2"><StatusBadge status={t.status} /></td>
                    <td className="py-3 px-2"><ScoreBadge score={t.risk_score} /></td>
                    <td className="py-3 px-2 text-xs text-driven-muted">
                      {new Date(t.created_at).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
