// 📁 src/pages/EquiposPage/EquiposPage.tsx — CLASE 5 (API REST)
// El inventario ya NO recibe datos por props: se consume en vivo desde el backend
// mediante GET /api/v1/equipos. Eliminar es DELETE /api/v1/equipos/:placaSena
// y solo está disponible para el rol Administrador.
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { equiposService, type Equipo } from '../../services/equiposService';
import { useAuth } from '../../context/AuthContext';

export default function EquiposPage() {
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAdmin } = useAuth();

  const loadEquipos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await equiposService.getAll();
      setEquipos(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEquipos();
  }, []);

  const handleDelete = async (placaSena: string) => {
    if (!window.confirm(`¿Eliminar el equipo ${placaSena}?`)) return;
    try {
      await equiposService.remove(placaSena);
      loadEquipos();
    } catch (err: unknown) {
      alert(`Error API: ${err instanceof Error ? err.message : 'Error al eliminar'}`);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-white">💻 Inventario de Equipos SENA</h3>
          <p className="text-xs text-slate-400">Datos obtenidos a través de la capa de servicio (equiposService.ts)</p>
        </div>
        {isAdmin && (
          <Link
            to="/inventario/nuevo"
            className="bg-sena-green text-white text-xs font-bold px-3 py-1.5 rounded-xl hover:bg-emerald-600"
          >
            + Registrar Equipo (POST)
          </Link>
        )}
      </div>

      {error && (
        <div className="p-3 bg-rose-900/80 border border-rose-500 rounded-xl text-rose-200 text-xs font-mono">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8 text-slate-400 font-mono text-xs">Cargando inventario...</div>
      ) : (
        <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="bg-slate-900 text-slate-400 border-b border-slate-800">
                <th className="p-3">Placa SENA</th>
                <th className="p-3">Marca/Modelo</th>
                <th className="p-3">RAM</th>
                <th className="p-3">Ambiente</th>
                <th className="p-3">Estado</th>
                <th className="p-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {equipos.map((eq) => (
                <tr key={eq.placaSena} className="hover:bg-slate-900/50">
                  <td className="p-3 text-sena-green font-bold">{eq.placaSena}</td>
                  <td className="p-3 text-white font-sans">{eq.marcaModelo}</td>
                  <td className="p-3 text-slate-400">{eq.ram}</td>
                  <td className="p-3 font-sans text-slate-400">{eq.ambiente}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        eq.estado === 'Operativo'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-amber-950 text-amber-400 border border-amber-800'
                      }`}
                    >
                      {eq.estado}
                    </span>
                  </td>
                  <td className="p-3 text-right space-x-2 font-sans">
                    <Link
                      to={`/inventario/${eq.placaSena}`}
                      className="text-[10px] bg-slate-800 hover:bg-sky-600 px-2.5 py-1 rounded-lg text-slate-300 inline-block"
                    >
                      Editar
                    </Link>
                    {isAdmin && (
                      <button
                        onClick={() => handleDelete(eq.placaSena)}
                        className="text-[10px] bg-rose-900 hover:bg-rose-600 px-2.5 py-1 rounded-lg text-rose-200"
                      >
                        Eliminar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
