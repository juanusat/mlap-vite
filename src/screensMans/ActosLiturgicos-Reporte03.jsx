import React, { useState, useEffect } from 'react';
import MyButtonShortAction from '../components/MyButtonShortAction';
import MySchedule from '../components/MySchedule';
import { getOccupancyMap } from '../services/reportService';
import { searchChapels } from '../services/chapelService';
import '../components/MyButtonShortAction.css';
import { usePermissions } from '../hooks/usePermissions';
import { PERMISSIONS } from '../utils/permissions';
import NoPermissionMessage from '../components/NoPermissionMessage';
import "../utils/ActosLiturgicos-Reporte03.css";

export default function Reporte03A() {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedChapel, setSelectedChapel] = useState(null);
    const [availableChapels, setAvailableChapels] = useState([]);
    const [occupancyData, setOccupancyData] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const { hasPermission } = usePermissions();
    const canRead = hasPermission(PERMISSIONS.ACTOS_LITURGICOS_REP03);

    useEffect(() => {
        document.title = "MLAP | Reporte 03-Actos liturgicos";
        if (canRead) {
            loadAvailableChapels();
        }
    }, [canRead]);

    useEffect(() => {
        if (selectedChapel) {
            fetchOccupancyByChapel(selectedChapel);
        }
    }, [selectedChapel, currentMonth]);

    const loadAvailableChapels = async () => {
        try {
            const response = await searchChapels(1, 100, '');
            const chapels = response.data || [];
            setAvailableChapels(chapels);
            if (chapels.length > 0) {
                setSelectedChapel(chapels[0].name);
            }
        } catch (error) {
            console.error('Error al cargar capillas:', error);
        }
    };

    const fetchOccupancyByChapel = async (chapelName) => {
        setIsLoading(true);
        try {
            const year = currentMonth.getFullYear();
            const month = currentMonth.getMonth() + 1;

            console.log(`\n=== FRONTEND: Solicitando datos ===`);
            console.log(`Capilla: ${chapelName}`);
            console.log(`Año: ${year}, Mes: ${month}`);

            const response = await getOccupancyMap(chapelName, year, month);

            console.log(`\n=== FRONTEND: Respuesta recibida ===`);
            console.log('Response completa:', response);
            console.log('Ocupación:', response.data.occupancy);

            const transformedData = {};
            const occupancyArray = response.data.occupancy || [];

            console.log(`\n=== FRONTEND: Transformando datos ===`);
            console.log(`Total de franjas horarias: ${occupancyArray.length}`);

            occupancyArray.forEach((slot, index) => {
                console.log(`\nFranja ${index + 1}:`, slot);
                const timeIndex = timeSlots.findIndex(t => t.startsWith(slot.time));
                console.log(`  Hora: ${slot.time}, TimeIndex: ${timeIndex}`);

                if (timeIndex === -1) {
                    console.log(`  ⚠️ Hora ${slot.time} no encontrada en timeSlots`);
                    return;
                }

                transformedData[0] = transformedData[0] || {};
                transformedData[1] = transformedData[1] || {};
                transformedData[2] = transformedData[2] || {};
                transformedData[3] = transformedData[3] || {};
                transformedData[4] = transformedData[4] || {};
                transformedData[5] = transformedData[5] || {};
                transformedData[6] = transformedData[6] || {};

                // Guardar el conteo de reservas (no porcentaje)
                transformedData[0][timeIndex] = slot.monday || 0;
                transformedData[1][timeIndex] = slot.tuesday || 0;
                transformedData[2][timeIndex] = slot.wednesday || 0;
                transformedData[3][timeIndex] = slot.thursday || 0;
                transformedData[4][timeIndex] = slot.friday || 0;
                transformedData[5][timeIndex] = slot.saturday || 0;
                transformedData[6][timeIndex] = slot.sunday || 0;

                console.log(`  Lun: ${slot.monday}, Mar: ${slot.tuesday}, Mie: ${slot.wednesday}, Jue: ${slot.thursday}, Vie: ${slot.friday}, Sab: ${slot.saturday}, Dom: ${slot.sunday}`);
            });

            console.log(`\n=== FRONTEND: Datos transformados ===`);
            console.log('transformedData:', transformedData);

            setOccupancyData(transformedData);
        } catch (error) {
            console.error('Error al cargar datos de ocupación:', error);
            setOccupancyData({});
        } finally {
            setIsLoading(false);
        }
    };

    const timeSlots = [
        '08:00 - 09:00', '09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00',
        '12:00 - 13:00', '13:00 - 14:00', '14:00 - 15:00', '15:00 - 16:00',
        '16:00 - 17:00', '17:00 - 18:00'
    ];

    const daysOfWeek = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'];

    const monthNames = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    const navigateMonth = (direction) => {
        setCurrentMonth(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(newDate.getMonth() + direction);
            return newDate;
        });
    };

    const getMonthYear = () => {
        return `${monthNames[currentMonth.getMonth()]} ${currentMonth.getFullYear()}`;
    };

    // Función para convertir conteo de reservas a porcentaje según rangos
    // 1-3 reservas = 1-25%, 4-6 = 26-50%, 7-9 = 51-75%, 10+ = 76-100%
    const getPercentageFromCount = (count) => {
        if (count === 0) return 0;
        if (count >= 1 && count <= 3) return 12.5; // Promedio de 1-25%
        if (count >= 4 && count <= 6) return 37.5; // Promedio de 26-50%
        if (count >= 7 && count <= 9) return 62.5; // Promedio de 51-75%
        if (count >= 10) return 87.5; // Promedio de 76-100%
        return 0;
    };

    // Función para obtener el color del mapa de calor según conteo
    const getHeatmapColor = (count) => {
        if (count === 0) return '#FFFFFF'; // Blanco (0 reservas)
        if (count >= 1 && count <= 3) return '#A8E6CF'; // Verde claro (1-3 reservas = 1-25%)
        if (count >= 4 && count <= 6) return '#FFD93D'; // Amarillo (4-6 reservas = 26-50%)
        if (count >= 7 && count <= 9) return '#FF9A3C'; // Naranja (7-9 reservas = 51-75%)
        return '#D32F2F'; // Rojo oscuro (10+ reservas = 76-100%)
    };

    // Función para obtener el color del texto según el conteo
    const getTextColor = (count) => {
        if (count >= 1 && count <= 3) return '#2E7D32'; // Verde oscuro para fondos claros
        if (count >= 4 && count <= 6) return '#F57C00'; // Naranja oscuro
        return '#FFFFFF'; // Blanco para fondos oscuros
    };

    if (!canRead) {
        return <NoPermissionMessage />;
    }

    return (
        <>
            <div className="content-module only-this">
                <h2 className='title-screen'>Mapa 1: Horarios con más/menos ocupación</h2>
                <div className='app-container'>
                    <div className="reporte03-container">

                        <div className="controls-row">
                            <div className="chapel-selector">
                                <label htmlFor="chapel-select-occupancy">Capilla:</label>
                                <select
                                    id="chapel-select-occupancy"
                                    value={selectedChapel || ''}
                                    onChange={(e) => setSelectedChapel(e.target.value)}
                                    disabled={isLoading}
                                >
                                    {availableChapels.map(chapel => (
                                        <option key={chapel.id} value={chapel.name}>
                                            {chapel.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="month-navigation">
                                <MyButtonShortAction
                                    type="back"
                                    title="Mes anterior"
                                    onClick={() => navigateMonth(-1)}
                                    disabled={isLoading}
                                />
                                <span className="month-info">
                                    {getMonthYear()}
                                </span>
                                <MyButtonShortAction
                                    type="next"
                                    title="Mes siguiente"
                                    onClick={() => navigateMonth(1)}
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        {isLoading && (
                            <div className="loading-message">
                                <p>Cargando datos de ocupación...</p>
                            </div>
                        )}

                        {!isLoading && (
                            <>
                                <div className='occupancy-legend'>
                                    <span className='legend-title'>Nivel de ocupación (Mapa de calor):</span>
                                    <div className='legend-item'>
                                        <div className='legend-color heatmap-zero'></div>
                                        <span>0 reservas (0%)</span>
                                    </div>
                                    <div className='legend-item'>
                                        <div className='legend-color heatmap-low'></div>
                                        <span>1-3 reservas (1-25%)</span>
                                    </div>
                                    <div className='legend-item'>
                                        <div className='legend-color heatmap-medium-low'></div>
                                        <span>4-6 reservas (26-50%)</span>
                                    </div>
                                    <div className='legend-item'>
                                        <div className='legend-color heatmap-medium-high'></div>
                                        <span>7-9 reservas (51-75%)</span>
                                    </div>
                                    <div className='legend-item'>
                                        <div className='legend-color heatmap-high'></div>
                                        <span>10+ reservas (76-100%)</span>
                                    </div>
                                </div>

                                <MySchedule
                                    timeSlots={timeSlots}
                                    daysOfWeek={daysOfWeek}
                                    showDates={false}
                                    mode="heatmap"
                                    renderCell={(rowIndex, colIndex) => {
                                        const reservationCount = occupancyData[colIndex]?.[rowIndex] || 0;
                                        const percentage = getPercentageFromCount(reservationCount);
                                        const bgColor = getHeatmapColor(reservationCount);
                                        const textColor = getTextColor(reservationCount);

                                        return (
                                            <div
                                                className="grid-cell heatmap-cell"
                                                style={{
                                                    backgroundColor: bgColor,
                                                    color: textColor
                                                }}
                                                title={`${reservationCount} reserva${reservationCount !== 1 ? 's' : ''} (${Math.round(percentage)}%)`}
                                            >
                                                <span className="heatmap-percentage">{reservationCount}</span>
                                            </div>
                                        );
                                    }}
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
