import React from 'react';
import GroupedBarChart from '../components/charts/GroupedBarChart';
import "../utils/ActosLiturgicos-Reporte01.css";

export default function Reporte01A() {
    React.useEffect(() => {
        document.title = "MLAP | Reporte 01-Actos liturgicos";
    }, []);

    // Datos del gráfico agrupado por capilla
    const chapelData = [
        { name: 'Capilla Santa Ana', bautismo: 93, matrimonio: 132, confirmacion: 112 },
        { name: 'Capilla San José', bautismo: 93, matrimonio: 132, confirmacion: 112 },
        { name: 'Capilla María Auxiliadora', bautismo: 93, matrimonio: 132, confirmacion: 112 },
        { name: 'Capilla San Miguel', bautismo: 93, matrimonio: 132, confirmacion: 112 }
    ];

    // Categorías de eventos
    const eventCategories = [
        { key: 'bautismo', label: 'Bautismo', color: '#F28B82' },
        { key: 'matrimonio', label: 'Matrimonio', color: '#4FC3F7' },
        { key: 'confirmacion', label: 'Confirmación', color: '#66BB6A' }
    ];

    return (
        <>
            <div className="content-module only-this">
                <h2 className='title-screen'>Reporte 01: Eventos realizados por capilla</h2>
                <div className='app-container'>
                    <GroupedBarChart 
                        data={chapelData}
                        categories={eventCategories}
                        yAxisLabel="Cantidad de reservas realizadas"
                        maxValue={140}
                        yAxisStep={20}
                    />
                </div>
            </div>
        </>
    );
}