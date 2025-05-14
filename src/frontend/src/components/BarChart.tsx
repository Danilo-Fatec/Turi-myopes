import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

interface BarChartProps {
  labels: string[]; 
  data: number[]; 
  title: string; 
}

const BarChart: React.FC<BarChartProps> = ({ labels, data, title }) => {
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
          labels,
          datasets: [
            {
              label: title,
              data,
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
  }, [labels, data, title]);

  return <canvas ref={chartRef}></canvas>; 
};

export default BarChart;