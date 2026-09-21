import React from 'react';
export default function InventarioPage({ onNavigate }: { onNavigate?: (pagina: any) => void }) {

  return (
    <div className="min-h-screen bg-[#070b19] text-gray-200 p-6 font-sans">
      {/* Top Navbar */}
      <header className="flex items-center justify-between pb-6 border-b border-gray-800">
        <div className="flex items-center gap-4">
          <span className="bg-emerald-600 text-white px-3 py-1.5 rounded-full text-sm font-bold">
            SENA SpaceHub
          </span>
          <span className="text-sm text-gray-400">
            Centro de Gestión de Mercados, Logística y TI
          </span>
        </div>

        <nav className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg hover:bg-gray-800 text-gray-300">
            <span>📊</span> Dashboard
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg bg-emerald-500 text-black font-semibold">
            <span>💻</span> Inventario (5)
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg hover:bg-gray-800 text-gray-300">
            <span>📜</span> Préstamos (3)
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg hover:bg-gray-800 text-gray-300">
            <span>🛠️</span> Ticketera (2)
          </button>
        </nav>
      </header>

      {/* User Info Bar */}
      <div className="flex items-center justify-between py-4 border-b border-gray-800 text-sm">
        <div className="flex items-center gap-2 bg-[#0c1329] border border-gray-800 px-3 py-1.5 rounded-full">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
          <span className="font-semibold text-white">Ana María Fajardo</span>
          <span className="bg-emerald-950 text-emerald-400 text-xs px-2 py-0.5 rounded border border-emerald-800">
            Aprendiz
          </span>
          <button className="text-red-400 text-xs hover:underline ml-1">
            Salir
          </button>
        </div>

        <div className="flex items-center gap-4 text-xs text-gray-400">
          <span>
            👩‍🎓 Modo <strong className="text-white">Aprendiz ADSO</strong> activo (Ficha: 2879451). Las solicitudes de préstamo autocompletan tus datos personales.
          </span>
          <button className="text-cyan-400 flex items-center gap-1 font-semibold hover:underline">
            ⚡ Cambiar a Operador/Admin
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="mt-8">
        <h1 className="text-2xl font-bold text-white">
          Inventario de Equipos de Cómputo
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Control individualizado por Placa SENA e Interface `EquipoData`
        </p>

        {/* Table */}
        <div className="mt-6 border border-gray-800 rounded-lg overflow-hidden bg-[#0a0f24]">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400 bg-[#0d1430]">
                <th className="p-4">Placa SENA</th>
                <th className="p-4">Equipo / Modelo</th>
                <th className="p-4">Especificación</th>
                <th className="p-4">Estado</th>
                <th className="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              <tr>
                <td className="p-4 text-emerald-400 font-bold">SENA-1001</td>
                <td className="p-4 font-bold text-white">Lenovo ThinkPad L14 G3</td>
                <td className="p-4 text-gray-300">16GB DDR4</td>
                <td className="p-4">
                  <span className="bg-emerald-950 text-emerald-400 text-xs font-semibold px-2.5 py-1 rounded border border-emerald-800">
                    Operativo
                  </span>
                </td>
                <td className="p-4 text-right text-xs text-gray-500">Solo Operarios</td>
              </tr>

              <tr>
                <td className="p-4 text-emerald-400 font-bold">SENA-1002</td>
                <td className="p-4 font-bold text-white">HP ProBook 440 G8</td>
                <td className="p-4 text-gray-300">16GB DDR4</td>
                <td className="p-4">
                  <span className="bg-amber-950 text-amber-500 text-xs font-semibold px-2.5 py-1 rounded border border-amber-800">
                    En Mantenimiento
                  </span>
                </td>
                <td className="p-4 text-right text-xs text-gray-500">Solo Operarios</td>
              </tr>

              <tr>
                <td className="p-4 text-emerald-400 font-bold">SENA-1003</td>
                <td className="p-4 font-bold text-white">Dell Latitude 3420</td>
                <td className="p-4 text-gray-300">32GB DDR5</td>
                <td className="p-4">
                  <span className="bg-emerald-950 text-emerald-400 text-xs font-semibold px-2.5 py-1 rounded border border-emerald-800">
                    Operativo
                  </span>
                </td>
                <td className="p-4 text-right text-xs text-gray-500">Solo Operarios</td>
              </tr>

              <tr>
                <td className="p-4 text-emerald-400 font-bold">SENA-1004</td>
                <td className="p-4 font-bold text-white">Lenovo ThinkPad L14 G3</td>
                <td className="p-4 text-gray-300">16GB DDR4</td>
                <td className="p-4">
                  <span className="bg-emerald-950 text-emerald-400 text-xs font-semibold px-2.5 py-1 rounded border border-emerald-800">
                    Operativo
                  </span>
                </td>
                <td className="p-4 text-right text-xs text-gray-500">Solo Operarios</td>
              </tr>

              <tr>
                <td className="p-4 text-emerald-400 font-bold">SENA-1005</td>
                <td className="p-4 font-bold text-white">ASUS ExpertBook P2</td>
                <td className="p-4 text-gray-300">8GB DDR4</td>
                <td className="p-4">
                  <span className="bg-emerald-950 text-emerald-400 text-xs font-semibold px-2.5 py-1 rounded border border-emerald-800">
                    Operativo
                  </span>
                </td>
                <td className="p-4 text-right text-xs text-gray-500">Solo Operarios</td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}