// 📁 src/pages/IncidenciasPage/IncidenciasPage.tsx
import { useState } from 'react';
import type { IncidenciaData } from '../../types/spacehub.types';

export interface IncidenciasPageProps {
  incidencias: IncidenciaData[];
  onCrear: (i: IncidenciaData) => void;
  onResolver: (id: number) => void;
}

export default function IncidenciasPage({ incidencias, onCrear, onResolver }: IncidenciasPageProps) {
  const [mostrarForm, setMostrarForm] = useState(false);
  const [placa, setPlaca] = useState('SENA-1001');
  const [desc, setDesc] = useState('');
  const [prioridad, setPrioridad] = useState<IncidenciaData['prioridad']>('Media');

  const pendientes = incidencias.filter((i) => !i.resuelta);

  const guardar = () => {
    if (!desc) return;
    onCrear({ id: Date.now(), placaSena: placa, descripcion: desc, prioridad, resuelta: false });
    setDesc('');
    setMostrarForm(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-white">🛠️ Mesa de Ayuda y Ticketera</h3>
        <button
          onClick={() => setMostrarForm(!mostrarForm)}
          className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl"
        >
          Reportar Incidencia
        </button>
      </div>

      {mostrarForm && (
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <input
              value={placa}
              onChange={(e) => setPlaca(e.target.value)}
              className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-white"
            />
            <input
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Descripción de la falla"
              className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-white"
            />
            <select
              value={prioridad}
              onChange={(e) => setPrioridad(e.target.value as IncidenciaData['prioridad'])}
              className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-white"
            >
              <option value="Alta">Prioridad: Alta</option>
              <option value="Media">Prioridad: Media</option>
              <option value="Baja">Prioridad: Baja</option>
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => setMostrarForm(false)} className="bg-slate-800 text-slate-300 text-xs px-3 py-1.5 rounded-xl">
              Cancelar
            </button>
            <button onClick={guardar} className="bg-amber-500 text-white font-bold text-xs px-4 py-1.5 rounded-xl">
              Generar Ticket
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {pendientes.map((inc) => (
          <div key={inc.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex justify-between items-center gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-400">{inc.placaSena}</span>
                <span
                  className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                    inc.prioridad === 'Alta'
                      ? 'bg-rose-950 text-rose-400 border border-rose-800'
                      : 'bg-amber-950 text-amber-400 border border-amber-800'
                  }`}
                >
                  Prioridad {inc.prioridad}
                </span>
              </div>
              <p className="text-xs text-slate-300">{inc.descripcion}</p>
            </div>
            <button
              onClick={() => onResolver(inc.id)}
              className="bg-sena-green text-white font-bold text-[10px] px-3 py-1.5 rounded-xl"
            >
              Resolver
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
