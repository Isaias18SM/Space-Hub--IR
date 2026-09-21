// =================================================================
// Archivo: src/routes/ProtectedRoute.tsx
// RESPONSABILIDAD: Valida si el usuario está autenticado y si posee el rol requerido (RBAC).
// =================================================================
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  requiredRole?: 'Administrador' | 'Aprendiz' | 'Instructor';
}

export function ProtectedRoute({ requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (requiredRole && user?.role !== requiredRole) {
    return (
      <div className="p-8 text-center bg-rose-950/40 border border-rose-500/50 rounded-2xl m-6 font-mono">
        <h2 className="text-xl font-bold text-rose-300">HTTP 403 - Acceso Denegado</h2>
        <p className="text-slate-300 mt-2 text-sm font-sans">
          Tu rol actual es <strong>{user?.role}</strong>. Requieres permisos de <strong>{requiredRole}</strong>.
        </p>
      </div>
    );
  }
  return <Outlet />;
}

export default ProtectedRoute;
