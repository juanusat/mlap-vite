// En MatrixModal.jsx
import React, { useState, useEffect } from 'react'; // Importamos useEffect
import MyButtonMediumIcon from "../components/MyButtonMediumIcon";
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
    <div className="matrix-container">
      <h3>{title}</h3>
      <table className="permissions-matrix">
        <thead>
          <tr>
            <th>Módulo</th>
            <th>Ver</th>
            <th>Añadir</th>
            <th>Editar</th>
            <th>Eliminar</th>
          </tr>
        </thead>
        <tbody>
          {modules.map(module => (
            <tr key={module.id}>
              <th scope="row">{module.name}</th>
              <td>
                <ToggleSwitch
                  initialState={matrixState[module.id]?.view}
                  onToggle={() => handleToggle(module.id, 'view')}
                />
              </td>
              <td>
                <ToggleSwitch
                  initialState={matrixState[module.id]?.add}
                  onToggle={() => handleToggle(module.id, 'add')}
                />
              </td>
              <td>
                <ToggleSwitch
                  initialState={matrixState[module.id]?.edit}
                  onToggle={() => handleToggle(module.id, 'edit')}
                />
              </td>
              <td>
                <ToggleSwitch
                  initialState={matrixState[module.id]?.delete}
                  onToggle={() => handleToggle(module.id, 'delete')}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="buttons-container">
        <MyButtonMediumIcon text="Cerrar" icon="MdClose" onClick={onClose} />
        <MyButtonMediumIcon text="Guardar" icon="MdOutlineSaveAs" onClick={handleSave} />
      </div>
    </div>
  );
};

export default MatrixModal;