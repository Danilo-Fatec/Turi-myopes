import React, { useCallback, useEffect, useState } from 'react'
import BarChart from '../components/BarChart'
import styles from '../Styles/Dados.module.css'
import { getServiceByFilters } from '../services/getDataByFiltersService'
import axios from 'axios';
import api from '../services/api';

const BIOMAS = [
  "Todos",
  "Amazônia",
  "Cerrado",
  "Caatinga",
  "Mata Atlântica",
  "Pampa",
  "Pantanal"
];

const ESTADOS = [
  "Todos",
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG",
  "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
];

const defaultColors = [
  '#00E1FF', // neon blue
  '#FF005A', // pink
  '#FFD600', // yellow
  '#00D26A', // green
  '#FF8A00', // orange
  '#B700FF', // purple
  '#FF3D00', // red
  '#49FF00', // lime
  '#0091FF', // blue
  '#FF00C3', // magenta
];

function top10LabelsAndValues(labels: string[], values: number[]) {
  const zipped = labels.map((label, idx) => ({
    label,
    value: values[idx]
  }));
  zipped.sort((a, b) => b.value - a.value);
  const sliced = zipped.slice(0, 10);
  return {
    labels: sliced.map(item => item.label),
    values: sliced.map(item => item.value)
  };
}

const Dados: React.FC = () => {
  const [mapType, setMapType] = useState<'estado' | 'bioma'>('estado')
  const [dataType, setDataType] = useState<'focos' | 'risco' | 'areas'>('focos')
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [region, setRegion] = useState<string>('')
  const [labels, setLabels] = useState<string[]>([])
  const [data, setData] = useState<number[]>([])
  const [loading, setLoading] = useState(false)
  const [percentage, isPercentage] = useState(false)

  function transformarValoresEmPorcentagem(
    labels: string[],
    values: number[]
  ): { labels: string[]; values: number[] } {
    const total = values.reduce((acc, val) => acc + val, 0);

    if (total === 0) return { labels, values: values.map(() => 0) };

    const valoresEmPorcentagem = values.map(val =>
      parseFloat(((val / total) * 100).toFixed(2))
    );

    return { labels, values: valoresEmPorcentagem };
  }

  const fetchData = async (dataType: string, mapType: string, region: string) => {
    try {
      const params: any = {}
      if (startDate) params.startDate = startDate
      if (endDate) params.endDate = endDate
      if (region && region !== "Todos") {
        if (mapType === 'estado') params.estado = region
        if (mapType === 'bioma') params.bioma = region
      }

      let url = '';
      if (dataType === 'focos' && mapType === 'estado') url = '/focos-por-estado-pizza';
      else if (dataType === 'focos' && mapType === 'bioma') url = '/focos-por-bioma-pizza';
      else if (dataType === 'risco' && mapType === 'estado') url = '/risco-por-estado-pizza';
      else if (dataType === 'risco' && mapType === 'bioma') url = '/risco-por-bioma-pizza';
      else if (dataType === 'areas' && mapType === 'estado') url = '/areas-por-estado-pizza';
      else if (dataType === 'areas' && mapType === 'bioma') url = '/areas-por-bioma-pizza';

      if (!url) throw new Error('Combinação de tipo de dado e mapa não suportada!');

      const response = await api.get(url, { params })
      const data = response.data

      const labels = data.map((item: any) => item.label || item.estado || item.bioma)
      const values = data.map((item: any) => item.value ?? item.total_focos ?? item.risco_medio ?? item.total_queimadas)
      return { labels, values }
    } catch (error) {
      console.error('Erro ao buscar dados:', error)
      return { labels: [], values: [] }
    }
  }

  const handleApplyFilters = async () => {
    if (startDate && endDate && endDate < startDate) {
      alert('A data final não pode ser menor que a data inicial!');
      return;
    }
    setLoading(true)
    try {
      const { labels: fetchedLabels, values: fetchedValues } = await fetchData(dataType, mapType, region)
      console.log('Labels e valores para o gráfico:', fetchedLabels, fetchedValues)

      let percentageLabels = fetchedLabels
      let percentageValues = fetchedValues

      if (dataType === 'focos' || dataType === 'areas') {
        const porcentagem = transformarValoresEmPorcentagem(fetchedLabels, fetchedValues)
        percentageLabels = porcentagem.labels
        percentageValues = porcentagem.values
        isPercentage(true)
      } else {
        isPercentage(false)
      }


      let topLabels = percentageLabels;
      let topValues = percentageValues;
      if (percentageLabels.length > 10) {
        const top = top10LabelsAndValues(percentageLabels, percentageValues);
        topLabels = top.labels;
        topValues = top.values;
      }

      setLabels(percentageLabels || [])
      setData(percentageValues || [])
    } catch (error) {
    } finally {
      setLoading(false)
    }
  };


  const referencias = labels.length > 0 ? labels : (mapType === 'bioma' ? BIOMAS : ESTADOS);

  return (
    <section>
      <div className={styles.filterContainer}>
        <h2>Filtros</h2>
        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <p>Divisão Regional:</p>
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
                onChange={(e) => setDataType(e.target.value as 'focos' | 'risco' | 'areas')}
              />
              Focos de Calor
            </label>
            <label>
              <input
                type="radio"
                name="dataType"
                value="risco"
                checked={dataType === 'risco'}
                onChange={(e) => setDataType(e.target.value as 'focos' | 'risco' | 'areas')}
              />
              Risco de Fogo
            </label>
            <label>
              <input
                type="radio"
                name="dataType"
                value="areas"
                checked={dataType === 'areas'}
                onChange={(e) => setDataType(e.target.value as 'focos' | 'risco' | 'areas')}
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
              max={endDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className={styles.filterGroup}>
            <label htmlFor="endDate">Data Final:</label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              min={startDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <button className={styles.applyButton} onClick={handleApplyFilters}>
            Aplicar Filtros
          </button>
        </div>
      </div>

      <div className={styles.chartContainer}>
        <h3>{`Dados de ${dataType} por ${mapType}`}</h3>
        <div className={styles.chartWrapper}>
          {loading ? (
            <p>Carregando dados...</p>
          ) : (
            <BarChart
              labels={labels}
              data={data}
              title={`${dataType} por ${mapType}`}
              isPercentage={percentage}
            />
          )}
        </div>
        <p className={styles.chartLegend}>
          <strong>Legenda:</strong> Este gráfico representa a média dos dados selecionados ao longo dos meses.
        </p>
        <div className={styles.refLegend}>
          <strong>Referências exibidas:</strong>
          <ul>
            {referencias.map((item, idx) => (
              <li key={item}>
                <span
                  className={styles.refColor}
                  style={{
                    background:
                      idx < defaultColors.length
                        ? defaultColors[idx]
                        : defaultColors[idx % defaultColors.length]
                  }}
                ></span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        {!loading && labels && labels.length > 0 && data && data.length > 0 && (
          <div className={styles.dataLegend}>
            <strong>Dados exibidos:</strong>
            <ul>
              {labels.map((label, idx) => (
                <li key={label}>
                  <span style={{ fontWeight: 600 }}>{label}:</span> {data[idx]}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
};

export default Dados;