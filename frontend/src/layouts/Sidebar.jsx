import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Bell, Search, ArrowLeftRight,
  Users, Shield, ChevronRight, Zap
} from 'lucide-react'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/' },
  { icon: Bell, label: 'Alertas', to: '/alertas' },
  { icon: Search, label: 'Investigações', to: '/investigacoes' },
  { icon: ArrowLeftRight, label: 'Transações', to: '/transacoes' },
  { icon: Users, label: 'Clientes', to: '/clientes' },
  { icon: Shield, label: 'Regras', to: '/regras' },
]

export default function Sidebar() {
  return (
    <aside className="w-56 min-h-screen bg-white border-r border-driven-border shadow-sidebar flex flex-col">
      <div className="px-5 py-5 border-b border-driven-border-light">
        <div className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 bg-driven-gold rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-105 group-hover:shadow-sm">
            <Zap size={15} className="text-white" />
          </div>
          <div>
            <p className="font-display font-bold text-driven-text text-sm leading-tight">Driven</p>
            <p className="text-[10px] text-driven-muted font-medium tracking-wide uppercase">Antifraude</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map(({ icon: Icon, label, to }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `nav-link-interactive group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                isActive
                  ? 'bg-driven-gold-pale text-driven-gold border border-driven-gold/20 shadow-sm'
                  : 'text-driven-text-secondary hover:bg-driven-border-light hover:text-driven-text'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={16}
                  className={`transition-transform duration-200 ${
                    isActive ? 'text-driven-gold scale-110' : 'text-driven-muted group-hover:text-driven-text group-hover:scale-105'
                  }`}
                />
                <span>{label}</span>
                {isActive && (
                  <ChevronRight size={12} className="ml-auto text-driven-gold/60 animate-fade-in" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-driven-border-light">
        <p className="text-[10px] text-driven-muted text-center">v1.0.0</p>
      </div>
    </aside>
  )
}
