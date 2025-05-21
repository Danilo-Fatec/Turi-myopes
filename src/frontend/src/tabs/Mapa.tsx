import React, { useEffect, useRef, useState } from 'react';
import L, { Map } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styles from '../Styles/Mapa.module.css';
import MapaInterface from '../interfaces/mapaInterface';
import { ESTADOS_BRASIL, BIOMAS_BRASIL } from '../constants/mapFilters';
import { ESTADO_CENTERS, BIOMA_CENTERS } from '../constants/mapCenters';
import BIOME_FAUNA_COLORS from '../constants/biomeColors';

const Mapa: React.FC<MapaInterface> = ({
  focosDeCalor = false,
  riscoDeFogo = false,
  areasQueimadas = false,
}) => {
  const mapRef = useRef<Map | null>(null);

  // Layers refs
  const brasilLayerRef = useRef<L.GeoJSON | null>(null);
  const estadoLayerRef = useRef<L.GeoJSON | null>(null);
  const biomasLayerRef = useRef<L.GeoJSON | null>(null);
  const biomaLayerRef = useRef<L.GeoJSON | null>(null);

  // GeoJSON states
  const [geojsonEstados, setGeojsonEstados] = useState<any>(null);
  const [geojsonBiomas, setGeojsonBiomas] = useState<any>(null);
  const [geojsonBiomasZoom, setGeojsonBiomasZoom] = useState<any>(null); // shape simplificado para zoom

  // Filtros e controles
  const [mapType, setMapType] = useState<'estado' | 'bioma'>('estado');
  const [dataType, setDataType] = useState<'focos' | 'riscos' | 'queimadas'>('focos');
  const [estado, setEstado] = useState<string>('');
  const [estadoFiltrado, setEstadoFiltrado] = useState<string>('');
  const [bioma, setBioma] = useState<string>('');
  const [biomaFiltrado, setBiomaFiltrado] = useState<string>('');
  const [cidade, setCidade] = useState<string>('');
  const [isFocosDeCalor, setIsFocosDeCalor] = useState<boolean>(focosDeCalor);
  const [isRiscoDeFogo, setIsRiscoDeFogo] = useState<boolean>(riscoDeFogo);
  const [isAreasQueimadas, setIsAreasQueimadas] = useState<boolean>(areasQueimadas);

  // Função de normalização para comparar strings de biomas de forma robusta
  const normalize = (str: string) =>
    (str || "").normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

  // Inicialização do mapa
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

  // Carrega os GeoJSONs
  useEffect(() => {
    fetch('/brazil-states.geojson')
      .then(res => res.json())
      .then(data => setGeojsonEstados(data));
    fetch('/brazil-biomes.geojson')
      .then(res => res.json())
      .then(data => setGeojsonBiomas(data));
    fetch('/biomas_padronizado.geojson') // shape simplificado para zoom
      .then(res => res.json())
      .then(data => setGeojsonBiomasZoom(data));
  }, []);

  // Camada permanente: contorno dos estados
  useEffect(() => {
    if (!mapRef.current || !geojsonEstados) return;

    if (brasilLayerRef.current) {
      brasilLayerRef.current.remove();
      brasilLayerRef.current = null;
    }

    // Só adiciona camada de estados se modo "estado" estiver ativo
    if (mapType !== 'estado') return;

    const brasilLayer = L.geoJSON(geojsonEstados, {
      style: {
        color: '#bdbdbd',
        weight: 1.5,
        fillColor: 'transparent',
        fillOpacity: 0,
        opacity: 0.8,
      },
      interactive: false
    });
    brasilLayer.addTo(mapRef.current);
    brasilLayerRef.current = brasilLayer;

    // Ajusta o mapa para os estados
    if (brasilLayer.getLayers().length > 0 && brasilLayer.getBounds().isValid()) {
      mapRef.current.fitBounds(brasilLayer.getBounds());
    }
  }, [geojsonEstados, mapType]);

  // Camada dos biomas (permanente ou filtrada, conforme filtro)
  useEffect(() => {
    if (!mapRef.current || !geojsonBiomas) return;

    // Remove camadas antigas
    if (biomasLayerRef.current) {
      biomasLayerRef.current.remove();
      biomasLayerRef.current = null;
    }
    if (biomaLayerRef.current) {
      biomaLayerRef.current.remove();
      biomaLayerRef.current = null;
    }

    // Sempre mostra todos os shapes detalhados dos biomas
    const biomeStyle = (feature?: GeoJSON.Feature) => {
      const props = feature?.properties as any;
      const biomeName = props?.bioma || props?.name || props?.NOME || "";
      return {
        color: BIOME_FAUNA_COLORS[biomeName] || '#1976d2',
        weight: 2,
        fillColor: 'transparent',
        fillOpacity: 0,
        opacity: 0.8,
      };
    };

    const biomasLayer = L.geoJSON(geojsonBiomas, {
      style: biomeStyle,
      interactive: false
    });
    biomasLayer.addTo(mapRef.current);
    biomasLayerRef.current = biomasLayer;
  }, [geojsonBiomas, mapType]);

  // Camada do estado filtrado
  useEffect(() => {
    if (!mapRef.current || !geojsonEstados) return;
    if (estadoLayerRef.current) {
      estadoLayerRef.current.remove();
      estadoLayerRef.current = null;
    }
    if (!estadoFiltrado || mapType !== 'estado') return;

    const estadoLayer = L.geoJSON(geojsonEstados, {
      style: (feature?: GeoJSON.Feature) => {
        const props = feature?.properties as any;
        const isSelected =
          estadoFiltrado &&
          props &&
          (
            props.name === estadoFiltrado ||
            props.sigla === estadoFiltrado ||
            props.NOME === estadoFiltrado ||
            props.UF === estadoFiltrado
          );
        return {
          color: isSelected ? '#1976d2' : '#bbb',
          weight: isSelected ? 3 : 1,
          fillColor: isSelected ? '#bbdefb' : 'transparent',
          fillOpacity: isSelected ? 0.18 : 0,
          opacity: isSelected ? 0.9 : 0.5,
          dashArray: isSelected ? '3,8' : '2,10',
        };
      },
      filter: feature => {
        if (!estadoFiltrado) return false;
        const props = feature?.properties as any;
        return (
          props &&
          (
            props.name === estadoFiltrado ||
            props.sigla === estadoFiltrado ||
            props.NOME === estadoFiltrado ||
            props.UF === estadoFiltrado
          )
        );
      },
      onEachFeature: (feature, layer) => {
        const props = feature?.properties as any;
        if (props && props.name) {
          layer.bindPopup(props.name);
        }
      },
    });

    estadoLayer.addTo(mapRef.current);
    estadoLayerRef.current = estadoLayer;

    // Ajusta o mapa para o estado filtrado
    if (estadoLayer.getLayers().length > 0 && estadoLayer.getBounds().isValid()) {
      mapRef.current.fitBounds(estadoLayer.getBounds());
    }
  }, [geojsonEstados, estadoFiltrado, mapType]);

  // Zoom no bioma simplificado apenas ao filtrar
  useEffect(() => {
    if (
      !mapRef.current ||
      !geojsonBiomasZoom ||
      mapType !== 'bioma' ||
      !biomaFiltrado
    ) return;

    // Busca o polígono simplificado do bioma filtrado
    const featureFiltrada = geojsonBiomasZoom.features.find((feature: any) => {
      const props = feature.properties || {};
      const biomeName = props.bioma || props.name || props.NOME || "";
      return normalize(biomeName) === normalize(biomaFiltrado);
    });
    if (featureFiltrada) {
      const tempLayer = L.geoJSON(featureFiltrada);
      if (tempLayer.getBounds().isValid()) {
        mapRef.current.fitBounds(tempLayer.getBounds(), { maxZoom: 8 });
      }
      tempLayer.remove();
    }
  }, [geojsonBiomasZoom, biomaFiltrado, mapType]);

  const handleFilterApply = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    setEstadoFiltrado(mapType === 'estado' ? estado : '');
    setBiomaFiltrado(mapType === 'bioma' ? bioma : '');
    // O ajuste do zoom agora é feito pelos hooks de efeito com fitBounds.
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