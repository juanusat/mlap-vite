// src/components/ToggleSwitch.jsx
import React from 'react';
import './ToggleSwitch.css'; // We'll create this CSS next

const ToggleSwitch = ({ isEnabled, onToggle }) => {
  return (
    <label className="switch">
      <input 
        type="checkbox" 
        checked={isEnabled} 
        onChange={onToggle} 
      />
      <span className="slider round"></span>
    </label>
  );
};

export default ToggleSwitch;