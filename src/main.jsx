import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import Login from './Login.jsx';
import Home from './Home.jsx';
import TipoDocumentos from './screensMans/TipoDocumento-access.jsx';
import TipoDocumentoGestionar from './screensMans/TipoDocumento-Gestionar.jsx';
import ActosLiturgicos from './screensMans/ActosLiturgicos-access.jsx';
import Usuario from './screensMans/Usuario-access.jsx';
import Parroquia from './screensMans/Parroquia-access.jsx';
import Seguridad from './screensMans/Seguridad-access.jsx';
import Reservas from './screensMans/Reservas-access.jsx';
import AprobarParroquia from './screensMans/AprobarParroquia-access.jsx';
import ActosLiturgicosReportes from './screensMans/ActosLiturgicos-Reportes.jsx';
import UsuarioGestionar from './screensMans/Usuario-Gestionar.jsx';
import ParroquiaGestionar from './screensMans/Parroquia-Gestionar.jsx';
import ParroquiaGestionarCapilla from './screensMans/Parroquia-Gestionar-Capilla.jsx';
import CuentasGestionar from './screensMans/Seguridad-Cuentas-Gestionar.jsx';
import RolesGestionar from './screensMans/Seguridad-Roles-Gestionar.jsx';
import ReservasPendientes from './screensMans/Reservas-Pendientes.jsx';
import ReservasHistorial from './screensMans/Reservas-Historial.jsx';
import AprobarParroquiaGestionar from './screensMans/AprobarParroquia-Gestionar.jsx';
import ActosLiturgicosGestionar from './screensMans/ActosLiturgicos-Gestionar.jsx';
import ActosLiturgicosRequisitos from './screensMans/ActosLiturgicos-Requisitos.jsx';
import ActosLiturgicosHorarios from './screensMans/ActosLiturgicos-Horarios.jsx';
import ActosLiturgicosReservas from './screensMans/ActosLiturgicos-Reservas.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/acceso" element={<Login />} />
        <Route path="/inicio" element={<Home />} />
        <Route path="/man-tipos-documentos" element={<TipoDocumentos />}>
          <Route path="gestionar" element={<TipoDocumentoGestionar />} />
        </Route>
        <Route path="/man-actos-liturgicos" element={<ActosLiturgicos />}>
          <Route path="gestionar" element={<ActosLiturgicosGestionar />} />
          <Route path="requisitos" element={<ActosLiturgicosRequisitos />} />
          <Route path="horarios" element={<ActosLiturgicosHorarios />} />
          <Route path="reservas" element={<ActosLiturgicosReservas />} />
          <Route path="reportes" element={<ActosLiturgicosReportes />} />
        </Route>
        <Route path="/man-usuario" element={<Usuario />}>
          <Route path="gestionar" element={<UsuarioGestionar />} />
        </Route>
        <Route path="/man-parroquia" element={<Parroquia />}>
          <Route path="gestionar-cuenta" element={<ParroquiaGestionar />} />
          <Route path="gestionar-capilla" element={<ParroquiaGestionarCapilla />} />
        </Route>
        <Route path="/man-seguridad" element={<Seguridad />}>
          <Route path="cuentas-gestionar" element={<CuentasGestionar />} />
          <Route path="roles-gestionar" element={<RolesGestionar />} />
          
        </Route>
        <Route path="/man-reservas" element={<Reservas />}>
          <Route path="pendientes" element={<ReservasPendientes />} />
          <Route path="historial" element={<ReservasHistorial />} />
        </Route>
        <Route path="/man-aprobar-parroquia" element={<AprobarParroquia />}>
          <Route path="gestionar" element={<AprobarParroquiaGestionar />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
