import React, { useState, useEffect } from 'react';
import Tabla from '../components/Tabla';
import { getCancelledReservations } from '../services/reportService';
import '../components/Tabla.css';
import "../utils/Reservas-Reporte01.css";

export default function Reporte01R() {
    const [reservasCanceladasData, setReservasCanceladasData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        document.title = "MLAP | Reporte 01-Reservas";
        loadCancelledReservations();
    }, []);

    const loadCancelledReservations = async () => {
        setIsLoading(true);
        try {
            const response = await getCancelledReservations();
            const reservations = response.data.reservations || [];
            
            const transformedData = reservations.map((res, index) => ({
                id: res.id,
                evento: res.event_name,
                parroquia: res.parish_name,
                capilla: res.chapel_name,
                fecha: new Date(res.event_date).toLocaleDateString('es-ES'),
                hora: res.event_time.substring(0, 5)
            }));
            
            setReservasCanceladasData(transformedData);
            setTotal(response.data.total);
        } catch (error) {
            console.error('Error al cargar reservas canceladas:', error);
            setReservasCanceladasData([]);
            setTotal(0);
        } finally {
            setIsLoading(false);
        }
    };

    // Definir columnas de la tabla
    const columns = [
        {
            key: 'evento',
            header: 'Evento',
            accessor: (row) => row.evento
        },
        {
            key: 'parroquia',
            header: 'Parroquia',
            accessor: (row) => row.parroquia
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
                <h2 className='title-screen'>Reporte 01: Cantidad de reservas canceladas</h2>
                <div className='app-container'>
                    <div className="reporte-reservas-container">
                        <div className="reporte-summary">
                            <div className="summary-card">
                                <span className="summary-label">Total de reservas canceladas:</span>
                                <span className="summary-value">{reservasCanceladasData.length}</span>
                            </div>
                        </div>
                        <Tabla
                            columns={columns}
                            data={reservasCanceladasData}
                            itemsPerPage={10}
                            gridColumnsLayout="1fr 2fr 150px"
                            columnLeftAlignIndex={[1, 2]}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
