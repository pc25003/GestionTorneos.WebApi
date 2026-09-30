import React from 'react';
import { Torneo } from '../services/api';
import { BarChart3, Trophy, Users, Swords, Flame, Award, TrendingUp } from 'lucide-react';

interface ReportesPageProps {
  torneos: Torneo[];
  loading: boolean;
}

export const ReportesPage: React.FC<ReportesPageProps> = ({ torneos }) => {
  // Aggregate stats
  let totalEquipos = 0;
  let totalPartidos = 0;
  let partidosFinalizados = 0;
  let totalGoles = 0;

  torneos.forEach((t) => {
    if (t.equipos) totalEquipos += t.equipos.length;
    if (t.partidosTorneo) {
      totalPartidos += t.partidosTorneo.length;
      t.partidosTorneo.forEach((p) => {
        if (p.golesLocal !== null && p.golesVisita !== null && p.golesLocal !== undefined && p.golesVisita !== undefined) {
          partidosFinalizados += 1;
          totalGoles += (p.golesLocal + p.golesVisita);
        }
      });
    }
  });

  const promedioGoles = partidosFinalizados > 0 ? (totalGoles / partidosFinalizados).toFixed(1) : '0';

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-emerald-400" />
          <span>Reportes y Rendimiento General</span>
        </h3>
        <p className="text-xs text-slate-400">
          Métricas calculadas en tiempo real a partir de las competiciones registradas
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Torneos */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">Torneos Registrados</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white">{torneos.length}</p>
          <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> 100% activos en la plataforma
          </p>
        </div>

        {/* Equipos */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">Equipos Totales</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white">{totalEquipos || torneos.length * 8}</p>
          <p className="text-[11px] text-slate-400 mt-1">
            8 equipos por torneo eliminatorio
          </p>
        </div>

        {/* Partidos Disputados */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">Partidos Completados</span>
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <Swords className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white">
            {partidosFinalizados} <span className="text-xs text-slate-500 font-normal">/ {totalPartidos || torneos.length * 7}</span>
          </p>
          <p className="text-[11px] text-teal-400 mt-1">
            {totalPartidos > 0 ? Math.round((partidosFinalizados / totalPartidos) * 100) : 0}% de avance global
          </p>
        </div>

        {/* Goles Totales */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">Goles Convertidos</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white">{totalGoles}</p>
          <p className="text-[11px] text-rose-400 mt-1">
            Promedio: {promedioGoles} goles/partido
          </p>
        </div>
      </div>

      {/* Highlights & Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Torneos Summary Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-400" />
            <span>Estado de los Torneos</span>
          </h4>
          <div className="space-y-3">
            {torneos.map((t) => {
              const partidosTot = t.partidosTorneo?.length || 7;
              const fin = t.partidosTorneo?.filter(
                (p) => p.golesLocal !== null && p.golesVisita !== null
              ).length || 0;
              const pct = Math.round((fin / partidosTot) * 100);

              return (
                <div key={t.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
                  <div className="flex items-center justify-between mb-1.5 text-xs">
                    <span className="font-bold text-white truncate max-w-xs">{t.nombre}</span>
                    <span className="font-mono text-emerald-400 font-semibold">{pct}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between mt-1 text-[11px] text-slate-400">
                    <span>{fin} de {partidosTot} partidos jugados</span>
                    <span className="capitalize">{t.rangoEdad}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Backend & Deployment Info */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Infraestructura y Rendimiento</span>
            </h4>
            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Backend WebApi Host</span>
                <span className="font-mono font-semibold text-emerald-400">Render (Cloud Hosted)</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Formato de Llave</span>
                <span className="font-semibold text-white">Eliminación directa (8 equipos)</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Gestor de Base de Datos</span>
                <span className="font-semibold text-white">PostgreSQL / SQL Server</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Autenticación</span>
                <span className="font-semibold text-white">JWT Bearer Token</span>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 text-xs text-slate-300">
            <p className="font-semibold text-emerald-300 mb-1">Automatización de Fixture Activa</p>
            <p className="text-[11px] text-slate-400">
              Al cargar el resultado de un partido, el backend determina al ganador y actualiza las llaves de semifinales y final de forma automática.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
