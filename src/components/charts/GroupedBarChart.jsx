import React from 'react';
import ReactEcharts from 'echarts-for-react';

export default function GroupedBarChart({ data, categories }) {
    // Extraer el total de reservas FULFILLED por capilla
    const totalReservasData = data.map(item => item.totalReservas || 0);

    const option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            show: false // La leyenda se mostrará en el summary-section, no en el gráfico
        },
        grid: {
            left: '10%',
            right: '4%',
            bottom: '3%',
            containLabel: true,
            show: true,
            borderColor: '#ccc',
            borderWidth: 1
        },
        xAxis: {
            type: 'category',
            data: categories,
            axisTick: {
                alignWithLabel: true
            },
            axisLine: {
                lineStyle: {
                    color: '#ccc' // Color de la línea del eje X
                }
            },
            axisLabel: {
                color: '#555', // Color de las etiquetas del eje X
                fontWeight: 'bold' // Negrita para las etiquetas
            }
        },
        yAxis: {
            type: 'value',
            name: 'Cantidad de reservas realizadas',
            nameLocation: 'middle',
            nameGap: 50,
            nameTextStyle: {
                color: '#000',
                fontSize: 12,
                fontWeight: 'bold'
            },
            nameRotate: 90,
            axisLine: {
                show: true, // Mostrar la línea del eje Y
                lineStyle: {
                    color: '#ccc' // Color de la línea del eje Y
                }
            },
            axisLabel: {
                color: '#777' // Color de las etiquetas del eje Y
            },
            splitLine: {
                show: true, // Mostrar líneas de la grilla
                lineStyle: {
                    type: 'solid',
                    color: '#eee' // Color más suave para las líneas de la grilla
                }
            }
        },
        series: [
            {
                name: 'Total Reservas FULFILLED',
                type: 'bar',
                data: totalReservasData,
                itemStyle: {
                    color: '#5C6BC0',
                    borderRadius: [4, 4, 0, 0]
                },
                barWidth: '60%',
                label: {
                    show: true,
                    position: 'top',
                    color: '#333',
                    fontWeight: 'bold'
                }
            }
        ]
    };

    return (
        <ReactEcharts
            option={option}
            style={{ height: '100%', width: '100%' }}
            className='grouped-bar-echart'
        />
    );
}