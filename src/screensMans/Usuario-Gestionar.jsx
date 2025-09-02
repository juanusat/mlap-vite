import React, { useState } from 'react';
import MyGroupButtonsActions from '../components/MyGroupButtonsActions';
import MyButtonShortAction from '../components/MyButtonShortAction';
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      nombre,
      imagen,
      correo,
      nuevaContrasena,
      confirmarContrasena,
      recibirNotificaciones,
    });
    alert('Cambios guardados (simulado)');
  };

  return (
    <div className="content-module only-this">
      <h2 className='title-screen'>Gestión de Cuenta</h2>

      <MyGroupButtonsActions>
        <MyButtonShortAction type='edit' />
        <MyButtonShortAction type='refresh' />
      </MyGroupButtonsActions>

      <form className="account-form" onSubmit={handleSubmit} style={{ width: '50%' }}>
        <div className="form-group">
          <label htmlFor="nombre">Nombre</label>
          <TextInput
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>

        <div className="form-group file-group">
          <label htmlFor="imagen">Imagen</label>
          <FileInput
            id="imagen"
            value={imagen}
            onChange={(e) => setImagen(e.target.files[0])}
          />
        </div>

        <div className="form-group">
          <label htmlFor="correo">Correo</label>
          <TextInput
            id="correo"
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="nuevaContrasena">Nueva Contraseña</label>
          <TextInput
            id="nuevaContrasena"
            type="password"
            value={nuevaContrasena}
            onChange={(e) => setNuevaContrasena(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmarContrasena">Confirmar Contraseña</label>
          <TextInput
            id="confirmarContrasena"
            type="password"
            value={confirmarContrasena}
            onChange={(e) => setConfirmarContrasena(e.target.value)}
          />
        </div>

        <div className="form-group-checkboxes">
          <label>Recibir notificaciones</label>
          <div>
            <input
              type="checkbox"
              id="notifications-yes"
              checked={recibirNotificaciones}
              onChange={() => setRecibirNotificaciones(true)}
            />
            <label htmlFor="notifications-yes">Sí</label>
            <input
              type="checkbox"
              id="notifications-no"
              checked={!recibirNotificaciones}
              onChange={() => setRecibirNotificaciones(false)}
            />
            <label htmlFor="notifications-no">No</label>
          </div>
        </div>
        <MyGroupButtonsActions>
          <MyButtonMediumIcon text="Cancelar" icon="MdClose" onClick={() => { }} />
          <MyButtonMediumIcon text="Guardar" icon="MdOutlineSaveAs" type="submit" />
        </MyGroupButtonsActions>
      </form>
    </div>
  );
};

export default GestionCuenta;