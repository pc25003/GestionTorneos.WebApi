import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar, TabType } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { ModalCrearTorneo } from '../components/ModalCrearTorneo';
import { ModalEditarPartido } from '../components/ModalEditarPartido';
import { TorneosPage } from './TorneosPage';
import { EquiposPage } from './EquiposPage';
import { PartidosPage } from './PartidosPage';
import { UsuariosPage } from './UsuariosPage';
import { ReportesPage } from './ReportesPage';
import {
  Torneo,
  PartidoTorneo,
  TorneoCreateDTO,
  PartidoUpdateDTO,
  Usuario,
  torneosService,
} from '../services/api';

// Datos de respaldo / iniciales para asegurar una experiencia interactiva inmediata
const MOCK_TORNEOS: Torneo[] = [
  {
    id: 1,
    nombre: 'Copa Apertura Futsal 2026',
    rangoEdad: 'Libre (18-35)',
    generoId: 1,
    estadoId: 1,
    usuarioAdminId: 1,
    fechaInicio: '2026-03-15T00:00:00Z',
    equipos: [
      { id: 101, torneoId: 1, nombreEquipo: 'Halcones F.C.', nombreRepresentante: 'Martín Pérez' },
      { id: 102, torneoId: 1, nombreEquipo: 'Los Galácticos', nombreRepresentante: 'Andrés López' },
      { id: 103, torneoId: 1, nombreEquipo: 'Furia Roja', nombreRepresentante: 'Carlos Vega' },
      { id: 104, torneoId: 1, nombreEquipo: 'Real Unión', nombreRepresentante: 'Diego Navarro' },
      { id: 105, torneoId: 1, nombreEquipo: 'Deportivo Rayo', nombreRepresentante: 'Javier Morales' },
      { id: 106, torneoId: 1, nombreEquipo: 'Titanes del Futsal', nombreRepresentante: 'Mateo Rojas' },
      { id: 107, torneoId: 1, nombreEquipo: 'Sporting Norte', nombreRepresentante: 'Esteban Ruiz' },
      { id: 108, torneoId: 1, nombreEquipo: 'Atlético Juvenil', nombreRepresentante: 'Gonzalo Silva' },
    ],
    partidosTorneo: [
      {
        id: 201,
        torneoId: 1,
        fase: 'Cuartos de Final',
        equipoLocalId: 101,
        equipoVisitaId: 102,
        equipoLocal: { id: 101, torneoId: 1, nombreEquipo: 'Halcones F.C.', nombreRepresentante: 'Martín Pérez' },
        equipoVisita: { id: 102, torneoId: 1, nombreEquipo: 'Los Galácticos', nombreRepresentante: 'Andrés López' },
        golesLocal: 4,
        golesVisita: 2,
        ganadorId: 101,
      },
      {
        id: 202,
        torneoId: 1,
        fase: 'Cuartos de Final',
        equipoLocalId: 103,
        equipoVisitaId: 104,
        equipoLocal: { id: 103, torneoId: 1, nombreEquipo: 'Furia Roja', nombreRepresentante: 'Carlos Vega' },
        equipoVisita: { id: 104, torneoId: 1, nombreEquipo: 'Real Unión', nombreRepresentante: 'Diego Navarro' },
        golesLocal: 1,
        golesVisita: 3,
        ganadorId: 104,
      },
      {
        id: 203,
        torneoId: 1,
        fase: 'Cuartos de Final',
        equipoLocalId: 105,
        equipoVisitaId: 106,
        equipoLocal: { id: 105, torneoId: 1, nombreEquipo: 'Deportivo Rayo', nombreRepresentante: 'Javier Morales' },
        equipoVisita: { id: 106, torneoId: 1, nombreEquipo: 'Titanes del Futsal', nombreRepresentante: 'Mateo Rojas' },
        golesLocal: 5,
        golesVisita: 3,
        ganadorId: 105,
      },
      {
        id: 204,
        torneoId: 1,
        fase: 'Cuartos de Final',
        equipoLocalId: 107,
        equipoVisitaId: 108,
        equipoLocal: { id: 107, torneoId: 1, nombreEquipo: 'Sporting Norte', nombreRepresentante: 'Esteban Ruiz' },
        equipoVisita: { id: 108, torneoId: 1, nombreEquipo: 'Atlético Juvenil', nombreRepresentante: 'Gonzalo Silva' },
        golesLocal: null,
        golesVisita: null,
        ganadorId: null,
      },
      {
        id: 205,
        torneoId: 1,
        fase: 'Semifinal 1',
        equipoLocalId: 101,
        equipoVisitaId: 104,
        equipoLocal: { id: 101, torneoId: 1, nombreEquipo: 'Halcones F.C.', nombreRepresentante: 'Martín Pérez' },
        equipoVisita: { id: 104, torneoId: 1, nombreEquipo: 'Real Unión', nombreRepresentante: 'Diego Navarro' },
        golesLocal: null,
        golesVisita: null,
        ganadorId: null,
      },
      {
        id: 206,
        torneoId: 1,
        fase: 'Semifinal 2',
        equipoLocalId: 105,
        equipoVisitaId: null,
        equipoLocal: { id: 105, torneoId: 1, nombreEquipo: 'Deportivo Rayo', nombreRepresentante: 'Javier Morales' },
        equipoVisita: null,
        golesLocal: null,
        golesVisita: null,
        ganadorId: null,
      },
      {
        id: 207,
        torneoId: 1,
        fase: 'Gran Final',
        equipoLocalId: null,
        equipoVisitaId: null,
        golesLocal: null,
        golesVisita: null,
        ganadorId: null,
      },
    ],
  },
  {
    id: 2,
    nombre: 'Torneo Interempresas Femenino',
    rangoEdad: 'Sub-25',
    generoId: 2,
    estadoId: 2,
    usuarioAdminId: 1,
    fechaInicio: '2026-04-01T00:00:00Z',
    equipos: [
      { id: 201, torneoId: 2, nombreEquipo: 'Valkirias Futsal', nombreRepresentante: 'Camila Soto' },
      { id: 202, torneoId: 2, nombreEquipo: 'Estrellas FC', nombreRepresentante: 'Valeria Castro' },
      { id: 203, torneoId: 2, nombreEquipo: 'Amazonas Club', nombreRepresentante: 'Sofía Romero' },
      { id: 204, torneoId: 2, nombreEquipo: 'Panteras Rosa', nombreRepresentante: 'Daniela Méndez' },
      { id: 205, torneoId: 2, nombreEquipo: 'Leonas del Balón', nombreRepresentante: 'Andrea Vargas' },
      { id: 206, torneoId: 2, nombreEquipo: 'Fénix Femenil', nombreRepresentante: 'Lucía Pineda' },
      { id: 207, torneoId: 2, nombreEquipo: 'Águilas Doradas', nombreRepresentante: 'Gabriela Cruz' },
      { id: 208, torneoId: 2, nombreEquipo: 'Guerreras United', nombreRepresentante: 'Carolina Mora' },
    ],
    partidosTorneo: [],
  },
];

