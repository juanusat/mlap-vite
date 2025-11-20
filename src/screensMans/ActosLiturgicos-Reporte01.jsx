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

            const chapelData = {
                capilla: chapelName,
                bautismo: stats.find(s => s.status === 'COMPLETED')?.count || 0,
                matrimonio: stats.find(s => s.status === 'FULFILLED')?.count || 0,
                confirmacion: stats.find(s => s.status === 'RESERVED')?.count || 0
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
        const totalBautismos = reportData.reduce((sum, item) => sum + item.bautismo, 0);
        const totalMatrimonios = reportData.reduce((sum, item) => sum + item.matrimonio, 0);
        const totalConfirmaciones = reportData.reduce((sum, item) => sum + item.confirmacion, 0);
        const totalReservas = totalBautismos + totalMatrimonios + totalConfirmaciones;

        setTotals({
            totalBautismos,
            totalMatrimonios,
            totalConfirmaciones,
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
                        
                        <div className="filter-controls">
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
                                    <h3 className="summary-title">Resumen por Evento</h3>
                                    
                                    <div className="summary-item">
                                        <div className="summary-indicator bautismo-indicator"></div>
                                        <div className="summary-content">
                                            <span className="summary-label">Bautismo</span>
                                            <span className="summary-value">{totals.totalBautismos}</span>
                                        </div>
                                    </div>

                                    <div className="summary-item">
                                        <div className="summary-indicator matrimonio-indicator"></div>
                                        <div className="summary-content">
                                            <span className="summary-label">Matrimonio</span>
                                            <span className="summary-value">{totals.totalMatrimonios}</span>
                                        </div>
                                    </div>

                                    <div className="summary-item">
                                        <div className="summary-indicator confirmacion-indicator"></div>
                                        <div className="summary-content">
                                            <span className="summary-label">Confirmación</span>
                                            <span className="summary-value">{totals.totalConfirmaciones}</span>
                                        </div>
                                    </div>

                                    <div className="summary-divider"></div>

                                    <div className="summary-total">
                                        <span className="total-label">Total de Reservas</span>
                                        <span className="total-value">{totals.totalReservas}</span>
                                    </div>

                                    <div className="chart-legend-section">
                                        <div className="chart-legend-item">
                                            <div className="summary-indicator bautismo-indicator"></div>
                                            <span>Bautismo</span>
                                        </div>
                                        <div className="chart-legend-item">
                                            <div className="summary-indicator matrimonio-indicator"></div>
                                            <span>Matrimonio</span>
                                        </div>
                                        <div className="chart-legend-item">
                                            <div className="summary-indicator confirmacion-indicator"></div>
                                            <span>Confirmación</span>
                                        </div>
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