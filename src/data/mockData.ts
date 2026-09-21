// 📁 src/data/mockData.ts
import type { EquipoData, PrestamoData, IncidenciaData } from '../types/spacehub.types';

export const equiposIniciales: EquipoData[] = [
  { id: 1, placaSena: 'SENA-1001', marcaModelo: 'Lenovo ThinkPad L14 G3', ram: '16GB DDR4', estado: 'Operativo' },
  { id: 2, placaSena: 'SENA-1002', marcaModelo: 'HP ProBook 440 G8', ram: '16GB DDR4', estado: 'En Mantenimiento' },
  { id: 3, placaSena: 'SENA-1003', marcaModelo: 'Dell Latitude 3420', ram: '32GB DDR5', estado: 'Operativo' },
  { id: 4, placaSena: 'SENA-1004', marcaModelo: 'Lenovo ThinkPad L14 G3', ram: '16GB DDR4', estado: 'Operativo' },
  { id: 5, placaSena: 'SENA-1005', marcaModelo: 'ASUS ExpertBook P2', ram: '8GB DDR4', estado: 'Operativo' },
];

export const prestamosIniciales: PrestamoData[] = [
  { id: 1, aprendiz: 'Ana María Fajardo', ficha: '2879451', equipoPlaca: 'SENA-1001', horaInicio: '08:00 AM', estado: 'Activo' },
  { id: 2, aprendiz: 'Carlos Mendoza', ficha: '2879451', equipoPlaca: 'SENA-1003', horaInicio: '09:30 AM', estado: 'Activo' },
];

export const incidenciasIniciales: IncidenciaData[] = [
  { id: 1, placaSena: 'SENA-1002', descripcion: 'Falla en el teclado y puerto HDMI intermitente', prioridad: 'Alta', resuelta: false },
  { id: 2, placaSena: 'SENA-1005', descripcion: 'Batería no retiene carga más de 30 minutos', prioridad: 'Media', resuelta: false },
];
