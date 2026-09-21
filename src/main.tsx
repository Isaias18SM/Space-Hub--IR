// 📁 src/main.tsx — CLASE 5 (API REST)
// Se envuelve <App /> en <AuthProvider> y <BrowserRouter> para exponer la sesión JWT
// a toda la aplicación y prevenir errores de contexto ("useAuth fuera de Provider").
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
