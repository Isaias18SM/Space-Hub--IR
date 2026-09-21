import React from 'react';


interface PageProps {
  onNavigate: (pagina: 'dashboard' | 'inventario' | 'prestamos' | 'ticketera') => void;
}

export default function TicketeraPage({ onNavigate }: PageProps) {
  return (
    <div className="min-h-screen bg-[#070b19] text-gray-200 p-6 font-sans">
      {/* Header de navegación */}
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
          <button 
            onClick={() => onNavigate('dashboard')}
            className="px-3 py-1.5 text-sm rounded-lg text-gray-300 hover:bg-gray-800"
          >
            📊 Dashboard
          </button>
          <button 
            onClick={() => onNavigate('inventario')}
            className="px-3 py-1.5 text-sm rounded-lg text-gray-300 hover:bg-gray-800"
          >
            📦 Inventario (5)
          </button>
          <button 
            onClick={() => onNavigate('prestamos')}
            className="px-3 py-1.5 text-sm rounded-lg text-gray-300 hover:bg-gray-800"
          >
            📋 Préstamos (3)
          </button>
          <button 
            onClick={() => onNavigate('ticketera')}
            className="px-3 py-1.5 text-sm rounded-lg bg-emerald-500 text-black font-semibold"
          >
            🎫 Ticketera (2)
          </button>
        </nav>
      </header>

      {/* Contenido principal */}
      <main className="mt-8">
        <h1 className="text-2xl font-bold text-white">Página Ticketera</h1>
        <p className="text-sm text-gray-400 mt-2">
          Módulo de gestión de tickets y solicitudes.
        </p>
      </main>
    </div>
  );
}