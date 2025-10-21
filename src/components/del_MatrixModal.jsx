import React, { useState, useEffect } from 'react'; // Importamos useEffect
import MyButtonMediumIcon from "./MyButtonMediumIcon";
import ToggleSwitch from '../components2/Toggle';
import './MatrixModal.css';

const MatrixModal = ({ modules, permissions, title, onSave, onClose }) => {
  const [matrixState, setMatrixState] = useState(permissions);

  // Usamos useEffect para sincronizar el estado interno con las props
  useEffect(() => {
    setMatrixState(permissions);
  }, [permissions]); // El efecto se ejecuta cada vez que la prop 'permissions' cambia

  const handleToggle = (moduleId, actionType) => {
    setMatrixState(prevState => ({
      ...prevState,
      [moduleId]: {
        ...prevState[moduleId],
        [actionType]: !prevState[moduleId][actionType],
      },
    }));
  };

  const handleSave = () => {
    onSave(matrixState);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button className="modal-close-btn" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
        {onAccept && onCancel && (
          <div className="buttons-container">
            <MyButtonMediumIcon text="Cancelar" icon="MdClose" onClick={onCancel} />
            <MyButtonMediumIcon text="Aceptar" icon="MdAccept" onClick={onAccept} type="submit" />
          </div>
        )}
      </div>
    </div>
  );
};

export default MatrixModal;