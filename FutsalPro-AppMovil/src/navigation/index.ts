export * from './types';

// Constantes de rutas para navegación coherente
export const ROUTES = {
  LOGIN: '/login' as const,
  TORNEOS: '/' as const,
  TORNEO_DETALLE: (id: number | string) => `/torneo/${id}` as const,
  PERFIL: '/perfil' as const,
};
