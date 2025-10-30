import React from 'react';
import './MyModalGreatSize.css';

const MyModalGreatSize = ({ open, title, children, onClose }) => {
    if (!open) {
        return null; // No renderiza nada si el modal no está abierto
    }

    return (
        <div className="modal-great-overlay">
            <div className="modal-great-content">
                <div className="modal-great-header">
                    <h3>{title}</h3>
                    <button className="modal-great-close-btn" onClick={onClose}>
                        ×
                    </button>
                </div>
                <div className="modal-great-body">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default MyModalGreatSize;
