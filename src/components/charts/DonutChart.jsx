import React from 'react';
import ReactECharts from 'echarts-for-react';

const DonutChart = ({ data, title }) => {
  const option = {
    title: {
      text: title,
      left: 'center',
      top: 20,
      textStyle: {
        fontSize: 18,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      right: '10%',
      top: 'center',
      itemGap: 20,
      textStyle: {
        fontSize: 14,
        fontWeight: '500'
      },
      icon: 'circle'
    },
    series: [
      {
        name: 'Eventos',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['35%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: data.map(item => ({
          value: item.value,
          name: item.name,
          itemStyle: {
            color: item.color
          }
        }))
      }
    ]
  };

  return (
    <ReactECharts 
      option={option} 
      style={{ height: '500px', width: '100%' }}
      opts={{ renderer: 'svg' }}
    />
  );
};

export default DonutChart;
