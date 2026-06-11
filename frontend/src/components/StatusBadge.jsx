const STATUS_MAP = {
  'Novo': 'badge-novo',
  'Em análise': 'badge-analise',
  'Encerrado': 'badge-encerrado',
  'Em andamento': 'badge-analise',
  'Concluída': 'badge-encerrado',
  'Arquivada': 'bg-gray-100 text-gray-500 text-xs font-semibold px-2.5 py-1 rounded-full',
  'Aprovada': 'badge-encerrado',
  'Bloqueada': 'badge-novo',
  'Pendente': 'badge-analise',
}

export default function StatusBadge({ status, compact = false }) {
  const base = STATUS_MAP[status] || 'badge-analise'
  if (!compact) return <span className={base}>{status}</span>
  return (
    <span className={`${base} !text-[10px] !px-1.5 !py-0.5 !rounded`}>
      {status}
    </span>
  )
}
