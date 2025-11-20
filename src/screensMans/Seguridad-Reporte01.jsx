import React, { useState, useEffect } from 'react';
import Tabla from '../components/Tabla';
import { getRoleFrequency } from '../services/reportService';
import '../components/Tabla.css';
import "../utils/Seguridad-Reporte01.css";

export default function Reporte01S() {
    const [rolesData, setRolesData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [totalWorkers, setTotalWorkers] = useState(0);

    useEffect(() => {
        document.title = "MLAP | Reporte 01-Seguridad";
        loadRoleFrequency();
    }, []);

    const loadRoleFrequency = async () => {
        setIsLoading(true);
        try {
            const response = await getRoleFrequency();
            const roles = response.data.roles || [];
            
            const transformedData = roles.map((role) => ({
                id: role.role_id,
                rol: role.role_name,
                trabajadores: parseInt(role.worker_count)
            }));
            
            setRolesData(transformedData);
            setTotalWorkers(response.data.total_workers);
        } catch (error) {
            console.error('Error al cargar frecuencia de roles:', error);
            setRolesData([]);
            setTotalWorkers(0);
        } finally {
            setIsLoading(false);
        }
    };

    const columns = [
        {
            key: 'rol',
            header: 'Rol',
            accessor: (row) => row.rol
        },
        {
            key: 'trabajadores',
            header: 'Trabajadores',
            accessor: (row) => row.trabajadores
        }
    ];

    return (
        <>
            <div className="content-module only-this">
                <h2 className='title-screen'>Reporte 1: Frecuencia de roles asignados</h2>
                <div className='app-container'>
                    {isLoading && (
                        <div className="loading-message">
                            <p>Cargando datos...</p>
                        </div>
                    )}

                    {!isLoading && (
                        <div className="reporte-seguridad-container">
                            <div className="reporte-summary">
                                <div className="summary-card">
                                    <span className="summary-label">Total de trabajadores asignados:</span>
                                    <span className="summary-value">{totalWorkers}</span>
                                </div>
                            </div>

                            {rolesData.length === 0 ? (
                                <div className="empty-message">
                                    <p>No hay datos de roles para mostrar.</p>
                                </div>
                            ) : (
                                <Tabla
                                    columns={columns}
                                    data={rolesData}
                                    itemsPerPage={10}
                                    gridColumnsLayout="1fr 200px"
                                    columnLeftAlignIndex={[1]}
                                />
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
