import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import type { JwtPayload, RolUsuario } from './types';

export const JWT_SECRET = 'SENA_SPACEHUB_SECRET_KEY_2026_ADSO';

// Extiende el tipo Request de Express para que req.user exista y esté tipado
export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ statusCode: 401, error: 'Unauthorized', message: 'Token JWT requerido en cabecera Authorization: Bearer <token>' });
    return;
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err || !decoded) {
      res.status(401).json({ statusCode: 401, error: 'Unauthorized', message: 'Token JWT inválido o expirado' });
      return;
    }
    req.user = decoded as unknown as JwtPayload;
    next();
  });
}

export function requireRole(...allowedRoles: RolUsuario[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      res.status(403).json({ statusCode: 403, error: 'Forbidden', message: `Acceso denegado para el rol '${req.user?.role}'` });
      return;
    }
    next();
  };
}
