export default function LoadingSpinner({ text = 'Carregando...', compact = false }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 animate-fade-in ${compact ? 'py-8' : 'py-16'}`}>
      <div className="relative">
        <div className="w-8 h-8 border-2 border-driven-gold/20 border-t-driven-gold rounded-full animate-spin" />
        <div className="absolute inset-0 w-8 h-8 border-2 border-transparent border-b-driven-gold/40 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.2s' }} />
      </div>
      <p className="text-sm text-driven-muted animate-pulse-soft">{text}</p>
    </div>
  )
}
