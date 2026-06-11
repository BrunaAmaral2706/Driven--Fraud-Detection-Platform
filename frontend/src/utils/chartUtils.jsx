export const CHART_ANIMATION = {
  animationBegin: 0,
  animationDuration: 800,
  animationEasing: 'ease-out',
  isAnimationActive: true,
}

export const CHART_TOOLTIP_STYLE = {
  fontSize: 11,
  padding: '6px 10px',
  borderRadius: 8,
  border: '1px solid #E8E4D9',
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  background: '#FFFFFF',
}

export function ChartTooltip({ active, payload, label, valueSuffix = '' }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-driven-border rounded-lg shadow-card-hover px-2.5 py-1.5 text-xs animate-fade-in">
      {label && <p className="font-medium text-driven-text mb-0.5">{label}</p>}
      <p className="text-driven-gold font-semibold tabular-nums">
        {payload[0].value}{valueSuffix}
      </p>
    </div>
  )
}
