// 📁 src/pages/PrestamosPage/PrestamosPage.tsx — CLASE 6 (Préstamos + Modal + SweetAlert2)
// El módulo de préstamos ahora vive 100% en el servidor: se consulta y se registra
// mediante prestamosService (API REST + JWT), reemplazando el estado local que
// venía por props desde App.tsx. El formulario se encapsuló en <PrestamoModal/>
// y las confirmaciones/alertas nativas se reemplazaron por SweetAlert2.
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useAuth } from '../../context/AuthContext';
import { prestamosService, type Prestamo } from '../../services/prestamosService';
import { equiposService, type Equipo } from '../../services/equiposService';
import PrestamoModal from './components/PrestamoModal';

// Paleta oscura reutilizada en cada Swal.fire para mantener la coherencia visual
const swalDarkTheme = { background: '#0f172a', color: '#fff' };

export default function PrestamosPage() {
  const { user, isAdmin } = useAuth();

  const [prestamos, setPrestamos] = useState<Prestamo[]>([]);
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);
      const [prestamosData, equiposData] = await Promise.all([prestamosService.getAll(), equiposService.getAll()]);
      setPrestamos(prestamosData);
      setEquipos(equiposData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los préstamos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleCrearPrestamo = async (data: { aprendiz: string; ficha: string; equipoPlaca: string }) => {
    try {
      await prestamosService.create(data);
      await cargarDatos();
      Swal.fire({
        title: '¡Registrado!',
        text: 'El préstamo se ha creado exitosamente.',
        icon: 'success',
        confirmButtonColor: '#39A900',
        ...swalDarkTheme,
      });
    } catch (err) {
      Swal.fire({
        title: 'Error',
        text: err instanceof Error ? err.message : 'No se pudo registrar el préstamo',
        icon: 'error',
        ...swalDarkTheme,
      });
      throw err;
    }
  };

  const handleDevolver = async (id: number) => {
    const result = await Swal.fire({
      title: '¿Confirmar Devolución?',
      text: 'El equipo quedará nuevamente disponible en el inventario.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#39A900',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, registrar devolución',
      cancelButtonText: 'Cancelar',
      ...swalDarkTheme,
    });

    if (!result.isConfirmed) return;

    try {
      await prestamosService.devolver(id);
      await cargarDatos();
      Swal.fire({
        title: '¡Devuelto!',
        text: 'El equipo ha sido devuelto exitosamente.',
        icon: 'success',
        confirmButtonColor: '#39A900',
        ...swalDarkTheme,
      });
    } catch (err) {
      Swal.fire({
        title: 'Error',
        text: err instanceof Error ? err.message : 'No se pudo procesar la devolución',
        icon: 'error',
        ...swalDarkTheme,
      });
    }
  };

  const activos = prestamos.filter((p) => p.estado === 'Activo');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-white">📋 Gestión de Préstamos</h3>
          <p className="text-xs text-slate-400">Control de asignación y devoluciones de equipos de cómputo.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-sena-green text-white text-xs font-bold px-3 py-2 rounded-xl hover:bg-emerald-600 transition shadow-lg"
        >
          + Nuevo Préstamo
        </button>
      </div>

      {error && (
        <div className="p-3 bg-rose-900/80 border border-rose-500 rounded-xl text-rose-200 text-xs font-mono">{error}</div>
      )}

      {loading ? (
        <div className="text-center py-8 text-slate-400 font-mono text-xs animate-pulse">Conectando con el servidor...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {activos.map((p) => (
            <div key={p.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex justify-between items-start">
                <span className="bg-sena-green/10 text-sena-green text-[10px] font-bold px-2 py-0.5 rounded">
                  Ficha #{p.ficha}
                </span>
                <span className="text-[10px] text-slate-400">{p.horaInicio}</span>
              </div>
              <div>
                <h5 className="font-bold text-xs text-white">{p.aprendiz}</h5>
                <p className="text-[11px] text-slate-400">
                  Equipo: <strong className="text-sena-green">{p.equipoPlaca}</strong>
                </p>
              </div>
              {isAdmin && (
                <button
                  onClick={() => handleDevolver(p.id)}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-slate-200 text-[11px] font-bold py-1.5 rounded-xl border border-slate-800"
                >
                  ✅ Registrar Devolución
                </button>
              )}
            </div>
          ))}
          {activos.length === 0 && (
            <div className="md:col-span-3 text-center py-8 text-slate-500 text-xs">No hay préstamos activos registrados.</div>
          )}
        </div>
      )}

      <PrestamoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCrearPrestamo}
        isAdmin={isAdmin}
        defaultNombre={user?.nombreCompleto || ''}
        equipos={equipos}
      />
    </div>
  );
}
