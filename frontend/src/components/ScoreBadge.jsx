export default function ScoreBadge({ score }) {
  const s = Number(score)
  let cls = 'text-xs font-bold px-2 py-0.5 rounded text-white '
  if (s >= 85) cls += 'bg-driven-danger'
  else if (s >= 70) cls += 'bg-driven-warning'
  else if (s >= 50) cls += 'bg-driven-gold'
  else cls += 'bg-driven-success'
  return <span className={cls}>{s}</span>
}
