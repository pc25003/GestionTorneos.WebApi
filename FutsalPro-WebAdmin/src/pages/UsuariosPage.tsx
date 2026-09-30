import React, { useState } from 'react';
import { UserCheck, ShieldCheck, Mail, Plus, Search } from 'lucide-react';
import { Usuario } from '../services/api';

interface UsuariosPageProps {
  usuarios: Usuario[];
  loading: boolean;
}

export const UsuariosPage: React.FC<UsuariosPageProps> = ({ usuarios, loading }) => {
  const [filterQuery, setFilterQuery] = useState('');

  // Default demo list if backend has just 1 or 2 users
  const defaultList: Usuario[] = usuarios.length > 0 ? usuarios : [
    { id: 1, nombreCompleto: 'Administrador General', email: 'admin@futsalpro.com', rolId: 1, rolNombre: 'Administrador' },
    { id: 2, nombreCompleto: 'Carlos Méndez (Árbitro Principal)', email: 'arbitro.carlos@futsalpro.com', rolId: 2, rolNombre: 'Árbitro' },
    { id: 3, nombreCompleto: 'Laura Gómez (Delegada Halcones)', email: 'laura.gomez@equipos.com', rolId: 3, rolNombre: 'Delegado' },
    { id: 4, nombreCompleto: 'Roberto Silva (Organizador)', email: 'roberto.silva@futsalpro.com', rolId: 1, rolNombre: 'Administrador' },
  ];

  const filtered = defaultList.filter(
    (u) =>
      u.nombreCompleto.toLowerCase().includes(filterQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const getRolBadge = (rolNombre?: string) => {
    switch (rolNombre?.toLowerCase()) {
      case 'administrador':
      case 'admin':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Administrador
          </span>
        );
      case 'árbitro':
      case 'arbitro':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            Árbitro Oficial
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-teal-500/10 text-teal-400 border border-teal-500/20">
            Delegado de Equipo
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-emerald-400" />
            <span>Usuarios y Roles</span>
          </h3>
          <p className="text-xs text-slate-400">
            Gestión de permisos y roles autorizados para el sistema
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por nombre o email..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button
            onClick={() => alert('Funcionalidad de invitación enviada por email.')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-xl transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nuevo Usuario</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400"></div>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-6">Usuario</th>
                  <th className="py-3.5 px-6">Correo Electrónico</th>
                  <th className="py-3.5 px-6">Rol Asignado</th>
                  <th className="py-3.5 px-6">Estado</th>
                  <th className="py-3.5 px-6 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filtered.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-bold">
                          {user.nombreCompleto.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-white">{user.nombreCompleto}</p>
                          <p className="text-[11px] text-slate-500">ID #{user.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-500" />
                        <span>{user.email}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">{getRolBadge(user.rolNombre)}</td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1.5 text-emerald-400 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Activo
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => alert(`Editando permisos de ${user.nombreCompleto}`)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                        title="Editar permisos"
                      >
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
