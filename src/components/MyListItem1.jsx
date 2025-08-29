import React from 'react';
import './MyListItem1.css';

export default function MyListItem1({ children, baja }) {
  return (
    <div className={`ui-doc-item${baja ? ' ui-doc-baja' : ''}`}>
      {children}
    </div>
  );
}
