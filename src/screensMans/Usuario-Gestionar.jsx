import React, { useState } from 'react';
import MyGroupButtonsActions from '../components2/MyGroupButtonsActions';
import MyButtonShortAction from '../components2/MyButtonShortAction';
import TextInput from '../components/formsUI/TextInput';
import FileInput from '../components/formsUI/FileInput';
import MyButtonMediumIcon from '../components/MyButtonMediumIcon';

const GestionCuenta = () => {
  const [nombre, setNombre] = useState('');
  const [imagen, setImagen] = useState(null);
  const [correo, setCorreo] = useState('');
  const [nuevaContrasena, setNuevaContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [recibirNotificaciones, setRecibirNotificaciones] = useState(false);

  return (
    <div className="content-module only-this">
      <h2 className='title-screen'>Gestión de Cuenta</h2>

      
    </div>
  );
};

export default GestionCuenta;