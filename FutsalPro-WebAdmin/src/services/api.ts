import axios from 'axios';

// Configuración base de la API hacia el backend en Render
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://gestion-torneos-api.onrender.com/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Interceptor para inyectar token JWT en cada petición
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('futsalpro_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejo global de respuestas y errores
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Manejo de expiración o token inválido
      localStorage.removeItem('futsalpro_token');
      localStorage.removeItem('futsalpro_user');
    }
    const message = error.response?.data?.message || error.message || 'Error en el servidor';
    return Promise.reject(new Error(message));
  }
);

// ==================== TIPOS / DTOs ====================

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
  rolNombre?: string;
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

export interface TorneoCreateDTO {
  nombre: string;
  rangoEdad: string;
  generoId: number;
  fechaInicio: string;
  nombresEquipos: string[];
}

export interface PartidoUpdateDTO {
  golesLocal: number;
  golesVisita: number;
}

export interface DashboardStats {
  totalTorneos: number;
  totalEquipos: number;
  partidosJugados: number;
  partidosPendientes: number;
  totalUsuarios: number;
}

// ==================== SERVICIOS API ====================

export const authService = {
  login: async (credentials: LoginDTO): Promise<AuthResponseDTO> => {
    const response = await apiClient.post<AuthResponseDTO>('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('futsalpro_token', response.data.token);
      localStorage.setItem('futsalpro_user', JSON.stringify({
        nombre: response.data.nombreUsuario,
        rol: response.data.rol,
      }));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('futsalpro_token');
    localStorage.removeItem('futsalpro_user');
  },

  getCurrentUser: (): { nombre: string; rol: string } | null => {
    const raw = localStorage.getItem('futsalpro_user');
    return raw ? JSON.parse(raw) : null;
  },

  getToken: (): string | null => {
    return localStorage.getItem('futsalpro_token');
  },
};

export const torneosService = {
  getAll: async (): Promise<Torneo[]> => {
    const response = await apiClient.get<Torneo[]>('/torneos');
    return response.data;
  },

  getById: async (id: number): Promise<Torneo> => {
    const response = await apiClient.get<Torneo>(`/torneos/${id}`);
    return response.data;
  },

  create: async (data: TorneoCreateDTO): Promise<Torneo> => {
    const response = await apiClient.post<Torneo>('/torneos', data);
    return response.data;
  },

  updateResultadoPartido: async (partidoId: number, data: PartidoUpdateDTO): Promise<PartidoTorneo> => {
    const response = await apiClient.put<PartidoTorneo>(`/torneos/partidos/${partidoId}`, data);
    return response.data;
  },
};

export const equiposService = {
  getAll: async (): Promise<Equipo[]> => {
    // Si la API no expone /equipos por separado, podemos extraer de torneos o llamar endpoint si existe
    try {
      const response = await apiClient.get<Equipo[]>('/equipos');
      return response.data;
    } catch {
      // Fallback a extraer de torneos
      const torneos = await torneosService.getAll();
      const equiposList: Equipo[] = [];
      torneos.forEach(t => {
        if (t.equipos) equiposList.push(...t.equipos);
      });
      return equiposList;
    }
  },
};

export default apiClient;
