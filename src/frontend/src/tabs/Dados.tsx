import React, { useState } from 'react';
import BarChart from '../components/BarChart';
import styles from '../Styles/Dados.module.css';

const Dados: React.FC = () => {
  const [mapType, setMapType] = useState<'estado' | 'bioma'>('estado');
  const [dataType, setDataType] = useState<'focos' | 'riscos' | 'queimadas'>('focos');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [region, setRegion] = useState<string>('');

  const handleApplyFilters = () => {
    console.log('Filtros Aplicados:', { mapType, dataType, startDate, endDate, region });
  };

  // Dados fictícios para o gráfico
  const chartData = {
    labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio'],
    datasets: [
      {
        label: 'Dados Selecionados',
        data: [65, 59, 80, 81, 56],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <section>
      <div className={styles.filterContainer}>
        <h2>Filtros</h2>
        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <p>Tipo do mapa:</p>
            <label>
              <input
                type="radio"
                name="mapType"
                value="estado"
                checked={mapType === 'estado'}
                onChange={(e) => setMapType(e.target.value as 'estado' | 'bioma')}
              />
              Estado
            </label>
            <label>
              <input
                type="radio"
                name="mapType"
                value="bioma"
                checked={mapType === 'bioma'}
                onChange={(e) => setMapType(e.target.value as 'estado' | 'bioma')}
              />
              Bioma
            </label>
          </div>

          <div className={styles.filterGroup}>
            <p>Tipo de dados:</p>
            <label>
              <input
                type="radio"
                name="dataType"
                value="focos"
                checked={dataType === 'focos'}
                onChange={(e) => setDataType(e.target.value as 'focos' | 'riscos' | 'queimadas')}
              />
              Focos de Calor
            </label>
            <label>
              <input
                type="radio"
                name="dataType"
                value="riscos"
                checked={dataType === 'riscos'}
                onChange={(e) => setDataType(e.target.value as 'focos' | 'riscos' | 'queimadas')}
              />
              Risco de Fogo
            </label>
            <label>
              <input
                type="radio"
                name="dataType"
                value="queimadas"
                checked={dataType === 'queimadas'}
                onChange={(e) => setDataType(e.target.value as 'focos' | 'riscos' | 'queimadas')}
              />
              Áreas Queimadas
            </label>
          </div>

          <div className={styles.filterGroup}>
            <label htmlFor="startDate">Data Inicial:</label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className={styles.filterGroup}>
            <label htmlFor="endDate">Data Final:</label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div className={styles.filterGroup}>
            <label htmlFor="region">Estado / Bioma:</label>
            <select
              id="region"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
            >
              <option value="">Selecione</option>
              <option value="SP">São Paulo</option>
              <option value="MG">Minas Gerais</option>
              <option value="PA">Pará</option>
              <option value="Amazônia">Amazônia</option>
              <option value="Cerrado">Cerrado</option>
            </select>
          </div>

          <button className={styles.applyButton} onClick={handleApplyFilters}>
            Aplicar Filtros
          </button>
        </div>
      </div>

      <div className={styles.chartContainer}>
        <h3>Média de todos os dados</h3>
        <div className={styles.chartWrapper}>
          <BarChart labels={chartData.labels} data={chartData.datasets[0].data} title="Média de todos os dados" />
        </div>
        <p className={styles.chartLegend}>
          <strong>Legenda:</strong> Este gráfico representa a média dos dados selecionados ao longo dos meses.
        </p>
      </div>
    </section>
  );
};

export default Dados;