// 📁 src/pages/PrestamosPage/components/PrestamoModal.tsx
// Ventana modal independiente para registrar un nuevo préstamo de equipo.
import { useState, type FormEvent } from 'react';
import type { Equipo } from '../../../services/equiposService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { aprendiz: string; ficha: string; equipoPlaca: string }) => Promise<void>;
  isAdmin: boolean;
  defaultNombre: string;
  equipos: Equipo[];
}

export default function PrestamoModal({ isOpen, onClose, onSubmit, isAdmin, defaultNombre, equipos }: Props) {
  const operativos = equipos.filter((e) => e.estado === 'Operativo');

  const [equipoPlaca, setEquipoPlaca] = useState('');
  const [aprendiz, setAprendiz] = useState(defaultNombre);
  const [ficha, setFicha] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({ aprendiz, ficha, equipoPlaca });
      setEquipoPlaca('');
      setFicha('');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl p-6 shadow-2xl text-white relative">
        <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-3">
          <h3 className="text-lg font-bold text-sena-green">Registrar Nuevo Préstamo</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white font-bold cursor-pointer">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-300 mb-1">Seleccionar Equipo</label>
            <select
              required
              value={equipoPlaca}
              onChange={(e) => setEquipoPlaca(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
            >
              <option value="">-- Selecciona un equipo operativo --</option>
              {operativos.map((equipo) => (
                <option key={equipo.id} value={equipo.placaSena}>
                  {equipo.placaSena} - {equipo.marcaModelo}
                </option>
              ))}
            </select>
            {operativos.length === 0 && (
              <p className="text-rose-400 mt-1">No hay equipos operativos disponibles en este momento.</p>
            )}
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">Aprendiz</label>
            <input
              type="text"
              required
              value={aprendiz}
              onChange={(e) => setAprendiz(e.target.value)}
              disabled={!isAdmin}
              placeholder="Nombre completo"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white disabled:opacity-60"
            />
            {!isAdmin && <p className="text-slate-500 mt-1">Autocompletado desde tu sesión.</p>}
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">Ficha</label>
            <input
              type="text"
              required
              value={ficha}
              onChange={(e) => setFicha(e.target.value)}
              placeholder="N° de ficha de formación"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !equipoPlaca}
              className="px-4 py-2 bg-sena-green hover:bg-emerald-600 text-white font-extrabold rounded-xl text-xs cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Guardando...' : 'Asignar Equipo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
