// =================================================================
// Archivo: src/services/dashboardService.ts
// RESPONSABILIDAD: Capa de servicio que consume el endpoint analítico
// GET /dashboard/stats para alimentar el panel gerencial.
// =================================================================
import { apiFetch } from './api';

export interface AmbienteOcupacion {
  ambiente: string;
  totalEquipos: number;
  equiposPrestados: number;
  porcentaje: number;
}

export interface DashboardStats {
  totalEquipos: number;
  equiposOperativos: number;
  equiposMantenimiento: number;
  prestamosActivos: number;
  tasaOcupacionGlobal: string;
  ambientesOcupacion: AmbienteOcupacion[];
}

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    return apiFetch<DashboardStats>('/dashboard/stats');
  },
};

export default dashboardService;
