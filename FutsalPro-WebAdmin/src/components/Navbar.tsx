import React from 'react';
import { Plus, Search, RefreshCw, Bell } from 'lucide-react';
import { TabType } from './Sidebar';

interface NavbarProps {
  currentTab: TabType;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onOpenNuevoTorneo: () => void;
  onRefresh: () => void;
  loading: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  searchTerm,
  onSearchChange,
  onOpenNuevoTorneo,
  onRefresh,
  loading,
}) => {
  const titles: Record<TabType, { title: string; subtitle: string }> = {
    torneos: { title: 'Gestión de Torneos', subtitle: 'Administra competiciones, fixtures y fases eliminatorias' },
    equipos: { title: 'Equipos Registrados', subtitle: 'Listado oficial de clubes y representantes por torneo' },
    partidos: { title: 'Marcador y Fixture', subtitle: 'Actualización en tiempo real de resultados y avances' },
    usuarios: { title: 'Usuarios del Sistema', subtitle: 'Control de accesos para administradores, árbitros y delegados' },
    reportes: { title: 'Métricas y Rendimiento', subtitle: 'Estadísticas clave del torneo, goles y partidos disputados' },
  };

  const currentInfo = titles[currentTab] || { title: 'Dashboard', subtitle: 'Panel de control' };

  return (
    <header className="h-20 bg-slate-900/60 backdrop-blur-md border-b border-slate-800 px-8 flex items-center justify-between sticky top-0 z-10">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          {currentInfo.title}
        </h2>
        <p className="text-xs text-slate-400">{currentInfo.subtitle}</p>
      </div>

      <div className="flex items-center gap-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-56 pl-9 pr-4 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
          />
        </div>

        {/* Refresh button */}
        <button
          onClick={onRefresh}
          disabled={loading}
          title="Recargar datos del backend"
          className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 transition disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
        </button>

        {/* Notification bell */}
        <button
          title="Notificaciones"
          className="relative p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 transition"
        >
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-emerald-400 absolute top-2 right-2"></span>
        </button>

        {/* Create Tournament CTA */}
        <button
          onClick={onOpenNuevoTorneo}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold text-xs rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all duration-200 active:scale-95"
        >
          <Plus className="w-4 h-4 text-slate-950" />
          <span>Nuevo Torneo</span>
        </button>
      </div>
    </header>
  );
};
