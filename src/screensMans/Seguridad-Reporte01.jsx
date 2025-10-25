import React from 'react';
import Tabla from '../components/Tabla';
import '../components/Tabla.css';
import "../utils/Seguridad-Reporte01.css";

export default function Reporte01S() {
    React.useEffect(() => {
        document.title = "MLAP | Reporte 01-Seguridad";
    }, []);

    // Datos de ejemplo para frecuencia de roles
    const rolesData = [
        { id: 1, rol: 'Párroco', trabajadores: 50 },
        { id: 2, rol: 'Secretario', trabajadores: 35 },
        { id: 3, rol: 'Coordinador de Liturgia', trabajadores: 28 },
        { id: 4, rol: 'Catequista', trabajadores: 45 },
        { id: 5, rol: 'Ministro Extraordinario', trabajadores: 32 },
        { id: 6, rol: 'Lector', trabajadores: 40 },
        { id: 7, rol: 'Acólito', trabajadores: 25 },
        { id: 8, rol: 'Coordinador de Música', trabajadores: 18 },
        { id: 9, rol: 'Encargado de Mantenimiento', trabajadores: 15 },
        { id: 10, rol: 'Tesorero', trabajadores: 12 }
    ];

    // Definir columnas de la tabla
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
                <h2 className='title-screen'>Reporte 01: Frecuencia de roles asignados</h2>
                <div className='app-container'>
                    <div className="reporte-seguridad-container">
                        <Tabla
                            columns={columns}
                            data={rolesData}
                            itemsPerPage={10}
                            gridColumnsLayout="1fr 200px"
                            columnLeftAlignIndex={[1]}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
