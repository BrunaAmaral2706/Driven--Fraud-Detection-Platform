import { SearchX } from 'lucide-react'
export default function EmptyState({ title = 'Nenhum dado encontrado', description = '' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-2 text-center">
      <SearchX size={32} className="text-driven-muted/40" />
      <p className="text-sm font-medium text-driven-text-secondary">{title}</p>
      {description && <p className="text-xs text-driven-muted">{description}</p>}
    </div>
  )
}
