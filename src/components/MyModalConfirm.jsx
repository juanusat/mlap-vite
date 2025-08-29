import React from 'react';
import './MyModalConfirm.css';
import { MdInfoOutline } from "react-icons/md";

export default function MyModalConfirm({ open, message, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="modal-confirm-overlay">
      <div className="modal-confirm-box">
        <div className="modal-confirm-title">
          <MdInfoOutline />
          <span>Aviso</span>
        </div>
        <p>{message}</p>
        <div className="modal-confirm-actions">
          <button className="modal-confirm-btn" onClick={onConfirm}>Confirmar</button>
          <button className="modal-cancel-btn" onClick={onCancel}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}
