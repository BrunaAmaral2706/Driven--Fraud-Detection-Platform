export default function ScoreBadge({ score, compact = false }) {
  const s = Number(score)
  let cls = compact
    ? 'text-[10px] font-bold px-1.5 py-0 rounded text-white tabular-nums '
    : 'text-xs font-bold px-2 py-0.5 rounded text-white tabular-nums '
  if (s >= 85) cls += 'bg-driven-danger'
  else if (s >= 70) cls += 'bg-driven-warning'
  else if (s >= 50) cls += 'bg-driven-gold'
  else cls += 'bg-driven-success'
  return <span className={cls}>{s}</span>
}
