// 📁 src/components/Navbar/Navbar.tsx — SESIÓN 4
// Navegación con <NavLink>: ahora la URL del navegador SÍ cambia (History API)
// y NavLink resalta automáticamente el enlace activo con { isActive }.
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const enlaces = [
  { to: '/dashboard', label: '📊 Dashboard' },
  { to: '/inventario', label: '💻 Inventario' },
  { to: '/prestamos', label: '📋 Préstamos' },
  { to: '/incidencias', label: '🛠️ Mesa de Ayuda' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-slate-950 border-b border-slate-800 px-6 py-3 flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap gap-2 text-xs font-semibold">
        {enlaces.map((e) => (
          <NavLink
            key={e.to}
            to={e.to}
            className={({ isActive }) =>
              `px-3.5 py-2 rounded-xl transition-all ${
                isActive ? 'bg-sena-green text-white font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`
            }
          >
            {e.label}
          </NavLink>
        ))}
      </div>

      {user ? (
        <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
          <span className="font-bold text-white">{user.nombreCompleto}</span>
          <span className="bg-sena-green/20 text-sena-green px-2 py-0.5 rounded font-mono text-[10px]">
            {user.role}
          </span>
          <button onClick={handleLogout} className="text-rose-400 hover:text-rose-300 font-bold underline">
            Salir
          </button>
        </div>
      ) : (
        <NavLink
          to="/login"
          className="bg-sena-green hover:bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl"
        >
          🔑 Iniciar Sesión
        </NavLink>
      )}
    </nav>
  );
}
