import React, { useCallback, useEffect, useState } from 'react'
import BarChart from '../components/BarChart'
import styles from '../Styles/Dados.module.css'
import { getServiceByFilters } from '../services/getDataByFiltersService'
import axios from 'axios';
import api from '../services/api';

const Dados: React.FC = () => {
  const [mapType, setMapType] = useState<'estado' | 'bioma'>('estado')
  const [dataType, setDataType] = useState<'focos' | 'risco' | 'areas'>('focos')
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [region, setRegion] = useState<string>('')
  const [chartLabels, setChartLabels] = useState<string[]>([])
  const [chartData, setChartData] = useState<number[]>([])
  const [labels, setLabels] = useState<string[]>([]);
  const [data, setData] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async (dataType: string, mapType: string) => {
    try {
      const response = await api.get(`/${dataType}-${mapType}`)
      const data = response.data

      console.log('Dados recebidos do backend:', data)

      const labels = data.map((item: any) => item.estado || item.bioma)
      const values = data.map((item: any) =>
        dataType === 'focos'
          ? item.total_focos
          : dataType === 'risco'
            ? item.risco_medio
            : item.total_precipitacao
      )

      console.log('Labels mapeados:', labels)
      console.log('Values mapeados:', values)

      return { labels, values }
    } catch (error) {
      console.error('Erro ao buscar dados:', error)
      return { labels: [], values: [] }
    }
  }

  useEffect(() => {
    const carregarDados = async () => {
      setLoading(true)
      const { labels, values } = await fetchData(dataType, mapType)
      setChartLabels(labels)
      setChartData(values)
      setLoading(false)
    }

    carregarDados()
  }, [dataType, mapType, region])

  const handleApplyFilters = async () => {
    setLoading(true)
    try {
      const { labels: fetchedLabels, values: fetchedValues } = await fetchData(dataType, mapType)

      console.log('Labels recebidos do backend:', fetchedLabels)
      console.log('Data recebidos do backend:', fetchedValues)

      setLabels(fetchedLabels || [])
      setData(fetchedValues || [])
    } catch (error) {
      console.error('Erro ao buscar dados:', error)
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    console.log('Labels atualizados no Dados.tsx:', labels);
    console.log('Data atualizados no Dados.tsx:', data);
  }, [labels, data]);

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
        <h3>{`Dados de ${dataType} por ${mapType}`}</h3>
        <div className={styles.chartWrapper}>
          {loading ? (
            <p>Carregando dados...</p>
          ) : (
            <BarChart labels={labels} data={data} title={`${dataType} por ${mapType}`} />
          )}
        </div>
        <p className={styles.chartLegend}>
          <strong>Legenda:</strong> Este gráfico representa a média dos dados selecionados ao longo dos meses.
        </p>
      </div>
    </section>
  );
};

export default Dados;