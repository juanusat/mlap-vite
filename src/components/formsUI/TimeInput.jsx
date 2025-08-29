import './formsUI.css';
import React from 'react';

export default function TimeInput({ label, name, value, onChange, required = false, disabled = false, ...props }) {
  return (
    <div className="form-group">
      {label && <label htmlFor={name}>{label}</label>}
      <input
        type="time"
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        {...props}
      />
    </div>
  );
}
