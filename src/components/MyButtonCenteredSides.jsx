import React from 'react';
import './MyButtonCenteredSides.css';

export default function MyButtonCenteredSides({ children }) {
  return (
    <div className="button-centered-container">
      {children}
    </div>
  );
}
