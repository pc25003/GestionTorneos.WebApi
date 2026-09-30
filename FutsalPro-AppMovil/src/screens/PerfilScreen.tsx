import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../services/api';

export const PerfilScreen: React.FC = () => {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.replace('/');
  };

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
        <Text style={styles.navTitle}>Mi Perfil</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* User Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarBadge}>
            <Text style={styles.avatarText}>
              {isAuthenticated && user?.nombreUsuario ? user.nombreUsuario.charAt(0).toUpperCase() : 'U'}
            </Text>
          </View>

          <Text style={styles.userName}>
            {isAuthenticated ? user?.nombreUsuario : 'Usuario Invitado'}
          </Text>
          <Text style={styles.userRole}>
            {isAuthenticated ? `Rol: ${user?.rol}` : 'Acceso de solo lectura'}
          </Text>
        </View>

        {/* System & Backend info */}
        <View style={styles.infoCard}>
          <Text style={styles.sectionHeader}>Estado del Backend</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Servidor en la Nube</Text>
            <Text style={styles.infoValueActive}>Render (Online)</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Endpoint Base</Text>
            <Text style={styles.infoValue} numberOfLines={1}>
              {API_BASE_URL.replace('https://', '')}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Cliente de Red</Text>
            <Text style={styles.infoValue}>Axios con Interceptors</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Token JWT</Text>
            <Text style={styles.infoValue}>
              {isAuthenticated ? 'Activo en sesión' : 'No autenticado'}
            </Text>
          </View>
        </View>

        {/* Action Button */}
        {isAuthenticated ? (
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.push('/login')}
            activeOpacity={0.8}
          >
            <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
          </TouchableOpacity>
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
    padding: 20,
    alignItems: 'center',
  },
  profileCard: {
    width: '100%',
    backgroundColor: '#111827',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1e293b',
    marginBottom: 20,
  },
  avatarBadge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#022c22',
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
  },
  userRole: {
    fontSize: 12,
    color: '#34d399',
    fontWeight: '600',
    marginTop: 4,
  },
  infoCard: {
    width: '100%',
    backgroundColor: '#111827',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#1e293b',
    marginBottom: 24,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  infoLabel: {
    fontSize: 12,
    color: '#94a3b8',
  },
  infoValue: {
    fontSize: 12,
    color: '#f1f5f9',
    fontWeight: '600',
  },
  infoValueActive: {
    fontSize: 12,
    color: '#34d399',
    fontWeight: '700',
  },
  logoutButton: {
    width: '100%',
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#f87171',
    fontWeight: '800',
    fontSize: 13,
  },
  loginButton: {
    width: '100%',
    backgroundColor: '#10b981',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#022c22',
    fontWeight: '800',
    fontSize: 14,
  },
});
