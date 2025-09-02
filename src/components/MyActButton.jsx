import React from 'react';
import './MyActButton.css'; // Archivo CSS específico para este botón

const ActoButton = ({ nombre, isActive, onClick }) => {
    return (
        <button
            className={`acto-button ${isActive ? 'selected' : ''}`}
            onClick={onClick}
        >
            {nombre}
        </button>
    );
};

export default ActoButton;