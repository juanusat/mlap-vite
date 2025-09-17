import React, { useState } from "react";
import { InputField, MainButton, SecondaryButton } from './components/UI';
import logo from './assets/logo-mlap-color.svg';
import './App.css';
import './colors.css';
import './Begin.css';
import Modal from './components2/Modal';
import ForgotPassword from './screensMans/ForgotPassword';
import { useNavigate } from 'react-router-dom';
import Home from './components/MyHeaderAdm.jsx';

export default function Begin() {
  const navigate = useNavigate();
  const [selectedParroquia, setSelectedParroquia] = useState(null);

  // Lista de parroquias disponibles
  const parroquias = [
    { id: 1, nombre: "Parroquia San Miguel Arcángel" },
    { id: 2, nombre: "Parroquia Nuestra Señora de Guadalupe" },
    { id: 3, nombre: "Parroquia San José" },
    { id: 4, nombre: "Parroquia Santa María" },
    { id: 5, nombre: "Parroquia San Francisco de Asís" },
    { id: 6, nombre: "Parroquia San Pedro Apóstol" },
    { id: 7, nombre: "Parroquia Santa Rosa de Lima" },
    { id: 8, nombre: "Parroquia San Juan Bautista" }
  ];


  const handleParroquiaSelect = (parroquia) => {
    setSelectedParroquia(parroquia);
    // Aquí puedes agregar lógica adicional para manejar la selección
    console.log('Parroquia seleccionada:', parroquia);
    // Por ejemplo, redirigir al login específico de la parroquia
    navigate('/inicio', { state: { parroquia } });
  };

  return (
    <div className="mlap-login-container">
      <h3>Bienvenido a MLAP</h3>
      <p>Por favor selecciona la parroquia a la que deseas acceder</p>
      
      {/* Lista de botones de parroquias */}
      <div className="parroquias-list">
        {parroquias.map((parroquia) => (
          <button
            key={parroquia.id}
            className={`parroquia-button ${selectedParroquia?.id === parroquia.id ? 'selected' : ''}`}
            onClick={() => handleParroquiaSelect(parroquia)}
          >
            {parroquia.nombre}
          </button>
        ))}
      </div>

      
    </div>
    
  );
}