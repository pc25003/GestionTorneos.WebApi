import React, { useState, useEffect } from 'react';
import { X, Trophy, Swords, AlertCircle } from 'lucide-react';
import { PartidoTorneo, PartidoUpdateDTO } from '../services/api';

interface ModalEditarPartidoProps {
  isOpen: boolean;
  partido: PartidoTorneo | null;
  onClose: () => void;
  onSubmit: (partidoId: number, dto: PartidoUpdateDTO) => Promise<void>;
  loading: boolean;
}

export const ModalEditarPartido: React.FC<ModalEditarPartidoProps> = ({
  isOpen,
  partido,
  onClose,
  onSubmit,
  loading,
}) => {
  const [golesLocal, setGolesLocal] = useState<number>(0);
  const [golesVisita, setGolesVisita] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (partido) {
      setGolesLocal(partido.golesLocal ?? 0);
      setGolesVisita(partido.golesVisita ?? 0);
      setError(null);
    }
  }, [partido]);

  if (!isOpen || !partido) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (golesLocal < 0 || golesVisita < 0) {
      setError('Los goles no pueden ser números negativos.');
      return;
    }

    if (golesLocal === golesVisita) {
      setError('En fase eliminatoria debe haber un ganador (desempate obligatorio).');
      return;
    }

    try {
      await onSubmit(partido.id, {
        golesLocal: Number(golesLocal),
        golesVisita: Number(golesVisita),
      });
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Error al actualizar el marcador.');
      }
    }
  };

  const localNombre = partido.equipoLocal?.nombreEquipo || `Equipo #${partido.equipoLocalId || 'Por definir'}`;
  const visitaNombre = partido.equipoVisita?.nombreEquipo || `Equipo #${partido.equipoVisitaId || 'Por definir'}`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Swords className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Actualizar Marcador</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="text-center">
            <span className="px-3 py-1 rounded-full bg-slate-800 text-xs font-semibold text-emerald-400 uppercase tracking-wider border border-slate-700">
              {partido.fase || 'Eliminatoria'}
            </span>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Teams and Score inputs */}
          <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-slate-950 border border-slate-800/80">
            {/* Local */}
            <div className="flex-1 text-center">
              <p className="text-xs font-bold text-slate-200 mb-2 truncate" title={localNombre}>
                {localNombre}
              </p>
              <input
                type="number"
                min="0"
                max="99"
                value={golesLocal}
                onChange={(e) => setGolesLocal(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-16 h-14 mx-auto text-center text-2xl font-black rounded-xl bg-slate-900 border border-slate-700 text-emerald-400 focus:outline-none focus:border-emerald-500"
              />
              <span className="block text-[10px] text-slate-500 mt-1 uppercase font-semibold">Local</span>
            </div>

            <div className="text-xl font-black text-slate-600">VS</div>

            {/* Visita */}
            <div className="flex-1 text-center">
              <p className="text-xs font-bold text-slate-200 mb-2 truncate" title={visitaNombre}>
                {visitaNombre}
              </p>
              <input
                type="number"
                min="0"
                max="99"
                value={golesVisita}
                onChange={(e) => setGolesVisita(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-16 h-14 mx-auto text-center text-2xl font-black rounded-xl bg-slate-900 border border-slate-700 text-emerald-400 focus:outline-none focus:border-emerald-500"
              />
              <span className="block text-[10px] text-slate-500 mt-1 uppercase font-semibold">Visita</span>
            </div>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
            <span>El ganador avanzará automáticamente a la siguiente fase en la llave del torneo.</span>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 active:scale-95 transition disabled:opacity-50"
            >
              {loading ? 'Guardando...' : 'Guardar Resultado'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
