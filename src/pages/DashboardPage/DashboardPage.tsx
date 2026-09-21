// 📁 src/pages/DashboardPage/DashboardPage.tsx — CLASE 6 (Reto: Dashboard Analítico)
// El panel gerencial ya no calcula nada en el cliente: los totales de equipos,
// préstamos activos, tasa de ocupación global y ocupación por ambiente llegan
// listos desde GET /api/v1/dashboard/stats mediante dashboardService.
// Las Incidencias todavía no tienen endpoint propio, así que ese contador
// sigue viniendo por props (mock local), igual que antes.
import { useEffect, useState } from 'react';
import { dashboardService, type DashboardStats } from '../../services/dashboardService';
import type { IncidenciaData } from '../../types/spacehub.types';

export interface DashboardPageProps {
  incidencias: IncidenciaData[];
}

export default function DashboardPage({ incidencias }: DashboardPageProps) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    dashboardService
      .getStats()
      .then(setStats)
      .catch((err) => setError(err instanceof Error ? err.message : 'Error al cargar el dashboard'))
      .finally(() => setLoading(false));
  }, []);

  const pendientes = incidencias.filter((i) => !i.resuelta).length;

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-white">📊 Panel General SENA SpaceHub</h3>

      {error && (
        <div className="p-3 bg-rose-900/80 border border-rose-500 rounded-xl text-rose-200 text-xs font-mono">{error}</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-mono font-bold">Total Equipos</span>
          <div className="text-2xl font-black text-white">{loading ? '…' : stats?.totalEquipos ?? 0}</div>
        </div>
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-mono font-bold">Equipos Operativos</span>
          <div className="text-2xl font-black text-sky-400">{loading ? '…' : stats?.equiposOperativos ?? 0}</div>
        </div>
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-mono font-bold">Préstamos Activos</span>
          <div className="text-2xl font-black text-sena-green">{loading ? '…' : stats?.prestamosActivos ?? 0}</div>
        </div>
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-mono font-bold">Incidencias Pendientes</span>
          <div className="text-2xl font-black text-amber-400">{pendientes}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1 bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-center space-y-2">
          <span className="text-[10px] text-slate-400 uppercase font-mono font-bold">Tasa de Ocupación Global</span>
          <div className="text-4xl font-black text-sena-green">{loading ? '…' : stats?.tasaOcupacionGlobal ?? '0%'}</div>
          <p className="text-[11px] text-slate-500">Equipos prestados sobre el total del inventario</p>
        </div>

        <div className="lg:col-span-2 bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
          <span className="text-[10px] text-slate-400 uppercase font-mono font-bold">Ocupación por Ambiente</span>
          <div className="space-y-3">
            {loading && <p className="text-xs text-slate-500 font-mono animate-pulse">Cargando ambientes...</p>}
            {!loading && stats?.ambientesOcupacion.length === 0 && (
              <p className="text-xs text-slate-500">No hay ambientes registrados.</p>
            )}
            {stats?.ambientesOcupacion.map((lab) => (
              <div key={lab.ambiente} className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-300 font-semibold">{lab.ambiente}</span>
                  <span className="text-slate-400 font-mono">
                    {lab.equiposPrestados}/{lab.totalEquipos} · {lab.porcentaje}%
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2.5">
                  <div
                    className="bg-sena-green h-2.5 rounded-full transition-all"
                    style={{ width: `${lab.porcentaje}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
