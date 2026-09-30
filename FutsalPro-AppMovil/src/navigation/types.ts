/**
 * Definiciones de tipos para la navegación de FutsalPro Móvil
 */

export type RootStackParamList = {
  Login: undefined;
  Torneos: undefined;
  TorneoDetalle: { id: number; nombre?: string };
  Perfil: undefined;
};

export type AppRoutes = keyof RootStackParamList;
