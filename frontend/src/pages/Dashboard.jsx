import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Bell, AlertTriangle, Shield, ArrowUpRight,
  TrendingUp, Activity
} from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Sector,
} from 'recharts'
import { dashboardAPI } from '../services/api.js'
import { useDateRange } from '../context/DateRangeContext.jsx'
import { formatDateBR } from '../utils/dateRange.js'
import { DEMO_PERIOD_LABEL } from '../config/demoPeriod.js'
import { CHART_ANIMATION, ChartTooltip } from '../utils/chartUtils.jsx'
import ScoreBadge from '../components/ScoreBadge.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import AnimatedCounter from '../components/AnimatedCounter.jsx'
import { KpiSkeleton } from '../components/TableSkeleton.jsx'
import { useTableSort } from '../hooks/useTableSort.js'

const lineData = Array.from({ length: 16 }, (_, i) => ({
  day: `${i * 2 + 1}/05`,
  alertas: Math.floor(80 + Math.random() * 220),
}))

const COLORS = ['#2D5FA6', '#D94040', '#C9A84C', '#2D7D52', '#8C8470']

function formatBRL(v) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0)
}

function MetricCard({ icon: Icon, iconBg, label, value, numericValue, change, changePositive, sparkColor, delay = 0 }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      className="card-interactive p-5 flex flex-col gap-3"
      style={{ animationDelay: `${delay}ms` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-start gap-3">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-none transition-transform duration-300 ${iconBg} ${hovered ? 'scale-110' : ''}`}>
          <Icon size={17} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-driven-muted font-medium">{label}</p>
          <p className="text-2xl font-display font-bold text-driven-text leading-tight tabular-nums">
            <AnimatedCounter
              value={numericValue}
              formatter={(n) => typeof value === 'string' && value.includes('/')
                ? `${n.toFixed(1)}/100`
                : Math.round(n).toLocaleString('pt-BR')}
            />
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        <TrendingUp size={11} className={changePositive ? 'text-driven-success' : 'text-driven-danger'} />
        <span className={`text-xs font-semibold ${changePositive ? 'text-driven-success' : 'text-driven-danger'}`}>
          {change}
        </span>
        <span className="text-xs text-driven-muted">em relação ao período anterior</span>
      </div>
      <div className="h-10 -mx-1 transition-opacity duration-300" style={{ opacity: hovered ? 1 : 0.75 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={lineData.slice(0, 10)}>
            <Line
              type="monotone"
              dataKey="alertas"
              stroke={sparkColor}
              strokeWidth={hovered ? 2 : 1.5}
              dot={false}
              {...CHART_ANIMATION}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

const renderActiveShape = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props
  return (
    <Sector
      cx={cx}
      cy={cy}
      innerRadius={innerRadius}
      outerRadius={outerRadius + 4}
      startAngle={startAngle}
      endAngle={endAngle}
      fill={fill}
    />
  )
}

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activePieIndex, setActivePieIndex] = useState(null)
  const [selectedRow, setSelectedRow] = useState(null)
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

  const metrics = data || {}
  const byType = metrics.alerts_by_type || []
  const total = byType.reduce((s, i) => s + i.count, 0) || 1
  const pieData = byType.map(i => ({ name: i.type, value: i.count, pct: Math.round(i.count / total * 100) }))
  const recent = metrics.recent_alerts || []
  const { sorted: sortedRecent, toggleSort, sortIndicator } = useTableSort(recent, 'created_at', 'desc')

  if (loading) {
    return (
      <div className="space-y-6 page-enter">
        <KpiSkeleton count={4} />
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <div className="card p-5 h-52 skeleton-shimmer rounded-xl" />
          <div className="card p-5 h-52 skeleton-shimmer rounded-xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 page-enter">
      <div className="flex items-center justify-between">
        <p className="text-xs text-driven-muted font-medium">
          Período: {startDate && endDate
            ? `${formatDateBR(startDate)} — ${formatDateBR(endDate)}`
            : DEMO_PERIOD_LABEL}
        </p>
        <Activity size={14} className="text-driven-muted animate-pulse-soft" />
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard
          icon={Bell}
          iconBg="bg-driven-info-light text-driven-info"
          label="Total de Alertas"
          value={metrics.total_alerts}
          numericValue={metrics.total_alerts || 0}
          change="+12,5%"
          changePositive={false}
          sparkColor="#2D5FA6"
          delay={0}
        />
        <MetricCard
          icon={AlertTriangle}
          iconBg="bg-driven-danger-light text-driven-danger"
          label="Alertas Críticos"
          value={metrics.critical_alerts}
          numericValue={metrics.critical_alerts || 0}
          change="+8,2%"
          changePositive={false}
          sparkColor="#D94040"
          delay={80}
        />
        <MetricCard
          icon={Shield}
          iconBg="bg-driven-gold-pale text-driven-gold"
          label="Score Médio de Risco"
          value={`${metrics.avg_risk_score || 0}/100`}
          numericValue={metrics.avg_risk_score || 0}
          change="+5,1%"
          changePositive={false}
          sparkColor="#C9A84C"
          delay={160}
        />
        <MetricCard
          icon={ArrowUpRight}
          iconBg="bg-driven-success-light text-driven-success"
          label="Transações Suspeitas"
          value={metrics.suspicious_transactions}
          numericValue={metrics.suspicious_transactions || 0}
          change="+15,3%"
          changePositive={false}
          sparkColor="#2D7D52"
          delay={240}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="card-interactive p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-driven-text">Alertas por Tipo</h2>
            <span className="text-xs text-driven-muted bg-driven-cream border border-driven-border px-2 py-1 rounded-lg">Este mês</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-44 h-44 flex-none">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={72}
                    dataKey="value"
                    paddingAngle={2}
                    activeIndex={activePieIndex}
                    activeShape={renderActiveShape}
                    onMouseEnter={(_, i) => setActivePieIndex(i)}
                    onMouseLeave={() => setActivePieIndex(null)}
                    {...CHART_ANIMATION}
                  >
                    {pieData.map((_, i) => (
                      <Cell
                        key={i}
                        fill={COLORS[i % COLORS.length]}
                        opacity={activePieIndex === null || activePieIndex === i ? 1 : 0.45}
                        className="transition-opacity duration-200"
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip valueSuffix=" alertas" />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-1">
              {pieData.map((item, i) => (
                <button
                  key={i}
                  type="button"
                  onMouseEnter={() => setActivePieIndex(i)}
                  onMouseLeave={() => setActivePieIndex(null)}
                  onClick={() => setActivePieIndex(activePieIndex === i ? null : i)}
                  className={`legend-item w-full ${activePieIndex === i ? 'legend-item-active' : ''}`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full flex-none transition-transform duration-200" style={{ background: COLORS[i % COLORS.length], transform: activePieIndex === i ? 'scale(1.2)' : 'scale(1)' }} />
                    <span className="text-xs text-driven-text-secondary">{item.name}</span>
                  </div>
                  <span className="text-xs font-semibold text-driven-text tabular-nums">{item.pct}%</span>
                </button>
              ))}
              <div className="pt-1.5 border-t border-driven-border-light flex justify-between">
                <span className="text-xs text-driven-muted">Total</span>
                <span className="text-xs font-bold text-driven-text">{total.toLocaleString('pt-BR')}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card-interactive p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-driven-text">Alertas ao Longo do Tempo</h2>
            <span className="text-xs text-driven-muted bg-driven-cream border border-driven-border px-2 py-1 rounded-lg">Este mês</span>
          </div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#8C8470' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#8C8470' }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip valueSuffix=" alertas" />} />
                <Line
                  type="monotone"
                  dataKey="alertas"
                  stroke="#C9A84C"
                  strokeWidth={2}
                  dot={{ fill: '#C9A84C', r: 3, strokeWidth: 0 }}
                  activeDot={{ r: 6, stroke: '#C9A84C', strokeWidth: 2, fill: '#fff' }}
                  {...CHART_ANIMATION}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card-interactive p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-driven-text">Alertas Recentes</h2>
        </div>
        <div className="overflow-x-auto scroll-smooth">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-driven-border-light">
                {[
                  { h: 'ID Alerta', key: 'alert_code' },
                  { h: 'Tipo', key: 'fraud_type' },
                  { h: 'Cliente', key: null },
                  { h: 'Score', key: 'risk_score' },
                  { h: 'Valor', key: 'amount' },
                  { h: 'Data', key: 'created_at' },
                  { h: 'Status', key: 'status' },
                ].map(({ h, key }) => (
                  <th
                    key={h}
                    onClick={key ? () => toggleSort(key) : undefined}
                    className={`pb-2.5 text-left text-xs font-semibold text-driven-muted first:pl-0 px-3 ${key ? 'cursor-pointer hover:text-driven-gold transition-colors select-none' : ''}`}
                  >
                    {h}{key ? ` ${sortIndicator(key)}` : ''}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-driven-border-light">
              {sortedRecent.map((a) => (
                <tr
                  key={a.id}
                  onClick={() => setSelectedRow(selectedRow === a.id ? null : a.id)}
                  className={`table-row-interactive ${selectedRow === a.id ? 'table-row-selected' : ''}`}
                >
                  <td className="py-3 px-3 first:pl-0">
                    <Link to={`/alertas/${a.id}`} className="font-mono text-xs font-semibold text-driven-info hover:underline">
                      {a.alert_code}
                    </Link>
                  </td>
                  <td className="py-3 px-3 text-xs text-driven-text-secondary">{a.fraud_type}</td>
                  <td className="py-3 px-3 text-xs font-medium text-driven-text">{a.user?.name}</td>
                  <td className="py-3 px-3"><ScoreBadge score={a.risk_score} /></td>
                  <td className="py-3 px-3 text-xs font-medium text-driven-text tabular-nums">{formatBRL(a.amount)}</td>
                  <td className="py-3 px-3 text-xs text-driven-muted tabular-nums">
                    {new Date(a.created_at).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
                  </td>
                  <td className="py-3 px-3"><StatusBadge status={a.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 pt-3 border-t border-driven-border-light">
          <Link to="/alertas" className="text-xs font-semibold text-driven-gold hover:text-yellow-600 transition-colors inline-flex items-center gap-1 group">
            Ver todos os alertas
            <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
