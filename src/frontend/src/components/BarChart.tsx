import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

interface BarChartProps {
  labels: string[]; 
  data: number[]; 
  title: string; 
  isPercentage?: boolean;
}

const BarChart: React.FC<BarChartProps> = ({ labels, data, title, isPercentage = false }) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      
      chartInstance.current = new Chart(chartRef.current, {
        type: 'bar',
        data: {
          labels: labels.length > 0 ? labels : ['Sem dados'],
          datasets: [
            {
              label: title,
              data: data.length > 0 ? data : [0],
              backgroundColor: 'rgba(75, 192, 192, 0.2)', 
              borderColor: 'rgba(75, 192, 192, 1)', 
              borderWidth: 1, 
            },
          ],
        },
        options: {
          responsive: true, 
          plugins: {
            legend: {
              display: true,
              position: 'top', 
            },
            title: {
              display: true,
              text: title, 
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Categorias', 
              },
            },
            y: {
              beginAtZero: true, 
              title: {
                display: true,
                text: 'Valores', 
              },
              max: isPercentage ? 100 : undefined,
            },
          },
        },
      });
    }

    
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [labels, data, title, isPercentage]);

  useEffect(() => {
    console.log('Labels atualizados:', labels);
    console.log('Data atualizados:', data);
  }, [labels, data]);

  return <canvas ref={chartRef}></canvas>; 
};

export default BarChart;