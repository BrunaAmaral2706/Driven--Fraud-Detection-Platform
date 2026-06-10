export default function StatusBadge({ status }) {
  const map = {
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
  return <span className={map[status] || 'badge-analise'}>{status}</span>
}
