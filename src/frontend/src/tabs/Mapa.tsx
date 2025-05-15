import React, { useEffect, useRef, useState } from 'react';
import L, { Map } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styles from '../Styles/Mapa.module.css';
import MapaInterface from '../interfaces/mapaInterface';

const Mapa: React.FC<MapaInterface> = ( {focosDeCalor = false, riscoDeFogo = false, areasQueimadas = false} ) => {
  const mapRef = useRef<Map | null>(null);
  const [mapType, setMapType] = useState<'estado' | 'bioma'>('estado');
  const [dataType, setDataType] = useState<'focos' | 'riscos' | 'queimadas'>('focos');
  const [estado, setEstado] = useState<string>('');
  const [cidade, setCidade] = useState<string>('');
  const [isFocosDeCalor, setIsFocosDeCalor] = useState<boolean>(focosDeCalor)
  const [isRiscoDeFogo, setIsRiscoDeFogo] = useState<boolean>(riscoDeFogo)
  const [isAreasQueimadas, setIsAreasQueimadas] = useState<boolean>(areasQueimadas)

  useEffect(() => {
    if (mapRef.current === null) {
      const map = L.map('mapid', {
        center: [-14.235, -51.9253], 
        zoom: 4, 
      });
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data © OpenStreetMap contributors',
      }).addTo(map);
      mapRef.current = map;
    }
  }, []);

  const isTrue = () => {
    if (focosDeCalor) {
      
    }
  }

  const handleFilterApply = () => {
    console.log('Filtros aplicados:', { mapType, dataType, estado, cidade });
    
  };

  const toggleOption = (option: 'focosDeCalor' | 'riscoDeFogo' | 'areasQueimadas') => {
    switch (option){
      case 'focosDeCalor':
        setIsFocosDeCalor(!isFocosDeCalor)
        break
      case 'riscoDeFogo':
        setIsRiscoDeFogo(!isRiscoDeFogo)
        break
      case 'areasQueimadas':
        setIsAreasQueimadas(!isAreasQueimadas)
        break
      default:
        console.log("erro de opção toggleOption")
        break
    }
  }

  return (
    <section className={styles.container}>
      {}
      <div className={styles.filterPanel}>
        <h2>Filtros</h2>
        <div className={styles.radioGroup}>
          <p>Tipo de mapa:</p>
          <label>
            <input
              type="radio"
              name="mapType"
              value="estado"
              checked={mapType === 'estado'}
              onChange={(e) => setMapType(e.target.value as 'estado' | 'bioma')}
            />
            Estados
          </label>
          <label>
            <input
              type="radio"
              name="mapType"
              value="bioma"
              checked={mapType === 'bioma'}
              onChange={(e) => setMapType(e.target.value as 'estado' | 'bioma')}
            />
            Biomas
          </label>
        </div>

        <div className={styles.radioGroup}>
          <p>Tipo de dados:</p>
          <label>
            <input
              type="radio"
              name="dataType"
              value="focos"
              checked={isFocosDeCalor}
              onChange={(e) => setDataType(e.target.value as 'focos' | 'riscos' | 'queimadas')}
            />
            Focos de Calor
          </label>
          <label>
            <input
              type="radio"
              name="dataType"
              value="riscos"
              checked={isRiscoDeFogo}
              onChange={(e) => setDataType(e.target.value as 'focos' | 'riscos' | 'queimadas')}
            />
            Riscos de Fogo
          </label>
          <label>
            <input
              type="radio"
              name="dataType"
              value="queimadas"
              checked={isAreasQueimadas}
              onChange={(e) => setDataType(e.target.value as 'focos' | 'riscos' | 'queimadas')}
            />
            Áreas Queimadas
          </label>
        </div>

        {mapType === 'estado' && (
          <div className={styles.selectGroup}>
            <select value={estado} onChange={(e) => setEstado(e.target.value)}>
              <option value="">Estado</option>
              <option value="SP">São Paulo</option>
              <option value="MG">Minas Gerais</option>
              <option value="PA">Pará</option>
            </select>
            <select value={cidade} onChange={(e) => setCidade(e.target.value)}>
              <option value="">Cidade</option>
              <option value="Cidade 1">Cidade 1</option>
              <option value="Cidade 2">Cidade 2</option>
              <option value="Cidade 3">Cidade 3</option>
            </select>
          </div>
        )}

        <button className={styles.applyButton} onClick={handleFilterApply}>
          Ativar Filtros
        </button>
      </div>

      {}
      <div id="mapid" className={styles.map}></div>
    </section>
  );
};

export default Mapa;