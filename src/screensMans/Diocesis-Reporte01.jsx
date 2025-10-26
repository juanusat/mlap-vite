import React, { useState, useEffect } from 'react';
import DonutChart from '../components/charts/DonutChart';
import "../utils/Diocesis-Reporte01.css";

export default function Reporte01D() {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "MLAP | Reporte 01-Diocesis";
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      // TODO: Reemplazar con tu endpoint real
      // const response = await fetch('http://localhost:3000/api/reportes/diocesis/01');
      // const data = await response.json();
      
      // Datos de ejemplo basados en la imagen (temporal)
      const mockData = [
        { name: 'Bautismo', value: 25, color: '#E91E8C' },
        { name: 'Matrimonio', value: 20, color: '#E74C3C' },
        { name: 'Confirmación', value: 25, color: '#A8D14F' },
        { name: 'Primera comunión', value: 20, color: '#27AE60' },
        { name: 'Mención en misa', value: 30, color: '#3498DB' }
      ];
      
      setChartData(mockData);
    } catch (error) {
      console.error('Error al cargar datos del reporte:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="content-module only-this">
        <h2 className='title-screen'>Reporte 01: eventos generales más usados en capillas</h2>
        <div className='app-container'>
          {loading ? (
            <div className="loading-container">
              <p>Cargando datos...</p>
            </div>
          ) : (
            <div className="report-content">
              <DonutChart 
                data={chartData}
                title="Eventos generales más usados en capillas"
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
