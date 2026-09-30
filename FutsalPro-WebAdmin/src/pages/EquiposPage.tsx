import React, { useState } from 'react';
import { Equipo, Torneo } from '../services/api';
import { Shield, User, Trophy, Search } from 'lucide-react';

interface EquiposPageProps {
  torneos: Torneo[];
  loading: boolean;
}

export const EquiposPage: React.FC<EquiposPageProps> = ({ torneos, loading }) => {
  const [selectedTorneoId, setSelectedTorneoId] = useState<number | 'all'>('all');
  const [filterText, setFilterText] = useState('');

  // Extract all teams from torneos or default
  const allEquipos: (Equipo & { torneoNombre?: string })[] = [];
  torneos.forEach((t) => {
    if (t.equipos) {
      t.equipos.forEach((eq) => {
        allEquipos.push({
          ...eq,
          torneoNombre: t.nombre,
        });
      });
    }
  });

  const filtered = allEquipos.filter((eq) => {
    const matchesTorneo = selectedTorneoId === 'all' || eq.torneoId === selectedTorneoId;
    const matchesQuery =
      eq.nombreEquipo.toLowerCase().includes(filterText.toLowerCase()) ||
      eq.nombreRepresentante.toLowerCase().includes(filterText.toLowerCase());
    return matchesTorneo && matchesQuery;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white">Equipos Registrados</h3>
          <p className="text-xs text-slate-400">
            {allEquipos.length} escuadras participando en torneos activos
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filtrar equipos..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <select
            value={selectedTorneoId}
            onChange={(e) =>
              setSelectedTorneoId(e.target.value === 'all' ? 'all' : Number(e.target.value))
            }
            className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">Todos los Torneos</option>
            {torneos.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && allEquipos.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400"></div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800">
          <Shield className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h4 className="text-sm font-semibold text-white mb-1">No se encontraron equipos</h4>
          <p className="text-xs text-slate-400">
            Crea un torneo o ajusta los filtros de búsqueda para visualizar los equipos registrados.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filtered.map((equipo) => (
            <div
              key={equipo.id}
              className="bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-4 transition-all duration-200 group flex flex-col justify-between shadow-lg shadow-black/20"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-700 flex items-center justify-center text-emerald-400 border border-slate-700/60 group-hover:scale-105 transition-transform">
                    <Shield className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-mono text-slate-500">#{equipo.id}</span>
                </div>

                <h4 className="text-sm font-bold text-white mb-1 group-hover:text-emerald-300 transition-colors">
                  {equipo.nombreEquipo}
                </h4>

                <div className="space-y-1.5 mt-3 text-xs text-slate-400 border-t border-slate-800/80 pt-3">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">
                      Rep: <strong className="text-slate-300">{equipo.nombreRepresentante}</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5 text-amber-500/80 shrink-0" />
                    <span className="truncate text-[11px] text-slate-400">
                      {equipo.torneoNombre || 'Torneo Asignado'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-2 border-t border-slate-800/40 flex items-center justify-between text-[11px]">
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Habilitado
                </span>
                <span className="text-slate-500 font-medium">10 Jugadores</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
