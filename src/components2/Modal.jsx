import React from 'react';
import MyButtonMediumIcon from "../components/MyButtonMediumIcon";
import './Modal.css';

const Modal = ({ show, onClose, children, title, onAccept, onCancel }) => {
  if (!show) {
    return null;
  }

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

export default Modal;