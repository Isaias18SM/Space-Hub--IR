// =================================================================
// Archivo: src/services/api.ts
// RESPONSABILIDAD: Helper central HTTP que adjunta automáticamente el token JWT
// desde sessionStorage y maneja las URLs base utilizando VITE_API_URL.
// =================================================================
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = sessionStorage.getItem('token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error en la comunicación con la API REST');
  }
  return data as T;
}
