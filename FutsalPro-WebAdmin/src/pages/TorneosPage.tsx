import React from 'react';
import { Torneo } from '../services/api';
import { Trophy, Calendar, Users, Eye, Plus, ArrowUpRight } from 'lucide-react';

interface TorneosPageProps {
  torneos: Torneo[];
  onSelectTorneo: (torneo: Torneo) => void;
  onOpenNuevoTorneo: () => void;
  onViewPartidos: (torneoId: number) => void;
  loading: boolean;
}

export const TorneosPage: React.FC<TorneosPageProps> = ({
  torneos,
  onSelectTorneo,
  onOpenNuevoTorneo,
  onViewPartidos,
  loading,
}) => {
  const getGeneroLabel = (id: number) => {
    switch (id) {
      case 1:
        return 'Masculino';
      case 2:
        return 'Femenino';
      default:
        return 'Mixto';
    }
  };

  const getEstadoBadge = (estadoId: number) => {
    switch (estadoId) {
      case 1:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            En Curso
          </span>
        );
      case 2:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            Por Iniciar
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-500/10 text-slate-400 border border-slate-500/20">
            Finalizado
          </span>
        );
    }
  };

  if (loading && torneos.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top action cards / summary */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white">Torneos Activos</h3>
          <p className="text-xs text-slate-400">
            {torneos.length} competiciones registradas en el sistema
          </p>
        </div>
        <button
          onClick={onOpenNuevoTorneo}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Crear Torneo</span>
        </button>
      </div>

      {torneos.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800">
          <Trophy className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h4 className="text-base font-semibold text-white mb-1">No hay torneos registrados</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
            Comienza creando tu primer torneo con 8 equipos para generar el fixture de cuartos de final de forma automática.
          </p>
          <button
            onClick={onOpenNuevoTorneo}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-xl shadow-md transition"
          >
            Crear Primer Torneo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {torneos.map((torneo) => {
            const numEquipos = torneo.equipos ? torneo.equipos.length : 8;
            const numPartidos = torneo.partidosTorneo ? torneo.partidosTorneo.length : 7;
            const fechaStr = new Date(torneo.fechaInicio).toLocaleDateString('es-ES', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            });

            return (
              <div
                key={torneo.id}
                className="bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-5 transition-all duration-200 group flex flex-col justify-between shadow-xl shadow-black/20"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                      <Trophy className="w-6 h-6" />
                    </div>
                    {getEstadoBadge(torneo.estadoId)}
                  </div>

                  <h4 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-1 mb-1">
                    {torneo.nombre}
                  </h4>
                  <p className="text-xs text-slate-400 mb-4">
                    Categoría {getGeneroLabel(torneo.generoId)} • {torneo.rangoEdad}
                  </p>

                  <div className="space-y-2 py-3 border-y border-slate-800/80 text-xs text-slate-300">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-slate-500" /> Equipos
                      </span>
                      <span className="font-semibold text-white">{numEquipos} participantes</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" /> Fecha Inicio
                      </span>
                      <span className="font-medium text-slate-200">{fechaStr}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex items-center gap-2">
                  <button
                    onClick={() => onViewPartidos(torneo.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700/80 text-xs font-semibold text-slate-200 rounded-xl transition"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Ver Fixture ({numPartidos})</span>
                  </button>

                  <button
                    onClick={() => onSelectTorneo(torneo)}
                    title="Detalles"
                    className="p-2 bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
