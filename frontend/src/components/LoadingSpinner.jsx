export default function LoadingSpinner({ text = 'Carregando...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <div className="w-8 h-8 border-2 border-driven-gold/30 border-t-driven-gold rounded-full animate-spin" />
      <p className="text-sm text-driven-muted">{text}</p>
    </div>
  )
}
