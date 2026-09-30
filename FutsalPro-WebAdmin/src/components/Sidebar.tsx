import React from 'react';
import { 
  Trophy, 
  Users, 
  CalendarDays, 
  UserCheck, 
  BarChart3, 
  LogOut, 
  Flame,
  Radio,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export type TabType = 'torneos' | 'equipos' | 'partidos' | 'usuarios' | 'reportes';

interface SidebarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  torneosCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab, torneosCount = 0 }) => {
  const { user, logout } = useAuth();

  const menuItems = [
    { id: 'torneos', label: 'Torneos', icon: Trophy, badge: torneosCount > 0 ? torneosCount : null },
    { id: 'equipos', label: 'Equipos', icon: Users },
    { id: 'partidos', label: 'Partidos & Fixture', icon: CalendarDays },
    { id: 'usuarios', label: 'Usuarios', icon: UserCheck },
    { id: 'reportes', label: 'Reportes y Métricas', icon: BarChart3 },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0 select-none">
      {/* Brand Header */}
      <div>
        <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white font-black text-xl">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-1.5">
                Futsal<span className="text-emerald-400">Pro</span>
              </h1>
              <span className="text-[11px] font-medium tracking-wide uppercase px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Web Admin
              </span>
            </div>
          </div>
        </div>

        {/* Backend Status indicator */}
        <div className="mx-4 my-3 px-3 py-2 rounded-lg bg-slate-950/60 border border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Backend en Render</span>
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
        </div>

        {/* Navigation List */}
        <nav className="p-3 space-y-1">
          <p className="px-3 py-1.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Gestión Principal
          </p>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id as TabType)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/10 text-emerald-400 border border-emerald-500/30 shadow-md shadow-emerald-500/5'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
                      isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge !== null && (
                  <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {item.badge}
                  </span>
                )}
                {!item.badge && isActive && (
                  <ChevronRight className="w-4 h-4 text-emerald-400/80" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* User profile & Logout */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-300 font-bold text-xs uppercase">
              {user ? user.nombre.substring(0, 2) : 'AD'}
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold text-slate-200 truncate">
                {user ? user.nombre : 'Admin Principal'}
              </p>
              <p className="text-[10px] text-emerald-400 capitalize">
                {user ? user.rol : 'Administrador'}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            title="Cerrar Sesión"
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
