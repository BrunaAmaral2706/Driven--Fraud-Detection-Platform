import { SearchX } from 'lucide-react'

export default function EmptyState({ title = 'Nenhum dado encontrado', description = '' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-2 text-center animate-fade-in-up">
      <div className="w-14 h-14 rounded-full bg-driven-cream border border-driven-border flex items-center justify-center">
        <SearchX size={24} className="text-driven-muted/50" />
      </div>
      <p className="text-sm font-medium text-driven-text-secondary">{title}</p>
      {description && <p className="text-xs text-driven-muted max-w-xs">{description}</p>}
    </div>
  )
}
