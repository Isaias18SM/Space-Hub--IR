// 📁 src/layouts/MainLayout/MainLayout.tsx — CLASE 5 (API REST)
// Layout Shell que integra <Navbar/> y una barra de sesión con el botón de cierre
// de sesión, el cual invoca logout() (POST /api/v1/auth/logout) antes de redirigir.
import { Outlet, useNavigate } from 'react-router-dom';
import SenaHeader from '../../components/SenaHeader/SenaHeader';
import Navbar from '../../components/Navbar/Navbar';
import { useAuth } from '../../context/AuthContext';

export default function MainLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <SenaHeader tituloPortal="SENA SpaceHub" centroFormacion="Centro de Gestión de Mercados, Logística y TI" />
      <Navbar />
      <div className="bg-slate-800/80 border-b border-slate-700/60 px-6 py-2.5 flex items-center justify-between shadow-inner text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-sena-green animate-pulse"></span>
          <span className="text-slate-400">Sesión Activa:</span>
          <strong className="text-white">{user?.nombreCompleto || 'Usuario Autenticado'}</strong>
          <span className="bg-sena-green/20 text-sena-green px-2 py-0.5 rounded text-[10px] font-bold border border-sena-green/30">
            {user?.role || 'Rol'}
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="px-3 py-1 bg-rose-900/60 hover:bg-rose-700 text-rose-200 border border-rose-500/50 rounded-lg text-xs font-bold transition shadow-sm"
        >
          Cerrar Sesión
        </button>
      </div>
      <main className="flex-grow p-6">
        <Outlet />
      </main>
      <footer className="text-center text-[11px] text-slate-500 py-4 border-t border-slate-800">
        SENA • ADSO • Proyecto Integrador SpaceHub — API REST + JWT
      </footer>
    </div>
  );
}
