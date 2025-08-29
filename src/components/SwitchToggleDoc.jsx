import React from 'react';
import './SwitchToggleDoc.css';

export default function SwitchToggleDoc({ checked, onChange }) {
  return (
    <label className="switch-toggle-doc">
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className="slider-doc" />
    </label>
  );
}
