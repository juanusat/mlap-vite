import React, { useState, useEffect } from 'react';
import './MatrixModal.css';

const MatrixModal = ({ isOpen, onClose, role, predefinedModules, onTogglePermission }) => {
    const [searchTerm, setSearchTerm] = useState('');

    // Resetear búsqueda cuando se abre el modal
    useEffect(() => {
        if (isOpen) {
            setSearchTerm('');
        }
    }, [isOpen]);

    if (!isOpen || !role) return null;

    const permissionTypes = ['Ver', 'Añadir', 'Editar', 'Eliminar', 'Buscar'];

    // Filtrar módulos basados en la búsqueda
    const filteredModules = predefinedModules.filter(module =>
        module.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const hasPermission = (moduleId, permissionName) => {
        return role.modules.some(mod =>
            mod.id === moduleId && mod.permissions.some(p => p.name === permissionName)
        );
    };

    const handleTogglePermission = (moduleId, permissionName) => {
        onTogglePermission(role.id, moduleId, permissionName);
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="modal full-screen-modal" style={{ display: 'flex' }} onClick={handleBackdropClick}>
            <div className="modal-content large-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Permisos de: {role.roleName}</h3>
                    <span className="close-btn" onClick={onClose}>&times;</span>
                </div>
                
                <div className="search-container" style={{ marginTop: '1em' }}>
                    <input 
                        type="text" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar módulo o permiso..."
                    />
                </div>
                
                <div className="permissions-matrix-container">
                    <table className="permissions-matrix-table">
                        <thead>
                            <tr>
                                <th>Módulo</th>
                                <th>Ver</th>
                                <th>Añadir</th>
                                <th>Editar</th>
                                <th>Eliminar</th>
                                <th>Buscar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredModules.length > 0 ? (
                                filteredModules.map((module) => (
                                    <tr key={module.id}>
                                        <td>{module.name}</td>
                                        {permissionTypes.map((type) => {
                                            const permissionName = `${type} ${module.name}`;
                                            const isChecked = hasPermission(module.id, permissionName);
                                            
                                            return (
                                                <td key={type}>
                                                    <label className="toggle-container" style={{ margin: 'auto' }}>
                                                        <input 
                                                            type="checkbox" 
                                                            checked={isChecked}
                                                            onChange={() => handleTogglePermission(module.id, permissionName)}
                                                        />
                                                        <span className="slider"></span>
                                                    </label>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} style={{ textAlign: 'center', padding: '2em', color: '#777' }}>
                                        No se encontraron módulos que coincidan con la búsqueda
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MatrixModal;
