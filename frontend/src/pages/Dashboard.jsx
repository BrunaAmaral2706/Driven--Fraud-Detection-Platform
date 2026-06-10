import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Bell, AlertTriangle, Shield, ArrowUpRight,
  TrendingUp, Activity
} from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'
import { dashboardAPI } from '../services/api.js'
import { useDateRange } from '../context/DateRangeContext.jsx'
import { formatDateBR } from '../utils/dateRange.js'
import ScoreBadge from '../components/ScoreBadge.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'

// Dados de gráfico de linha simulados (30 dias)
const lineData = Array.from({ length: 16 }, (_, i) => ({
  day: `${i * 2 + 1}/05`,
  alertas: Math.floor(80 + Math.random() * 220),
}))

const COLORS = ['#2D5FA6', '#D94040', '#C9A84C', '#2D7D52', '#8C8470']

function formatBRL(v) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0)
}

function MetricCard({ icon: Icon, iconBg, label, value, change, changePositive, sparkColor }) {
  return (
    <div className="card p-5 flex flex-col gap-3">
      <div className="flex items-start gap-3">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-none ${iconBg}`}>
          <Icon size={17} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-driven-muted font-medium">{label}</p>
          <p className="text-2xl font-display font-bold text-driven-text leading-tight">{value}</p>
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        <TrendingUp size={11} className={changePositive ? 'text-driven-success' : 'text-driven-danger'} />
        <span className={`text-xs font-semibold ${changePositive ? 'text-driven-success' : 'text-driven-danger'}`}>
          {change}
        </span>
        <span className="text-xs text-driven-muted">em relação ao período anterior</span>
      </div>
      {/* Mini sparkline */}
      <div className="h-10 -mx-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={lineData.slice(0, 10)}>
            <Line type="monotone" dataKey="alertas" stroke={sparkColor} strokeWidth={1.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-driven-border rounded-lg shadow-card p-2 text-xs">
        <p className="font-medium text-driven-text">{label}</p>
        <p className="text-driven-gold font-semibold">{payload[0].value} alertas</p>
      </div>
    )
  }
  return null
}

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const { startDate, endDate } = useDateRange()

  useEffect(() => {
    setLoading(true)
    const params = {}
    if (startDate) params.date_from = startDate
    if (endDate) params.date_to = endDate
    dashboardAPI.getMetrics(params)
      .then(r => setData(r.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false))
  }, [startDate, endDate])

  if (loading) return <LoadingSpinner text="Carregando dashboard..." />

  const metrics = data || {}
  const byType = metrics.alerts_by_type || []
  const total = byType.reduce((s, i) => s + i.count, 0) || 1
  const pieData = byType.map(i => ({ name: i.type, value: i.count, pct: Math.round(i.count / total * 100) }))
  const recent = metrics.recent_alerts || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-xs text-driven-muted font-medium">
          Período: {startDate && endDate
            ? `${formatDateBR(startDate)} — ${formatDateBR(endDate)}`
            : 'Todos os registros'}
        </p>
        <Activity size={14} className="text-driven-muted" />
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard
          icon={Bell}
          iconBg="bg-driven-info-light text-driven-info"
          label="Total de Alertas"
          value={(metrics.total_alerts || 0).toLocaleString('pt-BR')}
          change="+12,5%"
          changePositive={false}
          sparkColor="#2D5FA6"
        />
        <MetricCard
          icon={AlertTriangle}
          iconBg="bg-driven-danger-light text-driven-danger"
          label="Alertas Críticos"
          value={(metrics.critical_alerts || 0).toLocaleString('pt-BR')}
          change="+8,2%"
          changePositive={false}
          sparkColor="#D94040"
        />
        <MetricCard
          icon={Shield}
          iconBg="bg-driven-gold-pale text-driven-gold"
          label="Score Médio de Risco"
          value={`${metrics.avg_risk_score || 0}/100`}
          change="+5,1%"
          changePositive={false}
          sparkColor="#C9A84C"
        />
        <MetricCard
          icon={ArrowUpRight}
          iconBg="bg-driven-success-light text-driven-success"
          label="Transações Suspeitas"
          value={(metrics.suspicious_transactions || 0).toLocaleString('pt-BR')}
          change="+15,3%"
          changePositive={false}
          sparkColor="#2D7D52"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Pie chart */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-driven-text">Alertas por Tipo</h2>
            <span className="text-xs text-driven-muted bg-driven-cream border border-driven-border px-2 py-1 rounded-lg">Este mês</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-44 h-44 flex-none">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={72} dataKey="value" paddingAngle={2}>
                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-2.5">
              {pieData.map((item, i) => (
                <div key={i} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full flex-none" style={{ background: COLORS[i % COLORS.length] }} />
                    <span className="text-xs text-driven-text-secondary">{item.name}</span>
                  </div>
                  <span className="text-xs font-semibold text-driven-text">{item.pct}%</span>
                </div>
              ))}
              <div className="pt-1.5 border-t border-driven-border-light flex justify-between">
                <span className="text-xs text-driven-muted">Total</span>
                <span className="text-xs font-bold text-driven-text">{total.toLocaleString('pt-BR')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Line chart */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-driven-text">Alertas ao Longo do Tempo</h2>
            <span className="text-xs text-driven-muted bg-driven-cream border border-driven-border px-2 py-1 rounded-lg">Este mês</span>
          </div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#8C8470' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#8C8470' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="alertas"
                  stroke="#C9A84C"
                  strokeWidth={2}
                  dot={{ fill: '#C9A84C', r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent alerts */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-driven-text">Alertas Recentes</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-driven-border-light">
                {['ID Alerta', 'Tipo', 'Cliente', 'Score', 'Valor', 'Data', 'Status'].map(h => (
                  <th key={h} className="pb-2.5 text-left text-xs font-semibold text-driven-muted first:pl-0 px-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-driven-border-light">
              {recent.map((a) => (
                <tr key={a.id} className="hover:bg-driven-cream/60 transition-colors">
                  <td className="py-3 px-3 first:pl-0">
                    <Link to={`/alertas/${a.id}`} className="font-mono text-xs font-semibold text-driven-info hover:underline">
                      {a.alert_code}
                    </Link>
                  </td>
                  <td className="py-3 px-3 text-xs text-driven-text-secondary">{a.fraud_type}</td>
                  <td className="py-3 px-3 text-xs font-medium text-driven-text">{a.user?.name}</td>
                  <td className="py-3 px-3"><ScoreBadge score={a.risk_score} /></td>
                  <td className="py-3 px-3 text-xs font-medium text-driven-text">{formatBRL(a.amount)}</td>
                  <td className="py-3 px-3 text-xs text-driven-muted">
                    {new Date(a.created_at).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
                  </td>
                  <td className="py-3 px-3"><StatusBadge status={a.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 pt-3 border-t border-driven-border-light">
          <Link to="/alertas" className="text-xs font-semibold text-driven-gold hover:text-yellow-600 transition-colors">
            Ver todos os alertas →
          </Link>
        </div>
      </div>
    </div>
  )
}