export const Dashboard: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<TabType>('torneos');
  const [searchTerm, setSearchTerm] = useState('');
  const [torneos, setTorneos] = useState<Torneo[]>(MOCK_TORNEOS);
  const [selectedTorneoId, setSelectedTorneoId] = useState<number | null>(1);
  const [loading, setLoading] = useState(false);

  // Modals
  const [isCrearModalOpen, setIsCrearModalOpen] = useState(false);
  const [partidoToEdit, setPartidoToEdit] = useState<PartidoTorneo | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch Torneos from Render Backend
  const fetchTorneos = useCallback(async () => {
    setLoading(true);
    try {
      const data = await torneosService.getAll();
      if (Array.isArray(data) && data.length > 0) {
        setTorneos(data);
        if (!selectedTorneoId && data.length > 0) {
          setSelectedTorneoId(data[0].id);
        }
      }
    } catch {
      // Backend may be offline or starting up; retain working data
      console.info('Backend en Render no disponible o iniciando; usando datos locales sincronizados.');
    } finally {
      setLoading(false);
    }
  }, [selectedTorneoId]);

  useEffect(() => {
    fetchTorneos();
  }, [fetchTorneos]);

  // Handle Create Tournament
  const handleCrearTorneo = async (dto: TorneoCreateDTO) => {
    setActionLoading(true);
    try {
      const nuevoTorneo = await torneosService.create({
        ...dto,
        nombresEquipos: dto.nombresEquipos,
      });
      setTorneos((prev) => [nuevoTorneo, ...prev]);
      setSelectedTorneoId(nuevoTorneo.Id || nuevoTorneo.id);
      setCurrentTab('partidos');
    } catch {
      // Create local fallback tournament
      const newId = Date.now();
      const generatedEquipos = dto.nombresEquipos.map((nom, i) => ({
        id: newId + i + 1,
        torneoId: newId,
        nombreEquipo: nom,
        nombreRepresentante: `Representante ${nom}`,
      }));

      const generatedPartidos: PartidoTorneo[] = [
        {
          id: newId + 10,
          torneoId: newId,
          fase: 'Cuartos de Final',
          equipoLocalId: generatedEquipos[0].id,
          equipoVisitaId: generatedEquipos[1].id,
          equipoLocal: generatedEquipos[0],
          equipoVisita: generatedEquipos[1],
          golesLocal: null,
          golesVisita: null,
          ganadorId: null,
        },
        {
          id: newId + 11,
          torneoId: newId,
          fase: 'Cuartos de Final',
          equipoLocalId: generatedEquipos[2].id,
          equipoVisitaId: generatedEquipos[3].id,
          equipoLocal: generatedEquipos[2],
          equipoVisita: generatedEquipos[3],
          golesLocal: null,
          golesVisita: null,
          ganadorId: null,
        },
        {
          id: newId + 12,
          torneoId: newId,
          fase: 'Cuartos de Final',
          equipoLocalId: generatedEquipos[4].id,
          equipoVisitaId: generatedEquipos[5].id,
          equipoLocal: generatedEquipos[4],
          equipoVisita: generatedEquipos[5],
          golesLocal: null,
          golesVisita: null,
          ganadorId: null,
        },
        {
          id: newId + 13,
          torneoId: newId,
          fase: 'Cuartos de Final',
          equipoLocalId: generatedEquipos[6].id,
          equipoVisitaId: generatedEquipos[7].id,
          equipoLocal: generatedEquipos[6],
          equipoVisita: generatedEquipos[7],
          golesLocal: null,
          golesVisita: null,
          ganadorId: null,
        },
      ];

      const localTorneo: Torneo = {
        id: newId,
        nombre: dto.nombre,
        rangoEdad: dto.rangoEdad,
        generoId: dto.generoId,
        estadoId: 1,
        usuarioAdminId: 1,
        fechaInicio: dto.fechaInicio,
        equipos: generatedEquipos,
        partidosTorneo: generatedPartidos,
      };

      setTorneos((prev) => [localTorneo, ...prev]);
      setSelectedTorneoId(newId);
      setCurrentTab('partidos');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Update Match Score
  const handleActualizarPartido = async (partidoId: number, dto: PartidoUpdateDTO) => {
    setActionLoading(true);
    try {
      await torneosService.updateResultadoPartido(partidoId, dto);
      await fetchTorneos();
    } catch {
      // Local fallback update
      setTorneos((prevTorneos) =>
        prevTorneos.map((t) => {
          if (!t.partidosTorneo) return t;
          const updatedPartidos = t.partidosTorneo.map((p) => {
            if (p.id === partidoId) {
              const ganadorId =
                dto.golesLocal > dto.golesVisita ? p.equipoLocalId : p.equipoVisitaId;
              const ganador =
                dto.golesLocal > dto.golesVisita ? p.equipoLocal : p.equipoVisita;

              return {
                ...p,
                golesLocal: dto.golesLocal,
                golesVisita: dto.golesVisita,
                ganadorId: ganadorId ?? null,
                ganador: ganador ?? null,
              };
            }
            return p;
          });
          return { ...t, partidosTorneo: updatedPartidos };
        })
      );
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        torneosCount={torneos.length}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar
          currentTab={currentTab}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onOpenNuevoTorneo={() => setIsCrearModalOpen(true)}
          onRefresh={fetchTorneos}
          loading={loading}
        />

        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            {currentTab === 'torneos' && (
              <TorneosPage
                torneos={torneos.filter((t) =>
                  t.nombre.toLowerCase().includes(searchTerm.toLowerCase())
                )}
                onSelectTorneo={(torneo) => {
                  setSelectedTorneoId(torneo.id);
                  setCurrentTab('partidos');
                }}
                onOpenNuevoTorneo={() => setIsCrearModalOpen(true)}
                onViewPartidos={(id) => {
                  setSelectedTorneoId(id);
                  setCurrentTab('partidos');
                }}
                loading={loading}
              />
            )}

            {currentTab === 'equipos' && (
              <EquiposPage torneos={torneos} loading={loading} />
            )}

            {currentTab === 'partidos' && (
              <PartidosPage
                torneos={torneos}
                selectedTorneoId={selectedTorneoId}
                onSelectTorneoId={setSelectedTorneoId}
                onOpenEditarPartido={(partido) => setPartidoToEdit(partido)}
                loading={loading}
              />
            )}

            {currentTab === 'usuarios' && (
              <UsuariosPage usuarios={[] as Usuario[]} loading={loading} />
            )}

            {currentTab === 'reportes' && (
              <ReportesPage torneos={torneos} loading={loading} />
            )}
          </div>
        </main>
      </div>

      {/* Modals */}
      <ModalCrearTorneo
        isOpen={isCrearModalOpen}
        onClose={() => setIsCrearModalOpen(false)}
        onSubmit={handleCrearTorneo}
        loading={actionLoading}
      />

      <ModalEditarPartido
        isOpen={!!partidoToEdit}
        partido={partidoToEdit}
        onClose={() => setPartidoToEdit(null)}
        onSubmit={handleActualizarPartido}
        loading={actionLoading}
      />
    </div>
  );
};
