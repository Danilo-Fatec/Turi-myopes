import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

interface BarChartProps {
  labels: string[];
  data: number[];
  title: string;
  isPercentage?: boolean;
  barColors?: string[];
}

const defaultColors = [
  '#00E1FF', // neon blue
  '#FF005A', // vivid pink
  '#FFD600', // yellow
  '#00D26A', // green
  '#FF8A00', // orange
  '#B700FF', // purple
  '#FF3D00', // red
  '#49FF00', // lime
  '#0091FF', // blue
  '#FF00C3', // magenta
];

const BarChart: React.FC<BarChartProps> = ({
  labels,
  data,
  title,
  isPercentage = false,
  barColors = defaultColors,
}) => {
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
              backgroundColor: labels.map((_, idx) => barColors[idx % barColors.length]),
              borderColor: '#111',
              borderWidth: 2,
              borderRadius: 2,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: false,
            },
            title: {
              display: true,
              text: title,
              font: {
                size: 22
              }
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Categorias',
                font: {
                  size: 18
                }
              },
              ticks: {
                font: {
                  size: 16
                }
              }
            },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Valores',
                font: {
                  size: 18
                }
              },
              ticks: {
                font: {
                  size: 16
                }
              },
              max: isPercentage ? 100 : undefined,
            },
          },
          elements: {
            bar: {
              borderWidth: 2,
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
  }, [labels, data, title, isPercentage, barColors]);

  return <canvas ref={chartRef}></canvas>;
};

export default BarChart;