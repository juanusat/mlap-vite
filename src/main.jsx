import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import Login from './Login.jsx';
import Home from './Home.jsx';

import ActosLiturgicos from './screensMans/ActosLiturgicos-access.jsx';
import ActosLiturgicosGestionar from './screensMans/ActosLiturgicos-Gestionar-Actos.jsx';
import ActosLiturgicosRequisitos from './screensMans/ActosLiturgicos-Gestionar-Requisitos.jsx';
import ActosLiturgicosHorarios from './screensMans/ActosLiturgicos-Gestionar-Horarios.jsx';
import ActosLiturgicosReservas from './screensMans/ActosLiturgicos-Gestionar-Reservas.jsx';
import ActosLiturgicosReportes from './screensMans/ActosLiturgicos-Reportes.jsx';

import Reservas from './screensMans/Reservas-access.jsx';
import ReservasPendientes from './screensMans/Reservas-Pendientes.jsx';
import ReservasHistorial from './screensMans/Reservas-Historial.jsx';

import Seguridad from './screensMans/Seguridad-access.jsx';
import CuentasGestionar from './screensMans/Seguridad-Gestionar-Cuentas.jsx';
import RolesGestionar from './screensMans/Seguridad-Gestionar-Roles.jsx';


import Usuario from './screensMans/Usuario-access.jsx';
import UsuarioGestionar from './screensMans/Usuario-Gestionar-Cuenta.jsx';


import Parroquia from './screensMans/Parroquia-access.jsx';
import ParroquiaGestionarCapilla from './screensMans/Parroquia-Gestionar-Capilla.jsx';
import ParroquiaGestionar from './screensMans/Parroquia-Gestionar-Cuenta.jsx';


import Diocesis from './screensMans/Diocesis-access.jsx';
import TipoDocumentoGestionar from './screensMans/Diocesis-Gestionar-TipoDocumento.jsx';
import DiocesisGestionarParroquia from './screensMans/Diocesis-Gestionar-Parroquia.jsx';
import DiocesisEventosLiturgicos from './screensMans/Diocesis-Gestionar-Eventos-Generales.jsx'
import DiocesisRequisitosGestionarSoloBarra from './screensMans/Diocesis-Gestionar-Requisitos-Generales.jsx'



ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/acceso" element={<Login />} />
        <Route path="/inicio" element={<Home />} />
 
        <Route path="/man-actos-liturgicos" element={<ActosLiturgicos />}>
          <Route path="gestionar-actos" element={<ActosLiturgicosGestionar />} />
          <Route path="gestionar-requisitos" element={<ActosLiturgicosRequisitos />} />
          <Route path="gestionar-horarios" element={<ActosLiturgicosHorarios />} />
          <Route path="gestionar-reservas" element={<ActosLiturgicosReservas />} />
          <Route path="reportes" element={<ActosLiturgicosReportes />} />
        </Route>

        <Route path="/man-usuario" element={<Usuario />}>
          <Route path="gestionar-cuenta" element={<UsuarioGestionar />} />
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

        <Route path="/man-diocesis" element={<Diocesis />}>
          <Route path="gestionar-tipo-doc" element={<TipoDocumentoGestionar />} />
          <Route path="gestionar-cuenta-parroquia" element={<DiocesisGestionarParroquia />} />
          <Route path="gestionar-eventos-generales" element={<DiocesisEventosLiturgicos />} />
          <Route path="gestionar-requisitos-generales" element={<DiocesisRequisitosGestionarSoloBarra />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
