import React from 'react';
import { Torneo, PartidoTorneo } from '../services/api';
import { Swords, Edit3, Trophy, CheckCircle2, Clock } from 'lucide-react';

interface PartidosPageProps {
  torneos: Torneo[];
  selectedTorneoId: number | null;
  onSelectTorneoId: (id: number) => void;
  onOpenEditarPartido: (partido: PartidoTorneo) => void;
  loading: boolean;
}

export const PartidosPage: React.FC<PartidosPageProps> = ({
  torneos,
  selectedTorneoId,
  onSelectTorneoId,
  onOpenEditarPartido,
  loading,
}) => {
  const currentTorneo =
    torneos.find((t) => t.id === selectedTorneoId) || (torneos.length > 0 ? torneos[0] : null);

  const partidos: PartidoTorneo[] = currentTorneo?.partidosTorneo || [];

  // Group matches by phase
  const cuartos = partidos.filter((p) =>
    (p.fase || '').toLowerCase().includes('cuarto')
  );
  const semifinales = partidos.filter((p) =>
    (p.fase || '').toLowerCase().includes('semi')
  );
  const final = partidos.filter(
    (p) =>
      (p.fase || '').toLowerCase().includes('final') &&
      !(p.fase || '').toLowerCase().includes('semi') &&
      !(p.fase || '').toLowerCase().includes('cuarto')
  );
  const otrosPartidos = partidos.filter(
    (p) =>
      !(p.fase || '').toLowerCase().includes('cuarto') &&
      !(p.fase || '').toLowerCase().includes('semi') &&
      !(p.fase || '').toLowerCase().includes('final')
  );

  const renderPartidoCard = (partido: PartidoTorneo) => {
    const isFinished =
      partido.golesLocal !== null &&
      partido.golesVisita !== null &&
      partido.golesLocal !== undefined &&
      partido.golesVisita !== undefined;

    const localNombre = partido.equipoLocal?.nombreEquipo || `Equipo #${partido.equipoLocalId || 'TBD'}`;
    const visitaNombre = partido.equipoVisita?.nombreEquipo || `Equipo #${partido.equipoVisitaId || 'TBD'}`;

    const localIsWinner = isFinished && partido.ganadorId === partido.equipoLocalId;
    const visitaIsWinner = isFinished && partido.ganadorId === partido.equipoVisitaId;

    return (
      <div
        key={partido.id}
        className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 transition-all duration-200 shadow-md relative group"
      >
        <div className="flex items-center justify-between mb-3 text-xs">
          <span className="font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
            {partido.fase || 'Eliminatoria'}
          </span>
          <div className="flex items-center gap-1.5">
            {isFinished ? (
              <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Finalizado
              </span>
            ) : (
              <span className="text-[11px] font-medium text-amber-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Por disputar
              </span>
            )}
          </div>
        </div>

        {/* Local vs Visita row */}
        <div className="space-y-2 py-2">
          {/* Local */}
          <div
            className={`flex items-center justify-between p-2.5 rounded-xl transition ${
              localIsWinner
                ? 'bg-emerald-500/15 border border-emerald-500/30'
                : 'bg-slate-950 border border-slate-800/80'
            }`}
          >
            <div className="flex items-center gap-2 truncate">
              {localIsWinner && <Trophy className="w-4 h-4 text-amber-400 shrink-0" />}
              <span
                className={`text-xs font-bold truncate ${
                  localIsWinner ? 'text-emerald-300' : 'text-slate-200'
                }`}
              >
                {localNombre}
              </span>
            </div>
            <span
              className={`text-base font-black px-2 py-0.5 rounded-lg ${
                isFinished ? 'bg-slate-800 text-white font-mono' : 'text-slate-600'
              }`}
            >
              {partido.golesLocal ?? '-'}
            </span>
          </div>

          {/* Visita */}
          <div
            className={`flex items-center justify-between p-2.5 rounded-xl transition ${
              visitaIsWinner
                ? 'bg-emerald-500/15 border border-emerald-500/30'
                : 'bg-slate-950 border border-slate-800/80'
            }`}
          >
            <div className="flex items-center gap-2 truncate">
              {visitaIsWinner && <Trophy className="w-4 h-4 text-amber-400 shrink-0" />}
              <span
                className={`text-xs font-bold truncate ${
                  visitaIsWinner ? 'text-emerald-300' : 'text-slate-200'
                }`}
              >
                {visitaNombre}
              </span>
            </div>
            <span
              className={`text-base font-black px-2 py-0.5 rounded-lg ${
                isFinished ? 'bg-slate-800 text-white font-mono' : 'text-slate-600'
              }`}
            >
              {partido.golesVisita ?? '-'}
            </span>
          </div>
        </div>

        {/* Edit Button */}
        <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-end">
          <button
            onClick={() => onOpenEditarPartido(partido)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700/80 text-xs font-semibold text-slate-200 rounded-lg transition"
          >
            <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isFinished ? 'Modificar Goles' : 'Cargar Resultado'}</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Tournament Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Swords className="w-5 h-5 text-emerald-400" />
            <span>Fixture y Llaves Eliminatorias</span>
          </h3>
          <p className="text-xs text-slate-400">
            Control de partidos, marcadores y avance automático a la siguiente fase
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Torneo:</span>
          <select
            value={currentTorneo?.id || ''}
            onChange={(e) => onSelectTorneoId(Number(e.target.value))}
            className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs font-semibold text-emerald-400 focus:outline-none focus:border-emerald-500"
          >
            {torneos.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400"></div>
        </div>
      ) : !currentTorneo || partidos.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800">
          <Swords className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h4 className="text-sm font-semibold text-white mb-1">No hay partidos disponibles</h4>
          <p className="text-xs text-slate-400">
            Crea un torneo de 8 equipos para generar el fixture eliminatorio.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Cuartos de final */}
          {cuartos.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Cuartos de Final (4 Partidos)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {cuartos.map((p) => renderPartidoCard(p))}
              </div>
            </div>
          )}

          {/* Semifinales */}
          {semifinales.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-400"></span> Semifinales (2 Partidos)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
                {semifinales.map((p) => renderPartidoCard(p))}
              </div>
            </div>
          )}

          {/* Gran Final */}
          {final.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span> Gran Final
              </h4>
              <div className="max-w-md">
                {final.map((p) => renderPartidoCard(p))}
              </div>
            </div>
          )}

          {/* Otros partidos si aplica */}
          {otrosPartidos.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-slate-400"></span> Fase Regular / Otros
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {otrosPartidos.map((p) => renderPartidoCard(p))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
