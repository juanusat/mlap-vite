import './formsUI.css';
import React from 'react';

export default function Textarea({ label, name, value, onChange, required = false, disabled = false, placeholder = '', rows = 3, ...props }) {
  return (
    <div className="form-group">
      {label && <label htmlFor={name}>{label}</label>}
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        rows={rows}
        {...props}
      />
    </div>
  );
}
