// =================================================================
// Archivo: src/services/equiposService.ts
// RESPONSABILIDAD: Capa de servicio (Service Layer) que encapsula todas las peticiones
// HTTP del dominio de Equipos/Inventario separando la lógica de la vista.
// =================================================================
import { apiFetch } from './api';

export interface Equipo {
  id: number;
  placaSena: string;
  marcaModelo: string;
  ram: string;
  ambiente: string;
  estado: 'Operativo' | 'En Mantenimiento';
}

export const equiposService = {
  getAll: async (): Promise<Equipo[]> => {
    return apiFetch<Equipo[]>('/equipos');
  },
  create: async (data: Omit<Equipo, 'id'>): Promise<Equipo> => {
    return apiFetch<Equipo>('/equipos', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  update: async (placaSena: string, data: Partial<Equipo>): Promise<Equipo> => {
    return apiFetch<Equipo>(`/equipos/${placaSena}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  remove: async (placaSena: string): Promise<{ message: string }> => {
    return apiFetch<{ message: string }>(`/equipos/${placaSena}`, {
      method: 'DELETE',
    });
  },
};

export default equiposService;
