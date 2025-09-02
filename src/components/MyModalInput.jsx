import React from 'react';
import './MyModalInput.css'; // Importamos los estilos CSS

const MyModalInput = ({ open, title, message, inputValue, onInputChange, onConfirm, onCancel }) => {
    if (!open) {
        return null; // No renderiza nada si el modal no está abierto
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h3>{title}</h3>
                </div>
                <div className="modal-body">
                    <p>{message}</p>
                    <input
                        type="text"
                        className="modal-input"
                        value={inputValue}
                        onChange={onInputChange}
                        placeholder="Nuevo acto..."
                    />
                </div>
                <div className="modal-footer">
                    <button className="btn btn-cancel" onClick={onCancel}>Cancelar</button>
                    <button className="btn btn-confirm" onClick={onConfirm}>Confirmar</button>
                </div>
            </div>
        </div>
    );
};

export default MyModalInput;