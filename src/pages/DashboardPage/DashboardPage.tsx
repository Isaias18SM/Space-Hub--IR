// 📁 src/pages/DashboardPage/DashboardPage.tsx
// Panel gerencial con datos reales de GET /api/v1/dashboard/stats.
// Novedades:
//  - Tarjeta "En Mantenimiento" (equiposMantenimiento del backend).
//  - Rueda estadística (donut) con: En préstamo / Disponibles / En mantenimiento.
//  - Actualización automática cada 10 s, al volver a la pestaña y con botón manual,
//    así los cambios hechos en Inventario o Préstamos se reflejan sin recargar (F5).
import { useCallback, useEffect, useState } from 'react';
import { dashboardService, type DashboardStats } from '../../services/dashboardService';
import DonutChart from '../../components/Donutchart/DonutChart';
import type { IncidenciaData } from '../../types/spacehub.types';

export interface DashboardPageProps {
  incidencias: IncidenciaData[];
}

const INTERVALO_REFRESCO_MS = 10_000;

export default function DashboardPage({ incidencias }: DashboardPageProps) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ultimaActualizacion, setUltimaActualizacion] = useState<Date | null>(null);

  // silencioso = true → refresca sin mostrar "…" (para el refresco automático)
  const cargarStats = useCallback(async (silencioso = false) => {
    try {
      if (!silencioso) setLoading(true);
      const data = await dashboardService.getStats();
      setStats(data);
      setError(null);
      setUltimaActualizacion(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar el dashboard');
    } finally {
      if (!silencioso) setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarStats();
    const intervalo = setInterval(() => cargarStats(true), INTERVALO_REFRESCO_MS);
    const alVolverAPestana = () => cargarStats(true);
    window.addEventListener('focus', alVolverAPestana);
    return () => {
      clearInterval(intervalo);
      window.removeEventListener('focus', alVolverAPestana);
    };
  }, [cargarStats]);

  const pendientes = incidencias.filter((i) => !i.resuelta).length;

  // ----- Datos de la rueda (todos derivados de lo que devuelve el backend) -----
  const total = stats?.totalEquipos ?? 0;
  const prestados = stats?.prestamosActivos ?? 0;
  const mantenimiento = stats?.equiposMantenimiento ?? 0;
  const disponibles = Math.max(total - prestados - mantenimiento, 0);

  const segmentosRueda = [
    { label: 'En préstamo', value: prestados, color: '#39A900' },
    { label: 'Disponibles', value: disponibles, color: '#38bdf8' },
    { label: 'En mantenimiento', value: mantenimiento, color: '#fb923c' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-lg font-bold text-white">📊 Panel General SENA SpaceHub</h3>
        <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono">
          {ultimaActualizacion && <span>Actualizado: {ultimaActualizacion.toLocaleTimeString('es-CO')}</span>}
          <button
            onClick={() => cargarStats()}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 font-sans font-bold"
          >
            ↻ Actualizar
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-rose-900/80 border border-rose-500 rounded-xl text-rose-200 text-xs font-mono">{error}</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-mono font-bold">Total Equipos</span>
          <div className="text-2xl font-black text-white">{loading ? '…' : stats?.totalEquipos ?? 0}</div>
        </div>
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-mono font-bold">Equipos Operativos</span>
          <div className="text-2xl font-black text-sky-400">{loading ? '…' : stats?.equiposOperativos ?? 0}</div>
        </div>

        {/* 🆕 Módulo: equipos en mantenimiento */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-orange-500/30 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-mono font-bold">En Mantenimiento</span>
          <div className="text-2xl font-black text-orange-400">{loading ? '…' : stats?.equiposMantenimiento ?? 0}</div>
          <p className="text-[10px] text-slate-500">🔧 de {loading ? '…' : total} equipos</p>
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
        {/* 🆕 Tarjeta con la rueda estadística */}
        <div className="lg:col-span-1 bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-center space-y-3">
          <span className="text-[10px] text-slate-400 uppercase font-mono font-bold">Tasa de Ocupación Global</span>
          {loading ? (
            <div className="text-4xl font-black text-sena-green py-12">…</div>
          ) : (
            <DonutChart
              segments={segmentosRueda}
              centerLabel={stats?.tasaOcupacionGlobal ?? '0%'}
              centerSubLabel="ocupación"
            />
          )}
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
