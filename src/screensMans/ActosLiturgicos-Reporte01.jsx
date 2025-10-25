import React, { useState, useEffect } from 'react';
import MyButtonMediumIcon from '../components/MyButtonMediumIcon';
import BarChart from '../components/charts/BarChart';
import '../components/MyButtonMediumIcon.css';
import "../utils/ActosLiturgicos-Reporte01.css";

export default function Reporte01A() {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "MLAP | Reporte 01-Actos liturgicos";
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      // TODO: Reemplazar con tu endpoint real
      // const response = await fetch('http://localhost:3000/api/reportes/actos-liturgicos/01');
      // const data = await response.json();
      
      // Datos de ejemplo (temporal)
      const mockData = [
        { name: 'Bautismo', value: 95, color: '#FF6B9D' },
        { name: 'Confirmación', value: 132, color: '#4ECDC4' },
        { name: 'Matrimonio', value: 118, color: '#95E1D3' },
        { name: 'Primera comunión', value: 76, color: '#C44ECD' }
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
        <h2 className='title-screen'>Reporte 01: eventos realizados por capilla</h2>
        <div className='app-container'>
          {loading ? (
            <div className="loading-container">
              <p>Cargando datos...</p>
            </div>
          ) : (
            <div className="report-content">
              <BarChart 
                data={chartData}
                title="Cantidad de Reservas por Evento"
                xAxisLabel="Tipo de Evento"
                yAxisLabel="Cantidad de Reservas"
              />
              
              <div className="report-actions">
                <MyButtonMediumIcon 
                  text="Exportar PDF"
                  iconName="download"
                />
                <MyButtonMediumIcon 
                  text="Actualizar"
                  iconName="refresh"
                  onClick={fetchReportData}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}