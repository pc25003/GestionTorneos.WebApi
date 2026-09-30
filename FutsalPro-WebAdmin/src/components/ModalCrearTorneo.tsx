import React, { useState } from 'react';
import { X, Trophy, Sparkles, AlertCircle } from 'lucide-react';
import { TorneoCreateDTO } from '../services/api';

interface ModalCrearTorneoProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dto: TorneoCreateDTO) => Promise<void>;
  loading: boolean;
}

export const ModalCrearTorneo: React.FC<ModalCrearTorneoProps> = ({
  isOpen,
  onClose,
  onSubmit,
  loading,
}) => {
  const [nombre, setNombre] = useState('');
  const [rangoEdad, setRangoEdad] = useState('Libre');
  const [generoId, setGeneroId] = useState(1); // 1 = Masculino, 2 = Femenino, 3 = Mixto
  const [fechaInicio, setFechaInicio] = useState(() =>
    new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]
  );
  const [equipos, setEquipos] = useState<string[]>([
    'Halcones F.C.',
    'Los Galácticos',
    'Furia Roja',
    'Real Unión',
    'Deportivo Rayo',
    'Titanes del Futsal',
    'Sporting Norte',
    'Atlético Juvenil',
  ]);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleEquipoChange = (index: number, value: string) => {
    const updated = [...equipos];
    updated[index] = value;
    setEquipos(updated);
  };

  const handleLlenarEjemplo = () => {
    setNombre('Copa Apertura Futsal 2026');
    setRangoEdad('Libre (18-35)');
    setGeneroId(1);
    setEquipos([
      'Halcones F.C.',
      'Los Galácticos',
      'Furia Roja',
      'Real Unión',
      'Deportivo Rayo',
      'Titanes del Futsal',
      'Sporting Norte',
      'Atlético Juvenil',
    ]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!nombre.trim()) {
      setError('Por favor indica el nombre del torneo.');
      return;
    }

    const filteredEquipos = equipos.map((e) => e.trim()).filter((e) => e.length > 0);
    if (filteredEquipos.length !== 8) {
      setError('El torneo de eliminación directa requiere exactamente 8 equipos.');
      return;
    }

    try {
      await onSubmit({
        nombre: nombre.trim(),
        rangoEdad: rangoEdad.trim(),
        generoId,
        fechaInicio: new Date(fechaInicio).toISOString(),
        nombresEquipos: filteredEquipos,
      });
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocurrió un error al crear el torneo.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Crear Nuevo Torneo</h3>
              <p className="text-xs text-slate-400">Genera automáticamente el fixture de Cuartos de Final</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleLlenarEjemplo}
              className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Rellenar con datos de prueba</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Nombre del Torneo *
              </label>
              <input
                type="text"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej. Torneo Clausura 2026"
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Rango de Edad *
              </label>
              <input
                type="text"
                required
                value={rangoEdad}
                onChange={(e) => setRangoEdad(e.target.value)}
                placeholder="Ej. Libre, Sub-20, Senior +35"
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Categoría / Género *
              </label>
              <select
                value={generoId}
                onChange={(e) => setGeneroId(Number(e.target.value))}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value={1}>Masculino</option>
                <option value={2}>Femenino</option>
                <option value={3}>Mixto</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Fecha de Inicio *
              </label>
              <input
                type="date"
                required
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-300">
                8 Equipos Participantes (Llaves de Cuartos de Final)
              </label>
              <span className="text-[11px] text-slate-400">Exactamente 8 requeridos</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-48 overflow-y-auto p-1">
              {equipos.map((equipo, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="w-5 text-center text-xs font-mono text-slate-500">
                    {index + 1}.
                  </span>
                  <input
                    type="text"
                    required
                    value={equipo}
                    onChange={(e) => handleEquipoChange(index, e.target.value)}
                    placeholder={`Equipo ${index + 1}`}
                    className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
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
              {loading ? 'Creando fixture...' : 'Crear Torneo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
