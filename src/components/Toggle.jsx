// src/components/ToggleSwitch.jsx
import React from 'react';
import './ToggleSwitch.css'; // We'll create this CSS next

const ToggleSwitch = ({ isEnabled, onToggle, disabled = false, className = '' }) => {
  return (
    <label className={`switch ${className} ${disabled ? 'action-denied' : ''}`}>
      <input 
        type="checkbox" 
        checked={isEnabled} 
        onChange={onToggle}
        disabled={disabled}
      />
      <span className="slider round"></span>
    </label>
  );
};

export default ToggleSwitch;