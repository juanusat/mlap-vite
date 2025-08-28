import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import Login from './Login.jsx';
import Home from './Home.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
  <Route path="/" element={<App />} />
  <Route path="/acceso" element={<Login />} />
  <Route path="/inicio" element={<Home />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
