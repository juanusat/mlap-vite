import React from 'react';
import Tabla from '../components/Tabla';
import '../components/Tabla.css';
import "../utils/Reservas-Reporte02.css";

export default function Reporte02R() {
    React.useEffect(() => {
        document.title = "MLAP | Reporte 02-Reservas";
    }, []);

    // Datos de ejemplo para reservas completadas
    const reservasCompletadasData = [
        { 
            id: 1, 
            evento: 'Bautismo', 
            parroquia: 'Parroquia Santa María',
            fecha: '24/10/2025'
        },
        { 
            id: 2, 
            evento: 'Matrimonio', 
            parroquia: 'Parroquia San José',
            fecha: '23/10/2025'
        },
        { 
            id: 3, 
            evento: 'Confirmación', 
            parroquia: 'Parroquia del Carmen',
            fecha: '22/10/2025'
        },
        { 
            id: 4, 
            evento: 'Primera Comunión', 
            parroquia: 'Parroquia Santa Ana',
            fecha: '21/10/2025'
        },
        { 
            id: 5, 
            evento: 'Bautismo', 
            parroquia: 'Parroquia San Miguel',
            fecha: '20/10/2025'
        },
        { 
            id: 6, 
            evento: 'Matrimonio', 
            parroquia: 'Parroquia María Auxiliadora',
            fecha: '19/10/2025'
        },
        { 
            id: 7, 
            evento: 'Confirmación', 
            parroquia: 'Parroquia San Pedro',
            fecha: '18/10/2025'
        },
        { 
            id: 8, 
            evento: 'Bautismo', 
            parroquia: 'Parroquia Santa Rosa',
            fecha: '17/10/2025'
        },
        { 
            id: 9, 
            evento: 'Primera Comunión', 
            parroquia: 'Parroquia San Juan',
            fecha: '16/10/2025'
        },
        { 
            id: 10, 
            evento: 'Matrimonio', 
            parroquia: 'Parroquia Nuestra Señora de Fátima',
            fecha: '15/10/2025'
        },
        { 
            id: 11, 
            evento: 'Confirmación', 
            parroquia: 'Parroquia Santa Teresa',
            fecha: '14/10/2025'
        },
        { 
            id: 12, 
            evento: 'Bautismo', 
            parroquia: 'Parroquia San Francisco',
            fecha: '13/10/2025'
        },
        { 
            id: 13, 
            evento: 'Matrimonio', 
            parroquia: 'Parroquia del Sagrado Corazón',
            fecha: '12/10/2025'
        },
        { 
            id: 14, 
            evento: 'Primera Comunión', 
            parroquia: 'Parroquia San Antonio',
            fecha: '11/10/2025'
        },
        { 
            id: 15, 
            evento: 'Bautismo', 
            parroquia: 'Parroquia Santa Lucía',
            fecha: '10/10/2025'
        }
    ];

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
                <h2 className='title-screen'>Reporte 02: Cantidad de reservas completadas</h2>
                <div className='app-container'>
                    <div className="reporte-reservas-container">
                        <div className="reporte-summary">
                            <div className="summary-card completadas">
                                <span className="summary-label">Total de reservas completadas:</span>
                                <span className="summary-value">{reservasCompletadasData.length}</span>
                            </div>
                        </div>
                        <Tabla
                            columns={columns}
                            data={reservasCompletadasData}
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
