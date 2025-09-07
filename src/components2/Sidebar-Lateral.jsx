// Sidebar.jsx

import React from 'react';
import MyButtonShortAction from "../components2/MyButtonShortAction";
import './Sidebar-Lateral.css';

const Sidebar = ({ items, title, isOpen, toggleSidebar, onDeleteRole, userId }) => {
    return (
        <div className={`sidebar-container ${isOpen ? 'open' : ''}`}>
            <div className='sidebar-title-button'>
                {title && <h3 className="sidebar-title">{title}</h3>}
                <MyButtonShortAction type="close" title="Cerrar" onClick={toggleSidebar}>Cerrar</MyButtonShortAction>
            </div>
            <div className="sidebar-list">
                {items.map((item) => (
                    <div key={`${userId}-${item}`} className="sidebar-list-item">
                        {item}
                        <MyButtonShortAction
                            type="delete"
                            title="Eliminar Rol"
                            onClick={() => { console.log("Rol a eliminar:", item); onDeleteRole(item) }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Sidebar;