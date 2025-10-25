import React from 'react';
import './GroupedBarChart.css';

/**
 * Componente de gráfico de barras agrupadas
 * @param {Array} data - Array de objetos con la estructura: { name: string, [key]: number }
 * @param {Array} categories - Array de categorías con estructura: { key: string, label: string, color: string }
 * @param {string} yAxisLabel - Etiqueta para el eje Y
 * @param {number} maxValue - Valor máximo para la escala del eje Y
 * @param {number} yAxisStep - Paso entre valores del eje Y (default: 20)
 */
export default function GroupedBarChart({ 
    data = [], 
    categories = [], 
    yAxisLabel = "Valores",
    maxValue = 100,
    yAxisStep = 20
}) {
    
    // Generar valores del eje Y
    const generateYAxisValues = () => {
        const values = [];
        for (let i = maxValue; i >= 0; i -= yAxisStep) {
            values.push(i);
        }
        return values;
    };

    const yAxisValues = generateYAxisValues();

    return (
        <div className="grouped-chart-wrapper">
            
            {/* Leyenda */}
            <div className="grouped-chart-legend">
                {categories.map((category, index) => (
                    <div key={index} className="grouped-legend-item">
                        <div 
                            className="grouped-legend-color" 
                            style={{ backgroundColor: category.color }}
                        ></div>
                        <span>{category.label}</span>
                    </div>
                ))}
            </div>

            {/* Gráfico */}
            <div className="grouped-bar-chart-main">
                
                {/* Eje Y */}
                <div className="grouped-chart-y-axis">
                    <div className="grouped-y-axis-title">{yAxisLabel}</div>
                    <div className="grouped-y-axis-values">
                        {yAxisValues.map((value, index) => (
                            <div key={index} className="grouped-y-axis-value">{value}</div>
                        ))}
                    </div>
                </div>
                
                {/* Área de barras */}
                <div className="grouped-bars-area">
                    {data.map((group, groupIndex) => (
                        <div key={groupIndex} className="grouped-bar-group">
                            <div className="grouped-bars-set">
                                {categories.map((category, categoryIndex) => {
                                    const value = group[category.key] || 0;
                                    const heightPercentage = (value / maxValue) * 100;
                                    
                                    // Debug: verificar valores
                                    if (groupIndex === 0 && categoryIndex === 0) {
                                        console.log('Valor:', value, 'Max:', maxValue, 'Altura %:', heightPercentage);
                                    }
                                    
                                    return (
                                        <div key={categoryIndex} className="grouped-bar-item">
                                            <div 
                                                className="grouped-bar" 
                                                style={{
                                                    height: `${heightPercentage}%`,
                                                    backgroundColor: category.color
                                                }}
                                            >
                                                <div className="grouped-bar-tooltip">
                                                    <strong>{category.label}</strong>
                                                    <br />
                                                    {group.name}: {value}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="grouped-bar-group-label">{group.name}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
