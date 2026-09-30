import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { torneosService, Torneo, PartidoTorneo } from '../services/api';

export const TorneoDetalleScreen: React.FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const torneoId = parseInt(id || '1', 10);

  const [torneo, setTorneo] = useState<Torneo | null>(null);
  const [activeTab, setActiveTab] = useState<'fixture' | 'equipos'>('fixture');
  const [loading, setLoading] = useState<boolean>(true);

  const loadTorneoDetalle = useCallback(async () => {
    setLoading(true);
    try {
      const data = await torneosService.getTorneoById(torneoId);
      setTorneo(data);
    } catch {
      // Fallback a torneo local de muestra
      setTorneo({
        id: torneoId,
        nombre: 'Copa Apertura Futsal 2026',
        rangoEdad: 'Libre (18-35)',
        generoId: 1,
        estadoId: 1,
        usuarioAdminId: 1,
        fechaInicio: '2026-03-15T00:00:00Z',
        equipos: [
          { id: 1, torneoId, nombreEquipo: 'Halcones F.C.', nombreRepresentante: 'Martín Pérez' },
          { id: 2, torneoId, nombreEquipo: 'Los Galácticos', nombreRepresentante: 'Andrés López' },
          { id: 3, torneoId, nombreEquipo: 'Furia Roja', nombreRepresentante: 'Carlos Vega' },
          { id: 4, torneoId, nombreEquipo: 'Real Unión', nombreRepresentante: 'Diego Navarro' },
          { id: 5, torneoId, nombreEquipo: 'Deportivo Rayo', nombreRepresentante: 'Javier Morales' },
          { id: 6, torneoId, nombreEquipo: 'Titanes del Futsal', nombreRepresentante: 'Mateo Rojas' },
          { id: 7, torneoId, nombreEquipo: 'Sporting Norte', nombreRepresentante: 'Esteban Ruiz' },
          { id: 8, torneoId, nombreEquipo: 'Atlético Juvenil', nombreRepresentante: 'Gonzalo Silva' },
        ],
        partidosTorneo: [
          {
            id: 101,
            torneoId,
            fase: 'Cuartos de Final',
            equipoLocalId: 1,
            equipoVisitaId: 2,
            equipoLocal: { id: 1, torneoId, nombreEquipo: 'Halcones F.C.', nombreRepresentante: 'Martín Pérez' },
            equipoVisita: { id: 2, torneoId, nombreEquipo: 'Los Galácticos', nombreRepresentante: 'Andrés López' },
            golesLocal: 4,
            golesVisita: 2,
            ganadorId: 1,
          },
          {
            id: 102,
            torneoId,
            fase: 'Cuartos de Final',
            equipoLocalId: 3,
            equipoVisitaId: 4,
            equipoLocal: { id: 3, torneoId, nombreEquipo: 'Furia Roja', nombreRepresentante: 'Carlos Vega' },
            equipoVisita: { id: 4, torneoId, nombreEquipo: 'Real Unión', nombreRepresentante: 'Diego Navarro' },
            golesLocal: 1,
            golesVisita: 3,
            ganadorId: 4,
          },
          {
            id: 103,
            torneoId,
            fase: 'Cuartos de Final',
            equipoLocalId: 5,
            equipoVisitaId: 6,
            equipoLocal: { id: 5, torneoId, nombreEquipo: 'Deportivo Rayo', nombreRepresentante: 'Javier Morales' },
            equipoVisita: { id: 6, torneoId, nombreEquipo: 'Titanes del Futsal', nombreRepresentante: 'Mateo Rojas' },
            golesLocal: 5,
            golesVisita: 3,
            ganadorId: 5,
          },
          {
            id: 104,
            torneoId,
            fase: 'Cuartos de Final',
            equipoLocalId: 7,
            equipoVisitaId: 8,
            equipoLocal: { id: 7, torneoId, nombreEquipo: 'Sporting Norte', nombreRepresentante: 'Esteban Ruiz' },
            equipoVisita: { id: 8, torneoId, nombreEquipo: 'Atlético Juvenil', nombreRepresentante: 'Gonzalo Silva' },
            golesLocal: null,
            golesVisita: null,
            ganadorId: null,
          },
          {
            id: 105,
            torneoId,
            fase: 'Semifinal 1',
            equipoLocalId: 1,
            equipoVisitaId: 4,
            equipoLocal: { id: 1, torneoId, nombreEquipo: 'Halcones F.C.', nombreRepresentante: 'Martín Pérez' },
            equipoVisita: { id: 4, torneoId, nombreEquipo: 'Real Unión', nombreRepresentante: 'Diego Navarro' },
            golesLocal: null,
            golesVisita: null,
            ganadorId: null,
          },
        ],
      });
    } finally {
      setLoading(false);
    }
  }, [torneoId]);

  useEffect(() => {
    loadTorneoDetalle();
  }, [loadTorneoDetalle]);

  if (loading) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#10b981" />
        <Text style={styles.loadingText}>Cargando fixture del torneo...</Text>
      </SafeAreaView>
    );
  }

  if (!torneo) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Text style={styles.errorText}>No se encontró la información del torneo.</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>← Volver a Torneos</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const partidos = torneo.partidosTorneo || [];
  const equipos = torneo.equipos || [];

  return (
    <SafeAreaView style={styles.container}>
      {/* Navigation Top Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity
          style={styles.navBackPill}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Text style={styles.navBackText}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.navTitle} numberOfLines={1}>
          Detalle del Torneo
        </Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Banner Card */}
        <View style={styles.bannerCard}>
          <Text style={styles.bannerBadge}>
            CATEGORÍA {torneo.generoId === 1 ? 'MASCULINO' : 'FEMENINO'} • {torneo.rangoEdad}
          </Text>
          <Text style={styles.bannerTitle}>{torneo.nombre}</Text>
          <Text style={styles.bannerSubtitle}>
            📅 Fecha de Inicio: {new Date(torneo.fechaInicio).toLocaleDateString('es-ES')}
          </Text>
        </View>

        {/* Tab Controls */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'fixture' && styles.tabButtonActive]}
            onPress={() => setActiveTab('fixture')}
          >
            <Text
              style={[styles.tabText, activeTab === 'fixture' && styles.tabTextActive]}
            >
              ⚽ Fixture ({partidos.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'equipos' && styles.tabButtonActive]}
            onPress={() => setActiveTab('equipos')}
          >
            <Text
              style={[styles.tabText, activeTab === 'equipos' && styles.tabTextActive]}
            >
              🛡️ Equipos ({equipos.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content based on tab */}
        {activeTab === 'fixture' ? (
          <View style={styles.section}>
            {partidos.length === 0 ? (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyText}>No hay partidos programados aún.</Text>
              </View>
            ) : (
              partidos.map((partido: PartidoTorneo) => {
                const isFinished =
                  partido.golesLocal !== null &&
                  partido.golesVisita !== null &&
                  partido.golesLocal !== undefined &&
                  partido.golesVisita !== undefined;

                const localNom = partido.equipoLocal?.nombreEquipo || `Equipo #${partido.equipoLocalId || 'TBD'}`;
                const visitaNom = partido.equipoVisita?.nombreEquipo || `Equipo #${partido.equipoVisitaId || 'TBD'}`;

                return (
                  <View key={partido.id} style={styles.matchCard}>
                    <View style={styles.matchHeader}>
                      <Text style={styles.matchPhase}>{partido.fase || 'Eliminatoria'}</Text>
                      <Text style={isFinished ? styles.matchStatusDone : styles.matchStatusPending}>
                        {isFinished ? '✓ Jugado' : '⏳ Pendiente'}
                      </Text>
                    </View>

                    <View style={styles.teamRow}>
                      <Text style={[styles.teamName, isFinished && partido.ganadorId === partido.equipoLocalId && styles.winnerTeam]}>
                        {localNom}
                      </Text>
                      <Text style={styles.teamScore}>
                        {partido.golesLocal ?? '-'}
                      </Text>
                    </View>

                    <View style={styles.teamRow}>
                      <Text style={[styles.teamName, isFinished && partido.ganadorId === partido.equipoVisitaId && styles.winnerTeam]}>
                        {visitaNom}
                      </Text>
                      <Text style={styles.teamScore}>
                        {partido.golesVisita ?? '-'}
                      </Text>
                    </View>
                  </View>
                );
              })
            )}
          </View>
        ) : (
          <View style={styles.section}>
            {equipos.map((equipo, idx) => (
              <View key={equipo.id} style={styles.teamCard}>
                <View style={styles.teamBadge}>
                  <Text style={styles.teamNumber}>{idx + 1}</Text>
                </View>
                <View style={styles.teamInfo}>
                  <Text style={styles.teamTitle}>{equipo.nombreEquipo}</Text>
                  <Text style={styles.teamRep}>Rep: {equipo.nombreRepresentante}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090d16',
  },
  centerContainer: {
    flex: 1,
    backgroundColor: '#090d16',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    color: '#94a3b8',
    fontSize: 13,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  navBackPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#1e293b',
  },
  navBackText: {
    color: '#34d399',
    fontSize: 12,
    fontWeight: '700',
  },
  navTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  bannerCard: {
    backgroundColor: '#111827',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#1e293b',
    marginBottom: 16,
  },
  bannerBadge: {
    color: '#10b981',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  bannerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#ffffff',
    marginBottom: 6,
  },
  bannerSubtitle: {
    fontSize: 12,
    color: '#94a3b8',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#111827',
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabButtonActive: {
    backgroundColor: '#10b981',
  },
  tabText: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#022c22',
    fontWeight: '800',
  },
  section: {
    gap: 12,
  },
  matchCard: {
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  matchPhase: {
    fontSize: 11,
    fontWeight: '700',
    color: '#34d399',
    textTransform: 'uppercase',
  },
  matchStatusDone: {
    fontSize: 11,
    color: '#10b981',
    fontWeight: '600',
  },
  matchStatusPending: {
    fontSize: 11,
    color: '#fbbf24',
    fontWeight: '600',
  },
  teamRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  teamName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e2e8f0',
  },
  winnerTeam: {
    color: '#34d399',
    fontWeight: '800',
  },
  teamScore: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ffffff',
    backgroundColor: '#1e293b',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 6,
  },
  teamCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  teamBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#1e293b',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  teamNumber: {
    color: '#34d399',
    fontWeight: '800',
    fontSize: 14,
  },
  teamInfo: {
    flex: 1,
  },
  teamTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  teamRep: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  emptyCard: {
    padding: 24,
    backgroundColor: '#111827',
    borderRadius: 16,
    alignItems: 'center',
  },
  emptyText: {
    color: '#64748b',
    fontSize: 13,
  },
  errorText: {
    color: '#f87171',
    fontSize: 14,
    marginBottom: 16,
  },
  backButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#1e293b',
  },
  backButtonText: {
    color: '#34d399',
    fontSize: 13,
    fontWeight: '700',
  },
});
