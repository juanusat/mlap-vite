import React, { useState, useEffect } from 'react';
import GroupedBarChart from '../components/charts/GroupedBarChart';
import { getReservationsByChapel } from '../services/reportService';
import { searchChapels } from '../services/chapelService';
import "../utils/ActosLiturgicos-Reporte01.css";

export default function Reporte01A() {
    const [selectedChapels, setSelectedChapels] = useState([]);
    const [reportData, setReportData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [availableChapels, setAvailableChapels] = useState([]);
    const [totals, setTotals] = useState({
        totalBautismos: 0,
        totalMatrimonios: 0,
        totalConfirmaciones: 0,
        totalReservas: 0
    });

    useEffect(() => {
        document.title = "MLAP | Reporte 01-Actos Litúrgicos";
        loadAvailableChapels();
    }, []);

    useEffect(() => {
        calculateTotals();
    }, [reportData]);

    const loadAvailableChapels = async () => {
        try {
            const response = await searchChapels(1, 100, '');
            setAvailableChapels(response.data || []);
        } catch (error) {
            console.error('Error al cargar capillas:', error);
        }
    };

    const addChapel = async (chapelName) => {
        if (!chapelName || selectedChapels.includes(chapelName)) {
            return;
        }

        setIsLoading(true);
        try {
            const response = await getReservationsByChapel(chapelName);
            const stats = response.data.statistics;
            let totalReservasCapilla = 0;
            stats.forEach(s => {
                const cantidad = Number(s.count) || 0;
                totalReservasCapilla += cantidad;
                console.log(`Capilla: ${chapelName} | Estado: ${s.status} | Cantidad: ${cantidad}`);
            });
            console.log(`Total de reservas obtenidas para capilla ${chapelName}: ${totalReservasCapilla}`);

            // Filtrar solo reservas con estado FULFILLED
            const fulfilledStats = stats.filter(s => s.status === 'FULFILLED');
            // Agrupar por evento base real
            const resumenPorEvento = {};
            fulfilledStats.forEach(s => {
                if (s.reservations && Array.isArray(s.reservations)) {
                    s.reservations.forEach(r => {
                        const eventoBase = r.event_base_name || 'Evento';
                        resumenPorEvento[eventoBase] = (resumenPorEvento[eventoBase] || 0) + 1;
                        console.log(`Reserva FULFILLED | Usuario: ${r.user_id} | Beneficiario: ${r.beneficiary_full_name} | Evento base: ${eventoBase}`);
                    });
                }
            });

            // Calcular total de reservas fulfilled para esta capilla
            const totalFulfilledCapilla = Object.values(resumenPorEvento).reduce((sum, val) => sum + Number(val), 0);

            const chapelData = {
                capilla: chapelName,
                resumenEventos: resumenPorEvento,
                totalReservas: totalFulfilledCapilla
            };

            setReportData(prev => [...prev, chapelData]);
            setSelectedChapels(prev => [...prev, chapelName]);
        } catch (error) {
            console.error('Error al cargar datos de capilla:', error);
            alert(`Error al cargar datos de ${chapelName}: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const removeChapel = (chapelName) => {
        setReportData(prev => prev.filter(item => item.capilla !== chapelName));
        setSelectedChapels(prev => prev.filter(name => name !== chapelName));
    };

    const calculateTotals = () => {
        let totalReservas = 0;
        reportData.forEach(item => {
            if (item.resumenEventos) {
                Object.values(item.resumenEventos).forEach(val => {
                    totalReservas += Number(val);
                });
            }
        });
        setTotals({
            totalReservas
        });
    };

    const capillas = reportData.map(item => item.capilla);

    return (
        <>
            <div className="content-module only-this">
                <h2 className='title-screen'>Gráfico 1: Reservas realizadas por capilla</h2>
                <div className='app-container'>
                    <div className="reporte01-container">
                        
                        <div className="filter-controls-ALR1">
                            <div className="chapel-selector">
                                <label htmlFor="chapel-select">Seleccionar Capilla:</label>
                                <select 
                                    id="chapel-select"
                                    onChange={(e) => addChapel(e.target.value)}
                                    value=""
                                    disabled={isLoading}
                                >
                                    <option value="">-- Seleccione una capilla --</option>
                                    {availableChapels
                                        .filter(chapel => !selectedChapels.includes(chapel.name))
                                        .map(chapel => (
                                            <option key={chapel.id} value={chapel.name}>
                                                {chapel.name}
                                            </option>
                                        ))
                                    }
                                </select>
                            </div>

                            {selectedChapels.length > 0 && (
                                <div className="selected-chapels">
                                    <h4>Capillas Seleccionadas:</h4>
                                    <ul>
                                        {selectedChapels.map(chapelName => (
                                            <li key={chapelName}>
                                                <span>{chapelName}</span>
                                                <button 
                                                    onClick={() => removeChapel(chapelName)}
                                                    className="remove-chapel-btn"
                                                    disabled={isLoading}
                                                >
                                                    ×
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {isLoading && (
                            <div className="loading-message">
                                <p>Cargando datos...</p>
                            </div>
                        )}

                        {!isLoading && reportData.length === 0 && (
                            <div className="empty-message">
                                <p>Seleccione una o más capillas para generar el reporte.</p>
                            </div>
                        )}

                        {!isLoading && reportData.length > 0 && (
                            <div className="chart-summary-wrapper">
                                <div className="chart-section">
                                    <GroupedBarChart 
                                        data={reportData}
                                        categories={capillas}
                                    />
                                </div>

                                <div className="summary-section">
                                    <h3 className="summary-title">Resumen por Capilla</h3>
                                    <div className="summary-cards-container">
                                        {reportData.map((item) => (
                                            <div className="summary-card-content" key={item.capilla}>
                                                <h4 className="summary-card-title">{item.capilla}</h4>
                                                {item.totalReservas === 0 ? (
                                                    <div className="summary-item">
                                                        <div className="summary-content">
                                                            <span className="summary-label" style={{fontStyle: 'italic', color: '#999'}}>Sin reservas</span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    item.resumenEventos && Object.entries(item.resumenEventos).map(([evento, cantidad]) => (
                                                        <div className="summary-item" key={evento}>
                                                            <div className="summary-indicator"></div>
                                                            <div className="summary-content">
                                                                <span className="summary-label">{evento}</span>
                                                                <span className="summary-value">{cantidad}</span>
                                                            </div>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="summary-divider"></div>
                                    <div className="summary-total">
                                        <span className="total-label">Total de Reservas</span>
                                        <span className="total-value">{totals.totalReservas}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}