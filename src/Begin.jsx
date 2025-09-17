import React, { useState } from "react";
import { InputField, MainButton, SecondaryButton } from './components/UI';
import logo from './assets/logo-mlap-color.svg';
import './App.css';
import './colors.css';
import Modal from './components2/Modal';
import ForgotPassword from './screensMans/ForgotPassword';
import { useNavigate } from 'react-router-dom';
import Home from './components/MyHeaderAdm.jsx';

export default function Begin() {
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [notificacionesModalOpen, setNotificacionesModalOpen] = useState(false);
    const [perfilModalOpen, setPerfilModalOpen] = useState(false);
    const [selectedParroquia, setSelectedParroquia] = useState(null);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    navigate('/comenzar');
  };

  const handleOpenForgotPasswordModal = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="mlap-login-container">
      <h3>Bienvenido a MLAP</h3>
      <p>Por favor selecciona la parroquia a la que deseas acceder</p>
      

      <Modal
        show={isModalVisible}
        onClose={handleCloseModal}
        title="Restablecer Contraseña"
      >
        <ForgotPassword onClose={handleCloseModal} />
      </Modal>
    </div>
    
  );
}