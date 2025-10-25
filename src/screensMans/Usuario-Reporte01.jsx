import React from 'react';
import Tabla from '../components/Tabla';
import '../components/Tabla.css';
import "../utils/Usuario-Reporte01.css";

export default function Reporte01U() {
    React.useEffect(() => {
        document.title = "MLAP | Reporte 01-Usuario";
    }, []);

    // Datos de ejemplo de la bitácora de cambios en la cuenta
    const cambiosCuentaData = [
        { 
            id: 1, 
            cambio: 'Actualización de contraseña', 
            fecha: '23/10/2025 14:30',
            usuario: 'Juan Pérez'
        },
        { 
            id: 2, 
            cambio: 'Cambio de correo electrónico', 
            fecha: '22/10/2025 09:15',
            usuario: 'María González'
        },
        { 
            id: 3, 
            cambio: 'Modificación de nombre de usuario', 
            fecha: '21/10/2025 16:45',
            usuario: 'Pedro Rodríguez'
        },
        { 
            id: 4, 
            cambio: 'Actualización de foto de perfil', 
            fecha: '20/10/2025 11:20',
            usuario: 'Ana Martínez'
        },
        { 
            id: 5, 
            cambio: 'Cambio de número de teléfono', 
            fecha: '19/10/2025 08:50',
            usuario: 'Carlos López'
        },
        { 
            id: 6, 
            cambio: 'Actualización de dirección', 
            fecha: '18/10/2025 15:10',
            usuario: 'Lucía Fernández'
        },
        { 
            id: 7, 
            cambio: 'Cambio de rol asignado', 
            fecha: '17/10/2025 10:35',
            usuario: 'Roberto Silva'
        },
        { 
            id: 8, 
            cambio: 'Actualización de contraseña', 
            fecha: '16/10/2025 13:25',
            usuario: 'Carmen Díaz'
        },
        { 
            id: 9, 
            cambio: 'Modificación de datos personales', 
            fecha: '15/10/2025 17:00',
            usuario: 'José Ramírez'
        },
        { 
            id: 10, 
            cambio: 'Cambio de configuración de privacidad', 
            fecha: '14/10/2025 09:40',
            usuario: 'Isabel Torres'
        },
        { 
            id: 11, 
            cambio: 'Actualización de correo electrónico', 
            fecha: '13/10/2025 12:15',
            usuario: 'Miguel Ángel Castro'
        },
        { 
            id: 12, 
            cambio: 'Cambio de contraseña', 
            fecha: '12/10/2025 14:55',
            usuario: 'Elena Morales'
        }
    ];

    // Definir columnas de la tabla
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
                <h2 className='title-screen'>Reporte 01: Cambios en la cuenta</h2>
                <div className='app-container'>
                    <div className="reporte-usuario-container">
                        <div className="reporte-info">
                            <p>Historial de cambios registrados en la bitácora de usuario</p>
                        </div>
                        <Tabla
                            columns={columns}
                            data={cambiosCuentaData}
                            itemsPerPage={10}
                            gridColumnsLayout="2fr 1fr"
                            columnLeftAlignIndex={[1]}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
