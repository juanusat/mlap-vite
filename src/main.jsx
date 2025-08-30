import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import Login from './Login.jsx';
import Home from './Home.jsx';
import TipoDocumentos from './screensMans/TipoDocumento.jsx';
import ActosLiturgicos from './screensMans/ActosLiturgicos.jsx';
import Usuario from './screensMans/Usuario.jsx';
import Parroquia from './screensMans/Parroquia.jsx';
import Seguridad from './screensMans/Seguridad.jsx';
import Reservas from './screensMans/Reservas.jsx';
import AprobarParroquia from './screensMans/AprobarParroquia.jsx';
import './index.css';
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/acceso" element={<Login />} />
        <Route path="/inicio" element={<Home />} />
        <Route path="/man-tipos-documentos" element={<TipoDocumentos />} />
        <Route path="/man-actos-liturgicos" element={<ActosLiturgicos />} />
        <Route path="/man-usuario" element={<Usuario />} />
        <Route path="/man-parroquia" element={<Parroquia />} />
        <Route path="/man-seguridad" element={<Seguridad />} />
        <Route path="/man-reservas" element={<Reservas />} />
        <Route path="/man-aprobar-parroquia" element={<AprobarParroquia />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
