import React from 'react';
import './MyModuleAccess.css';

export default function MyModuleAccess({ icon, text, iconSize = 38, onClick }) {
  const IconComponent = React.cloneElement(icon, { size: iconSize });
  
  return (
    <div className="mlap-module-access" onClick={onClick}>
      <div className="mlap-module-access-icon">
        {IconComponent}
      </div>
      <span>{text}</span>
    </div>
  );
}
