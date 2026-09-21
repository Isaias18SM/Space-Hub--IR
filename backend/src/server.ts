import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { USERS, EQUIPOS, PRESTAMOS } from './data';
import { authenticateToken, requireRole, JWT_SECRET, type AuthenticatedRequest } from './middleware';
import type { Equipo, Prestamo } from './types';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// ---------- AUTH ----------
app.post('/api/v1/auth/login', (req, res) => {
  const { email, password } = req.body as { email: string; password: string };
  const user = USERS.find((u) => u.email === email && u.password === password);

  if (!user) {
    res.status(401).json({ statusCode: 401, error: 'Unauthorized', message: 'Credenciales inválidas' });
    return;
  }

  const accessToken = jwt.sign(
    { sub: user.id, name: user.nombreCompleto, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '8h' }
  );

  res.json({
    statusCode: 200,
    message: 'Autenticación exitosa',
    accessToken,
    user: { id: user.id, nombreCompleto: user.nombreCompleto, email: user.email, role: user.role },
  });
});

app.post('/api/v1/auth/logout', authenticateToken, (_req, res) => {
  res.json({ statusCode: 200, message: 'Sesión cerrada exitosamente en el servidor' });
});

// ---------- EQUIPOS ----------
app.get('/api/v1/equipos', authenticateToken, (_req, res) => {
  res.json(EQUIPOS);
});

app.post('/api/v1/equipos', authenticateToken, requireRole('Administrador'), (req, res) => {
  const { placaSena, marcaModelo, ram, ambiente, estado } = req.body as Partial<Equipo>;

  if (!placaSena || !marcaModelo) {
    res.status(400).json({ statusCode: 400, message: 'Faltan campos obligatorios' });
    return;
  }

  const newEquipo: Equipo = {
    id: Date.now(),
    placaSena: placaSena.toUpperCase(),
    marcaModelo,
    ram: ram || '16GB DDR4',
    ambiente: ambiente || 'Ambiente 301 - ADSO',
    estado: estado || 'Operativo',
  };

  EQUIPOS.unshift(newEquipo);
  res.status(201).json(newEquipo);
});

app.put('/api/v1/equipos/:placaSena', authenticateToken, requireRole('Administrador'), (req, res) => {
  const { placaSena } = req.params;
  const index = EQUIPOS.findIndex((e) => e.placaSena.toUpperCase() === placaSena.toUpperCase());

  if (index === -1) {
    res.status(404).json({ statusCode: 404, message: 'Equipo no encontrado' });
    return;
  }

  EQUIPOS[index] = { ...EQUIPOS[index], ...(req.body as Partial<Equipo>) };
  res.json(EQUIPOS[index]);
});

app.delete('/api/v1/equipos/:placaSena', authenticateToken, requireRole('Administrador'), (req, res) => {
  const { placaSena } = req.params;
  const index = EQUIPOS.findIndex((e) => e.placaSena.toUpperCase() === placaSena.toUpperCase());

  if (index === -1) {
    res.status(404).json({ statusCode: 404, message: 'Equipo no encontrado' });
    return;
  }

  EQUIPOS.splice(index, 1);
  res.json({ message: `Equipo ${placaSena} eliminado con éxito` });
});

// ---------- PRÉSTAMOS ----------
// RBAC: un Aprendiz solo ve sus propios préstamos; Instructor/Administrador ven todos.
app.get('/api/v1/prestamos', authenticateToken, (req: AuthenticatedRequest, res) => {
  if (req.user?.role === 'Aprendiz') {
    const misPrestamos = PRESTAMOS.filter((p) => p.aprendiz === req.user?.name);
    res.json(misPrestamos);
    return;
  }
  res.json(PRESTAMOS);
});

app.post('/api/v1/prestamos', authenticateToken, (req: AuthenticatedRequest, res) => {
  const { aprendiz, ficha, equipoPlaca } = req.body as Partial<Prestamo>;

  // Un Aprendiz siempre registra a su propio nombre (viene del token JWT, no del body)
  const nombreAprendiz = req.user?.role === 'Aprendiz' ? req.user.name : aprendiz;

  if (!nombreAprendiz || !ficha || !equipoPlaca) {
    res.status(400).json({ statusCode: 400, message: 'Faltan campos obligatorios' });
    return;
  }

  const equipo = EQUIPOS.find((e) => e.placaSena.toUpperCase() === equipoPlaca.toUpperCase());
  if (!equipo) {
    res.status(404).json({ statusCode: 404, message: 'Equipo no encontrado' });
    return;
  }
  if (equipo.estado !== 'Operativo') {
    res.status(400).json({ statusCode: 400, message: 'El equipo seleccionado no está operativo' });
    return;
  }

  const nuevoPrestamo: Prestamo = {
    id: Date.now(),
    aprendiz: nombreAprendiz,
    ficha,
    equipoPlaca: equipo.placaSena,
    horaInicio: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
    estado: 'Activo',
    creadoPorRol: req.user!.role,
  };

  PRESTAMOS.unshift(nuevoPrestamo);
  res.status(201).json(nuevoPrestamo);
});

app.put('/api/v1/prestamos/:id/devolver', authenticateToken, requireRole('Administrador'), (req, res) => {
  const index = PRESTAMOS.findIndex((p) => p.id === Number(req.params.id));
  if (index === -1) {
    res.status(404).json({ statusCode: 404, message: 'Préstamo no encontrado' });
    return;
  }
  PRESTAMOS[index].estado = 'Devuelto';
  res.json(PRESTAMOS[index]);
});

// ---------- DASHBOARD ----------
app.get('/api/v1/dashboard/stats', authenticateToken, (_req, res) => {
  const totalEquipos = EQUIPOS.length;
  const equiposOperativos = EQUIPOS.filter((e) => e.estado === 'Operativo').length;
  const equiposMantenimiento = EQUIPOS.filter((e) => e.estado === 'En Mantenimiento').length;
  const prestamosActivos = PRESTAMOS.filter((p) => p.estado === 'Activo').length;

  const ambientes = Array.from(new Set(EQUIPOS.map((e) => e.ambiente)));
  const ambientesOcupacion = ambientes.map((ambiente) => {
    const equiposAmbiente = EQUIPOS.filter((e) => e.ambiente === ambiente);
    const placasAmbiente = new Set(equiposAmbiente.map((e) => e.placaSena));
    const equiposPrestados = PRESTAMOS.filter((p) => p.estado === 'Activo' && placasAmbiente.has(p.equipoPlaca)).length;
    return {
      ambiente,
      totalEquipos: equiposAmbiente.length,
      equiposPrestados,
      porcentaje: equiposAmbiente.length > 0 ? Math.round((equiposPrestados / equiposAmbiente.length) * 100) : 0,
    };
  });

  res.json({
    totalEquipos,
    equiposOperativos,
    equiposMantenimiento,
    prestamosActivos,
    tasaOcupacionGlobal: totalEquipos > 0 ? Math.round((prestamosActivos / totalEquipos) * 100) + '%' : '0%',
    ambientesOcupacion,
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}/api/v1`);
});
