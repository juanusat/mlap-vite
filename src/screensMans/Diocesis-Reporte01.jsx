import React, { useState, useEffect } from 'react';
import DonutChart from '../components/charts/DonutChart';
import { getParishHierarchy, getChapelEvents } from '../services/reportService';
import "../utils/Diocesis-Reporte01.css";

export default function Reporte01D() {
  const [allParishData, setAllParishData] = useState([]);
  const [selectedParish, setSelectedParish] = useState(null);
  const [selectedChapel, setSelectedChapel] = useState(null);
  const [availableChapels, setAvailableChapels] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.title = "MLAP | Reporte 01-Diocesis";
    loadParishHierarchy();
  }, []);

  useEffect(() => {
    if (selectedParish && allParishData.length > 0) {
      const parish = allParishData.find(p => p.parish_name === selectedParish);
      if (parish) {
        const chapelNames = parish.chapels.map(c => c.chapel_name);
        setAvailableChapels(chapelNames);
        if (chapelNames.length > 0) {
          setSelectedChapel(chapelNames[0]);
        }
      }
    }
  }, [selectedParish, allParishData]);

  useEffect(() => {
    if (selectedParish && selectedChapel) {
      fetchChapelEventData(selectedParish, selectedChapel);
    }
  }, [selectedParish, selectedChapel]);

  const loadParishHierarchy = async () => {
    setIsLoading(true);
    try {
      const response = await getParishHierarchy();
      const hierarchyData = response.data || [];
      setAllParishData(hierarchyData);
      
      if (hierarchyData.length > 0) {
        setSelectedParish(hierarchyData[0].parish_name);
      }
    } catch (error) {
      console.error('Error al cargar jerarquía de parroquias:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchChapelEventData = async (parishName, chapelName) => {
    setIsLoading(true);
    try {
      const response = await getChapelEvents(parishName, chapelName);
      const events = response.data.events || [];
      
      const colors = ['#E91E8C', '#E74C3C', '#A8D14F', '#27AE60', '#3498DB', '#9B59B6', '#F39C12', '#1ABC9C'];
      
      const transformedData = events.map((event, index) => ({
        name: event.event_name,
        value: parseInt(event.count),
        color: colors[index % colors.length]
      }));
      
      setChartData(transformedData);
    } catch (error) {
      console.error('Error al cargar datos de eventos:', error);
      setChartData([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="content-module only-this">
        <h2 className='title-screen'>Gráfico 1: Eventos generales más usados en capillas</h2>
        <div className='app-container'>
          <div className="filter-controls">
            <div className="filter-group">
              <label htmlFor="parish-select">Parroquia:</label>
              <select 
                id="parish-select"
                value={selectedParish || ''}
                onChange={(e) => setSelectedParish(e.target.value)}
                disabled={isLoading}
              >
                {allParishData.map(parish => (
                  <option key={parish.parish_id} value={parish.parish_name}>
                    {parish.parish_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="chapel-select">Capilla:</label>
              <select 
                id="chapel-select"
                value={selectedChapel || ''}
                onChange={(e) => setSelectedChapel(e.target.value)}
                disabled={isLoading}
              >
                {availableChapels.map(chapelName => (
                  <option key={chapelName} value={chapelName}>
                    {chapelName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {isLoading && (
            <div className="loading-container">
              <p>Cargando datos...</p>
            </div>
          )}

          {!isLoading && chartData.length === 0 && (
            <div className="empty-message">
              <p>No hay datos de eventos para esta selección.</p>
            </div>
          )}

          {!isLoading && chartData.length > 0 && (
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
