// 📁 src/types/spacehub.types.ts
// Contratos de datos (interfaces) del proyecto SENA SpaceHub

export type RolUsuario = 'Aprendiz' | 'Instructor' | 'Administrador';

export interface UsuarioData {
  id: number;
  nombreCompleto: string;
  correo: string;
  rol: RolUsuario;
  ficha?: string; // Obligatorio en la práctica para Aprendices
}

export interface EquipoData {
  id: number;
  placaSena: string;
  marcaModelo: string;
  ram: string;
  estado: 'Operativo' | 'En Mantenimiento';
}

export interface PrestamoData {
  id: number;
  aprendiz: string;
  ficha: string;
  equipoPlaca: string;
  horaInicio: string;
  estado: 'Activo' | 'Devuelto';
}

export interface IncidenciaData {
  id: number;
  placaSena: string;
  descripcion: string;
  prioridad: 'Alta' | 'Media' | 'Baja';
  resuelta: boolean;
}

export interface AuthState {
  user: UsuarioData | null;
  isAuthenticated: boolean;
  loginSimulado: (correo: string, rol: RolUsuario, ficha?: string) => void;
  logout: () => void;
}
