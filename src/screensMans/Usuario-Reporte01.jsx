import React, { useState, useEffect } from 'react';
import Tabla from '../components/Tabla';
import '../components/Tabla.css';
import "../utils/Usuario-Reporte01.css";
import { getUserAuditLog } from '../services/reportService';

const actionTypeLabels = {
  'PASSWORD_CHANGE': 'Cambio de contraseña',
  'ACCOUNT_ACTIVATED': 'Cuenta activada',
  'ACCOUNT_DEACTIVATED': 'Cuenta desactivada',
  'USERNAME_CHANGE': 'Cambio de nombre de usuario',
  'ACCOUNT_CREATED': 'Cuenta creada',
  'ACCOUNT_DELETED': 'Cuenta eliminada'
};

export default function Reporte01U() {
    const [auditLogsData, setAuditLogsData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        document.title = "MLAP | Reporte 01-Usuario";
        loadUserAuditLog();
    }, []);

    const loadUserAuditLog = async () => {
        try {
            setIsLoading(true);
            const response = await getUserAuditLog();
            
            if (response.data && response.data.audit_logs) {
                const transformedData = response.data.audit_logs.map(log => ({
                    id: log.id,
                    cambio: actionTypeLabels[log.action_type] || log.action_type,
                    descripcion: log.description || '',
                    fecha: new Date(log.created_at).toLocaleString('es-MX', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                    })
                }));

                setAuditLogsData(transformedData);
                setTotal(response.data.total || 0);
            }
        } catch (error) {
            console.error('Error al cargar bitácora de usuario:', error);
            setAuditLogsData([]);
        } finally {
            setIsLoading(false);
        }
    };

    const columns = [
        {
            key: 'cambio',
            header: 'Cambio',
            accessor: (row) => row.cambio
        },
        {
            key: 'fecha',
            header: 'Fecha',
            accessor: (row) => row.fecha
        }
    ];

    return (
        <>
            <div className="content-module only-this">
                <h2 className='title-screen'>Reporte 1: Cambios en la cuenta</h2>
                <div className='app-container'>
                    <div className="reporte-usuario-container">
                        <div className="reporte-info">
                            <p>Historial de cambios registrados en la bitácora de usuario</p>
                        </div>
                        {isLoading ? (
                            <p>Cargando datos...</p>
                        ) : (
                            <Tabla
                                columns={columns}
                                data={auditLogsData}
                                itemsPerPage={10}
                                gridColumnsLayout="2fr 1fr"
                                columnLeftAlignIndex={[1]}
                            />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
