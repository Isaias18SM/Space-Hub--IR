// 📁 src/pages/NuevoEquipoPage/NuevoEquipoPage.tsx — CLASE 5 (API REST)
// Ruta protegida (solo Administrador) que registra un nuevo equipo mediante
// POST /api/v1/equipos, usando equiposService.create().
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { equiposService } from '../../services/equiposService';

export default function NuevoEquipoPage() {
  const [placaSena, setPlacaSena] = useState('');
  const [marcaModelo, setMarcaModelo] = useState('');
  const [ram, setRam] = useState('16GB DDR4');
  const [ambiente, setAmbiente] = useState('Ambiente 301 - ADSO');
  const [estado, setEstado] = useState<'Operativo' | 'En Mantenimiento'>('Operativo');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    try {
      await equiposService.create({ placaSena, marcaModelo, ram, ambiente, estado });
      navigate('/inventario');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al guardar equipo');
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-slate-800 border border-slate-700 rounded-2xl text-white shadow-xl">
      <h2 className="text-xl font-bold text-sena-green mb-1">Registrar Nuevo Equipo (POST)</h2>
      <p className="text-xs text-slate-400 mb-4">Utilizando equiposService.create() — requiere rol Administrador</p>
      {error && (
        <div className="p-3 mb-4 bg-rose-900/80 border border-rose-500 rounded-xl text-rose-200 text-xs font-mono">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
        <div>
          <label className="block font-bold text-slate-300 mb-1">Placa SENA</label>
          <input
            type="text"
            required
            placeholder="SENA-1006"
            value={placaSena}
            onChange={(e) => setPlacaSena(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-sena-green"
          />
        </div>
        <div>
          <label className="block font-bold text-slate-300 mb-1">Marca / Modelo</label>
          <input
            type="text"
            required
            placeholder="Lenovo ThinkPad L14 G3"
            value={marcaModelo}
            onChange={(e) => setMarcaModelo(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-sena-green"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-bold text-slate-300 mb-1">Memoria RAM</label>
            <select
              value={ram}
              onChange={(e) => setRam(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-sena-green"
            >
              <option value="8GB DDR4">8GB DDR4</option>
              <option value="16GB DDR4">16GB DDR4</option>
              <option value="32GB DDR5">32GB DDR5</option>
            </select>
          </div>
          <div>
            <label className="block font-bold text-slate-300 mb-1">Estado Inicial</label>
            <select
              value={estado}
              onChange={(e) => setEstado(e.target.value as 'Operativo' | 'En Mantenimiento')}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-sena-green"
            >
              <option value="Operativo">Operativo</option>
              <option value="En Mantenimiento">En Mantenimiento</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block font-bold text-slate-300 mb-1">Ambiente Asignado</label>
          <input
            type="text"
            required
            value={ambiente}
            onChange={(e) => setAmbiente(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-sena-green"
          />
        </div>
        <div className="pt-2 flex justify-end gap-3 font-sans">
          <button
            type="button"
            onClick={() => navigate('/inventario')}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-xl text-xs font-bold text-slate-300"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-sena-green hover:bg-emerald-600 text-slate-900 font-extrabold rounded-xl text-xs shadow-lg"
          >
            Guardar Equipo (POST)
          </button>
        </div>
      </form>
    </div>
  );
}
