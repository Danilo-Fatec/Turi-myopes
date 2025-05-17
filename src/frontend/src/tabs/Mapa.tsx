import React, { useEffect, useRef, useState } from 'react';
import L, { Map } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styles from '../Styles/Mapa.module.css';
import MapaInterface from '../interfaces/mapaInterface';
import { ESTADOS_BRASIL, BIOMAS_BRASIL } from '../constants/mapFilters';
import { ESTADO_CENTERS, BIOMA_CENTERS } from '../constants/mapCenters';

const Mapa: React.FC<MapaInterface> = ({
  focosDeCalor = false,
  riscoDeFogo = false,
  areasQueimadas = false,
}) => {
  const mapRef = useRef<Map | null>(null);
  const [mapType, setMapType] = useState<'estado' | 'bioma'>('estado');
  const [dataType, setDataType] = useState<'focos' | 'riscos' | 'queimadas'>('focos');
  const [estado, setEstado] = useState<string>('');
  const [bioma, setBioma] = useState<string>('');
  const [cidade, setCidade] = useState<string>('');
  const [isFocosDeCalor, setIsFocosDeCalor] = useState<boolean>(focosDeCalor);
  const [isRiscoDeFogo, setIsRiscoDeFogo] = useState<boolean>(riscoDeFogo);
  const [isAreasQueimadas, setIsAreasQueimadas] = useState<boolean>(areasQueimadas);

  useEffect(() => {
    if (mapRef.current === null) {
      const brazilBounds: L.LatLngBoundsExpression = [
        [-33.75, -73.99],
        [5.27, -34.79],
      ];
      const map = L.map('mapid', {
        center: [-14.235, -51.9253],
        zoom: 4,
        maxBounds: brazilBounds,
        maxBoundsViscosity: 1.0,
      });
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data © OpenStreetMap contributors',
      }).addTo(map);
      mapRef.current = map;
    }
  }, []);

  const handleFilterApply = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (mapRef.current) {
      if (mapType === 'estado' && estado && ESTADO_CENTERS[estado]) {
        mapRef.current.setView(ESTADO_CENTERS[estado], 6); 
      } else if (mapType === 'bioma' && bioma && BIOMA_CENTERS[bioma]) {
        mapRef.current.setView(BIOMA_CENTERS[bioma], 5); 
      }
    }

    console.log('Filtros aplicados:', { mapType, dataType, estado, cidade, bioma });
  };

  return (
    <section className={styles.container}>
      <form className={styles.filterPanel} onSubmit={handleFilterApply}>
        <h2>Filtros</h2>
        <div className={styles.radioGroup}>
          <p>Tipo de mapa:</p>
          <label>
            <input
              type="radio"
              name="mapType"
              value="estado"
              checked={mapType === 'estado'}
              onChange={() => setMapType('estado')}
            />
            Estados
          </label>
          <label>
            <input
              type="radio"
              name="mapType"
              value="bioma"
              checked={mapType === 'bioma'}
              onChange={() => setMapType('bioma')}
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
              onChange={() => setDataType('focos')}
            />
            Focos de Calor
          </label>
          <label>
            <input
              type="radio"
              name="dataType"
              value="riscos"
              checked={isRiscoDeFogo}
              onChange={() => setDataType('riscos')}
            />
            Riscos de Fogo
          </label>
          <label>
            <input
              type="radio"
              name="dataType"
              value="queimadas"
              checked={isAreasQueimadas}
              onChange={() => setDataType('queimadas')}
            />
            Áreas Queimadas
          </label>
        </div>

        {mapType === 'estado' && (
          <div className={styles.selectGroup}>
            <select value={estado} onChange={(e) => setEstado(e.target.value)}>
              <option value="">Estado</option>
              {ESTADOS_BRASIL.map((uf) => (
                <option key={uf} value={uf}>
                  {uf}
                </option>
              ))}
            </select>
            <select value={cidade} onChange={(e) => setCidade(e.target.value)}>
              <option value="">Cidade</option>
              {/* Opções de cidade conforme estado selecionado */}
            </select>
          </div>
        )}

        {mapType === 'bioma' && (
          <div className={styles.selectGroup}>
            <select value={bioma} onChange={(e) => setBioma(e.target.value)}>
              <option value="">Bioma</option>
              {BIOMAS_BRASIL.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
        )}

        <button className={styles.applyButton} type="submit">
          Ativar Filtros
        </button>
      </form>

      <div id="mapid" className={styles.map}></div>
    </section>
  );
};

export default Mapa;