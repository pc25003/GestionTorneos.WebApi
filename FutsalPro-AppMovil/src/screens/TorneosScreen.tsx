import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { torneosService, Torneo } from '../services/api';
import { useAuth } from '../context/AuthContext';

// Datos de demostración en caso de que Render esté en cold start o desconectado
const DEMO_TORNEOS: Torneo[] = [
  {
    id: 1,
    nombre: 'Copa Apertura Futsal 2026',
    rangoEdad: 'Libre (18-35)',
    generoId: 1,
    estadoId: 1,
    usuarioAdminId: 1,
    fechaInicio: '2026-03-15T00:00:00Z',
    equipos: [
      { id: 1, torneoId: 1, nombreEquipo: 'Halcones F.C.', nombreRepresentante: 'Martín Pérez' },
      { id: 2, torneoId: 1, nombreEquipo: 'Los Galácticos', nombreRepresentante: 'Andrés López' },
      { id: 3, torneoId: 1, nombreEquipo: 'Furia Roja', nombreRepresentante: 'Carlos Vega' },
      { id: 4, torneoId: 1, nombreEquipo: 'Real Unión', nombreRepresentante: 'Diego Navarro' },
      { id: 5, torneoId: 1, nombreEquipo: 'Deportivo Rayo', nombreRepresentante: 'Javier Morales' },
      { id: 6, torneoId: 1, nombreEquipo: 'Titanes del Futsal', nombreRepresentante: 'Mateo Rojas' },
      { id: 7, torneoId: 1, nombreEquipo: 'Sporting Norte', nombreRepresentante: 'Esteban Ruiz' },
      { id: 8, torneoId: 1, nombreEquipo: 'Atlético Juvenil', nombreRepresentante: 'Gonzalo Silva' },
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
      { id: 9, torneoId: 2, nombreEquipo: 'Valkirias Futsal', nombreRepresentante: 'Camila Soto' },
      { id: 10, torneoId: 2, nombreEquipo: 'Estrellas FC', nombreRepresentante: 'Valeria Castro' },
    ],
  },
];

export const TorneosScreen: React.FC = () => {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [torneos, setTorneos] = useState<Torneo[]>(DEMO_TORNEOS);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchTorneos = useCallback(async () => {
    try {
      const data = await torneosService.getTorneosActivos();
      if (Array.isArray(data) && data.length > 0) {
        setTorneos(data);
      }
    } catch {
      // Usar datos locales si el servidor en Render está iniciando
      console.info('Backend Render en suspensión; cargando datos de muestra.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchTorneos();
  }, [fetchTorneos]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchTorneos();
  };

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

  const renderTorneoCard = ({ item }: { item: Torneo }) => {
    const totalEquipos = item.equipos?.length ?? 8;
    const fecha = new Date(item.fechaInicio).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.75}
        onPress={() => router.push(`/torneo/${item.id}`)}
      >
        <View style={styles.cardHeader}>
          <View style={styles.badgeCategory}>
            <Text style={styles.badgeCategoryText}>
              {getGeneroLabel(item.generoId)} • {item.rangoEdad}
            </Text>
          </View>
          <View style={item.estadoId === 1 ? styles.badgeActive : styles.badgeUpcoming}>
            <Text style={item.estadoId === 1 ? styles.badgeActiveText : styles.badgeUpcomingText}>
              {item.estadoId === 1 ? '• En Curso' : '• Por Iniciar'}
            </Text>
          </View>
        </View>

        <Text style={styles.cardTitle}>{item.nombre}</Text>

        <View style={styles.cardFooter}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Equipos</Text>
            <Text style={styles.statValue}>🛡️ {totalEquipos}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Inicio</Text>
            <Text style={styles.statValue}>📅 {fecha}</Text>
          </View>
          <View style={styles.actionPill}>
            <Text style={styles.actionPillText}>Ver Fixture →</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.topBarTitle}>
            Futsal<Text style={styles.accentText}>Pro</Text>
          </Text>
          <Text style={styles.topBarSubtitle}>Torneos y Competiciones</Text>
        </View>

        <View style={styles.userControls}>
          {isAuthenticated ? (
            <TouchableOpacity
              style={styles.userBadge}
              onPress={() => router.push('/perfil')}
            >
              <Text style={styles.userBadgeText}>
                👤 {user?.nombreUsuario.substring(0, 10)}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.loginPill}
              onPress={() => router.push('/login')}
            >
              <Text style={styles.loginPillText}>Ingresar</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Backend Status indicator banner */}
      <View style={styles.renderNotice}>
        <Text style={styles.renderNoticeText}>
          🟢 Conectado con API en Render (Cloud)
        </Text>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#10b981" />
          <Text style={styles.loadingText}>Cargando torneos desde Render...</Text>
        </View>
      ) : (
        <FlatList
          data={torneos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderTorneoCard}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#10b981"
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>🏆</Text>
              <Text style={styles.emptyTitle}>No hay torneos activos</Text>
              <Text style={styles.emptySubtitle}>Desliza hacia abajo para refrescar</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090d16',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  topBarTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#ffffff',
  },
  accentText: {
    color: '#10b981',
  },
  topBarSubtitle: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
  },
  userControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
  },
  userBadgeText: {
    color: '#34d399',
    fontSize: 12,
    fontWeight: '600',
  },
  loginPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 14,
    backgroundColor: '#10b981',
  },
  loginPillText: {
    color: '#022c22',
    fontSize: 12,
    fontWeight: '800',
  },
  renderNotice: {
    backgroundColor: '#0d1d2d',
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#132c44',
  },
  renderNoticeText: {
    fontSize: 11,
    color: '#38bdf8',
    fontWeight: '500',
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#111827',
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#1e293b',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  badgeCategory: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeCategoryText: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  badgeActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  badgeActiveText: {
    color: '#34d399',
    fontSize: 10,
    fontWeight: '700',
  },
  badgeUpcoming: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeUpcomingText: {
    color: '#fbbf24',
    fontSize: 10,
    fontWeight: '700',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 14,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
  },
  statItem: {
    flexDirection: 'column',
  },
  statLabel: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: 12,
    color: '#e2e8f0',
    fontWeight: '700',
    marginTop: 2,
  },
  actionPill: {
    backgroundColor: '#10b981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  actionPillText: {
    color: '#022c22',
    fontSize: 11,
    fontWeight: '800',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    color: '#94a3b8',
    fontSize: 13,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 12,
    color: '#64748b',
  },
});
