import { Bell, HelpCircle, Search, User } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import DateRangeFilter from '../components/DateRangeFilter.jsx'

const PAGE_TITLES = {
  '/': 'Dashboard',
  '/alertas': 'Alertas',
  '/investigacoes': 'Investigações',
  '/transacoes': 'Transações',
  '/clientes': 'Clientes',
  '/regras': 'Regras',
}

export default function Navbar() {
  const { pathname } = useLocation()
  const baseRoute = '/' + pathname.split('/')[1]
  const title = PAGE_TITLES[baseRoute] || PAGE_TITLES['/']

  return (
    <header className="h-14 bg-white border-b border-driven-border flex items-center px-6 gap-4">
      <h1 className="font-display font-bold text-driven-text text-lg flex-none">{title}</h1>

      <DateRangeFilter />

      {/* Search */}
      <div className="flex-1 max-w-xs ml-4">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-driven-muted" />
          <input
            type="text"
            placeholder="Buscar alertas, clientes..."
            className="w-full pl-9 pr-4 py-1.5 text-sm bg-driven-cream border border-driven-border rounded-lg input-interactive placeholder:text-driven-muted"
          />
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button type="button" className="btn-icon">
          <HelpCircle size={16} />
        </button>
        <button type="button" className="btn-icon relative">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-driven-danger rounded-full" />
        </button>

        {/* User */}
        <div className="flex items-center gap-2 pl-2 ml-1 border-l border-driven-border">
          <div className="w-7 h-7 rounded-full bg-driven-gold-pale border border-driven-gold/30 flex items-center justify-center">
            <User size={13} className="text-driven-gold" />
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-semibold text-driven-text leading-tight">Analista</p>
            <p className="text-[10px] text-driven-muted">Antifraude</p>
          </div>
        </div>
      </div>
    </header>
  )
}
