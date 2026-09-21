import type { Usuario, Equipo, Prestamo } from './types';

export const USERS: Usuario[] = [
  { id: 999, nombreCompleto: 'Ing. Roberto Gómez', email: 'roberto.gomez@sena.edu.co', password: 'admin123password', role: 'Administrador' },
  { id: 101, nombreCompleto: 'Ana María Fajardo', email: 'ana.fajardo@sena.edu.co', password: 'aprendiz123password', role: 'Aprendiz' },
  { id: 202, nombreCompleto: 'Prof. Juan Carlos Pérez', email: 'instructor.perez@sena.edu.co', password: 'instructor123password', role: 'Instructor' },
];

export let EQUIPOS: Equipo[] = [
  { id: 1, placaSena: 'SENA-1001', marcaModelo: 'Lenovo ThinkPad L14 G3', ram: '16GB DDR4', ambiente: 'Ambiente 301 - ADSO', estado: 'Operativo' },
  { id: 2, placaSena: 'SENA-1002', marcaModelo: 'HP ProBook 440 G8', ram: '16GB DDR4', ambiente: 'Ambiente 302 - Redes', estado: 'En Mantenimiento' },
  { id: 3, placaSena: 'SENA-1003', marcaModelo: 'Dell Latitude 3420', ram: '32GB DDR5', ambiente: 'Ambiente 301 - ADSO', estado: 'Operativo' },
  { id: 4, placaSena: 'SENA-1004', marcaModelo: 'Lenovo ThinkPad L14 G3', ram: '16GB DDR4', ambiente: 'Ambiente 303 - Hardware', estado: 'Operativo' },
  { id: 5, placaSena: 'SENA-1005', marcaModelo: 'ASUS ExpertBook P2', ram: '8GB DDR4', ambiente: 'Taller Prototipado 3D', estado: 'Operativo' },
];

export function setEquipos(next: Equipo[]) {
  EQUIPOS = next;
}

export const PRESTAMOS: Prestamo[] = [
  { id: 1, aprendiz: 'Ana María Fajardo', ficha: '2879451', equipoPlaca: 'SENA-1001', horaInicio: '08:00 AM', estado: 'Activo', creadoPorRol: 'Aprendiz' },
];
