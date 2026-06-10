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
      {/* Logo */}
      <div className="px-5 py-5 border-b border-driven-border-light">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-driven-gold rounded-lg flex items-center justify-center">
            <Zap size={15} className="text-white" />
          </div>
          <div>
            <p className="font-display font-bold text-driven-text text-sm leading-tight">Driven</p>
            <p className="text-[10px] text-driven-muted font-medium tracking-wide uppercase">Antifraude</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map(({ icon: Icon, label, to }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-driven-gold-pale text-driven-gold border border-driven-gold/20'
                  : 'text-driven-text-secondary hover:bg-driven-border-light hover:text-driven-text'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={16} className={isActive ? 'text-driven-gold' : 'text-driven-muted group-hover:text-driven-text'} />
                <span>{label}</span>
                {isActive && <ChevronRight size={12} className="ml-auto text-driven-gold/60" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-driven-border-light">
        <div className="bg-driven-gold-pale rounded-lg p-3 border border-driven-gold/20">
          <div className="flex items-center gap-2 mb-1">
            <Zap size={13} className="text-driven-gold" />
            <span className="text-xs font-semibold text-driven-gold">Driven AI</span>
            <span className="text-[9px] bg-driven-gold text-white px-1.5 py-0.5 rounded-full font-bold">BETA</span>
          </div>
          <p className="text-[11px] text-driven-text-secondary leading-tight">
            Análise inteligente com IA generativa.
          </p>
        </div>
        <p className="text-[10px] text-driven-muted mt-3 text-center">v1.0.0</p>
      </div>
    </aside>
  )
}
