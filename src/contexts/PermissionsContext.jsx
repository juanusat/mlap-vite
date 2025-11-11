import React, { createContext, useState, useContext } from 'react';

const PermissionsContext = createContext();

export const PermissionsProvider = ({ children }) => {
  const [permissions, setPermissions] = useState([]);

  const hasPermission = (permissionCode) => {
    if (!permissionCode) {
      console.log('⚠️ hasPermission: permissionCode vacío o undefined');
      return false;
    }
    const result = permissions.includes(permissionCode);
    console.log(`🔍 hasPermission('${permissionCode}'): ${result} | Total permisos: ${permissions.length}`);
    return result;
  };

  return (
    <PermissionsContext.Provider value={{ permissions, setPermissions, hasPermission }}>
      {children}
    </PermissionsContext.Provider>
  );
};

export const usePermissions = () => {
  const context = useContext(PermissionsContext);
  if (!context) {
    throw new Error('usePermissions debe ser usado dentro de PermissionsProvider');
  }
  return context;
};
