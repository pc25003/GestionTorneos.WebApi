import axios, { AxiosInstance } from 'axios';

// URL base configurada para apuntar al backend desplegado en Render
// Se puede sobreescribir con la variable de entorno EXPO_PUBLIC_API_URL
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || 'https://gestion-torneos-api.onrender.com/api';

// Instancia centralizada de Axios
export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 15000,
});

// Variable en memoria para almacenar el token JWT activo
let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

export const getAuthToken = (): string | null => {
  return authToken;
};

// Interceptor para inyectar automáticamente el Bearer token JWT
api.interceptors.request.use(
  (config) => {
    if (authToken && config.headers) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de respuesta para manejo uniforme de errores de red y backend
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let mensaje = 'Ocurrió un error inesperado al conectar con el servidor.';
    if (error.response?.data?.message) {
      mensaje = error.response.data.message;
    } else if (error.message) {
      mensaje = error.message;
    }
    return Promise.reject(new Error(mensaje));
  }
);

// ==================== DEFINICIÓN DE TIPOS / DTOS ====================

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResponseDTO {
  token: string;
  nombreUsuario: string;
  rol: string;
}

export interface Usuario {
  id: number;
  nombreCompleto: string;
  email: string;
  rolId: number;
}

export interface Equipo {
  id: number;
  torneoId: number;
  nombreEquipo: string;
  nombreRepresentante: string;
}

export interface PartidoTorneo {
  id: number;
  torneoId: number;
  fase: string;
  equipoLocalId?: number | null;
  equipoVisitaId?: number | null;
  equipoLocal?: Equipo | null;
  equipoVisita?: Equipo | null;
  golesLocal?: number | null;
  golesVisita?: number | null;
  ganadorId?: number | null;
  ganador?: Equipo | null;
}

export interface Torneo {
  id: number;
  usuarioAdminId: number;
  estadoId: number;
  generoId: number;
  nombre: string;
  rangoEdad: string;
  fechaInicio: string;
  equipos?: Equipo[];
  partidosTorneo?: PartidoTorneo[];
}

export interface TorneoCreateDTO {
  nombre: string;
  rangoEdad: string;
  generoId: number;
  fechaInicio: string;
  equipos: string[];
}

export interface PartidoUpdateDTO {
  golesLocal: number;
  golesVisita: number;
}

// ==================== SERVICIOS DEL BACKEND ====================

export const authService = {
  login: async (credentials: LoginDTO): Promise<AuthResponseDTO> => {
    const response = await api.post<AuthResponseDTO>('/auth/login', credentials);
    if (response.data.token) {
      setAuthToken(response.data.token);
    }
    return response.data;
  },

  logout: () => {
    setAuthToken(null);
  },
};

export const torneosService = {
  // Lista todos los torneos activos con sus equipos
  getTorneosActivos: async (): Promise<Torneo[]> => {
    const response = await api.get<Torneo[]>('/torneos');
    return response.data;
  },

  // Obtiene el detalle de un torneo por su ID
  getTorneoById: async (id: number): Promise<Torneo> => {
    const response = await api.get<Torneo>(`/torneos/${id}`);
    return response.data;
  },

  // Crea un torneo con generación automática de cuartos de final
  crearTorneo: async (dto: TorneoCreateDTO): Promise<Torneo> => {
    const response = await api.post<Torneo>('/torneos', dto);
    return response.data;
  },

  // Actualiza el marcador de un partido
  actualizarResultado: async (partidoId: number, dto: PartidoUpdateDTO): Promise<PartidoTorneo> => {
    const response = await api.put<PartidoTorneo>(`/torneos/partidos/${partidoId}`, dto);
    return response.data;
  },
};

export default api;
