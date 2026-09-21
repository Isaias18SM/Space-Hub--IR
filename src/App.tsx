// 📁 src/App.tsx — CLASE 6 (Préstamos + Dashboard Analítico)
// El inventario de equipos y ahora también los Préstamos viven en el servidor
// (Node.js + Express + JWT) y se consumen mediante equiposService.ts /
// prestamosService.ts. Incidencias, al no tener todavía un endpoint propio en
// la API, sigue operando con datos simulados en memoria.
import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout/MainLayout';
import LoginPage from './pages/LoginPage/LoginPage';
import DashboardPage from './pages/DashboardPage/DashboardPage';
import EquiposPage from './pages/EquiposPage/EquiposPage';
import NuevoEquipoPage from './pages/NuevoEquipoPage/NuevoEquipoPage';
import DetalleEquipoPage from './pages/DetalleEquipoPage/DetalleEquipoPage';
import PrestamosPage from './pages/PrestamosPage/PrestamosPage';
import IncidenciasPage from './pages/IncidenciasPage/IncidenciasPage';
// 🛡️ Guardia de seguridad: ahora usa <Outlet /> + RBAC por rol
import ProtectedRoute from './routes/ProtectedRoute';
import { incidenciasIniciales } from './data/mockData';
import type { IncidenciaData } from './types/spacehub.types';

export default function App() {
  const [incidencias, setIncidencias] = useState<IncidenciaData[]>(incidenciasIniciales);

  return (
    <Routes>
      {/* 1. Ruta Pública (Accesible para cualquiera) */}
      <Route path="/login" element={<LoginPage />} />

      {/* 2. Nivel 1 de Protección: Requiere cualquier usuario autenticado */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage incidencias={incidencias} />} />

          {/* Inventario: 100% consumido desde la API REST vía equiposService */}
          <Route path="inventario" element={<EquiposPage />} />

          {/* Préstamos: 100% consumido desde la API REST vía prestamosService */}
          <Route path="prestamos" element={<PrestamosPage />} />

          <Route
            path="incidencias"
            element={
              <IncidenciasPage
                incidencias={incidencias}
                onCrear={(i) => setIncidencias((prev) => [...prev, i])}
                onResolver={(id) => setIncidencias((prev) => prev.map((i) => (i.id === id ? { ...i, resuelta: true } : i)))}
              />
            }
          />

          {/* 3. Nivel 2 de Protección (RBAC): Exclusivo para el rol 'Administrador' */}
          <Route element={<ProtectedRoute requiredRole="Administrador" />}>
            <Route path="inventario/nuevo" element={<NuevoEquipoPage />} />
            <Route path="inventario/:placaSena" element={<DetalleEquipoPage />} />
          </Route>
        </Route>
      </Route>

      {/* Ruta Comodín: Redirige cualquier ruta desconocida al login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
