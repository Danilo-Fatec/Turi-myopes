import React, { useEffect, useRef, useState } from 'react';
import L, { Map } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styles from '../Styles/Mapa.module.css';
import MapaInterface from '../interfaces/mapaInterface';
import { ESTADOS_BRASIL } from '../constants/mapFilters';
import { ESTADO_CENTERS } from '../constants/mapCenters';

const BIOMAS_BRASIL = [
  'Amazônia',
  'Cerrado',
  'Caatinga',
  'Pampa',
  'Pantanal',
  'Mata Atlântica'
];

const BIOMA_FILES = [
  { name: 'Amazônia', file: '/amazonia.geojson', color: '#388e3c' },
  { name: 'Cerrado', file: '/cerrado.geojson', color: '#fbc02d' },
  { name: 'Caatinga', file: '/caatinga.geojson', color: '#e65100' },
  { name: 'Pampa', file: '/pampa.geojson', color: '#0288d1' },
  { name: 'Pantanal', file: '/pantanal.geojson', color: '#8d6e63' },
  { name: 'Mata Atlântica', file: '/mata_atlantica.geojson', color: '#43a047' }
];

// Para legenda e cor dos marcadores por bioma
const BIOMA_COLORS: Record<string, string> = {
  'Amazônia': '#388e3c',
  'Cerrado': '#fbc02d',
  'Caatinga': '#e65100',
  'Pampa': '#0288d1',
  'Pantanal': '#8d6e63',
  'Mata Atlântica': '#43a047'
};

const Mapa: React.FC<MapaInterface> = ({
  focosDeCalor = false,
  riscoDeFogo = false,
  areasQueimadas = false,
}) => {
  const mapRef = useRef<Map | null>(null);

  const brasilLayerRef = useRef<L.GeoJSON | null>(null);
  const estadoLayerRef = useRef<L.GeoJSON | null>(null);
  const biomasLayerRefs = useRef<{ [key: string]: L.GeoJSON | null }>({});
  const leafletMarkersRef = useRef<L.Marker[]>([]);

  const [geojsonEstados, setGeojsonEstados] = useState<any>(null);
  const [biomasGeojsons, setBiomasGeojsons] = useState<{ [bioma: string]: any }>({});

  const [mapType, setMapType] = useState<'estado' | 'bioma'>('estado');
  const [dataType, setDataType] = useState<'focos' | 'riscos' | 'queimadas'>('focos');
  const [estado, setEstado] = useState<string>('');
  const [estadoFiltrado, setEstadoFiltrado] = useState<string>('');
  const [bioma, setBioma] = useState<string>('');
  const [biomaFiltrado, setBiomaFiltrado] = useState<string>('');
  const [isFocosDeCalor, setIsFocosDeCalor] = useState<boolean>(focosDeCalor);
  const [isRiscoDeFogo, setIsRiscoDeFogo] = useState<boolean>(riscoDeFogo);
  const [isAreasQueimadas, setIsAreasQueimadas] = useState<boolean>(areasQueimadas);

  const [markers, setMarkers] = useState<{ geocode: [number, number]; popUp: string }[]>([]);

  useEffect(() => {
    fetch('/brazil-states.geojson')
      .then(res => res.json())
      .then(data => setGeojsonEstados(data));

    BIOMA_FILES.forEach(({ name, file }) => {
      fetch(file)
        .then(res => res.json())
        .then(data => {
          setBiomasGeojsons(prev => ({ ...prev, [name]: data }));
        });
    });
  }, []);

  // Estados layer
  useEffect(() => {
    if (!mapRef.current || !geojsonEstados) return;

    if (brasilLayerRef.current) {
      brasilLayerRef.current.remove();
      brasilLayerRef.current = null;
    }
    if (estadoLayerRef.current) {
      estadoLayerRef.current.remove();
      estadoLayerRef.current = null;
    }

    if (mapType !== 'estado') return;

    const brasilLayer = L.geoJSON(geojsonEstados, {
      style: {
        color: '#000',
        weight: 1.8,
        fillColor: 'transparent',
        fillOpacity: 0,
        opacity: 1,
      },
      interactive: false
    });
    brasilLayer.addTo(mapRef.current);
    brasilLayerRef.current = brasilLayer;

    if (estadoFiltrado) {
      const estadoLayer = L.geoJSON(geojsonEstados, {
        filter: feature => {
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
        style: {
          color: '#1976d2',
          weight: 3,
          fillColor: '#bbdefb',
          fillOpacity: 0.18,
          opacity: 0.9,
        },
        onEachFeature: (feature, layer) => {
          const props = feature?.properties as any;
          if (props && props.name) {
            layer.bindPopup(props.name);
          }
        }
      });
      estadoLayer.addTo(mapRef.current);
      estadoLayerRef.current = estadoLayer;
    }
  }, [geojsonEstados, mapType, estadoFiltrado]);

  // Biomas layer (um ou todos)
  useEffect(() => {
    if (!mapRef.current) return;

    Object.values(biomasLayerRefs.current).forEach(layer => {
      if (layer) {
        layer.remove();
      }
    });
    biomasLayerRefs.current = {};

    if (mapType !== 'bioma') return;

    BIOMA_FILES.forEach(({ name, color }) => {
      const geojson = biomasGeojsons[name];
      if (!geojson) return;

      if (biomaFiltrado && biomaFiltrado !== name) return;

      const layer = L.geoJSON(geojson, {
        style: {
          color,
          weight: 2.5,
          fillOpacity: 0.15,
          opacity: 0.9,
        },
        onEachFeature: (feature, lyr) => {
          lyr.bindPopup(name);
        },
      });
      layer.addTo(mapRef.current!);
      biomasLayerRefs.current[name] = layer;
    });

    if (
      mapType === 'bioma' &&
      biomaFiltrado &&
      biomasLayerRefs.current[biomaFiltrado]
    ) {
      const layer = biomasLayerRefs.current[biomaFiltrado];
      const bounds = layer!.getBounds();
      if (bounds.isValid()) {
        mapRef.current!.fitBounds(bounds, { maxZoom: 6 });
      }
    }
  }, [biomasGeojsons, mapType, biomaFiltrado]);

  // Inicializa o mapa
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

  // --- Marcadores ---
  const defaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  useEffect(() => {
    if (!mapRef.current) return;

    leafletMarkersRef.current.forEach(marker => marker.remove());
    leafletMarkersRef.current = [];

    markers.forEach(({ geocode, popUp }) => {
      const marker = L.marker(geocode, { icon: defaultIcon }).addTo(mapRef.current!)
      if (popUp) marker.bindPopup(popUp)
      leafletMarkersRef.current.push(marker)
    })
  }, [markers]);

  // --- Backend fetch dos pontos ---
  async function fetchPontosPorData(data: string) {
    const response = await fetch(`http://localhost:3000/dados-dia?data=${data}`)
    return await response.json()
  }

  // --- Filtro dos pontos ---
  function filtrarPontos(
    pontos: any[],
    { estado, bioma, focosDeCalor, riscoDeFogo, areasQueimadas, mapType }: {
      estado: string,
      bioma: string,
      focosDeCalor: boolean,
      riscoDeFogo: boolean,
      areasQueimadas: boolean,
      mapType: 'estado' | 'bioma'
    }
  ) {
    return pontos.filter((p: any) => {
      let ok = true;
      if (mapType === 'estado' && estado) ok = ok && String(p.estado).toUpperCase() === String(estado).toUpperCase()
      if (mapType === 'bioma' && bioma) ok = ok && p.bioma === bioma;
      if (focosDeCalor) ok = ok && Number(p.frp) > 0;
      if (riscoDeFogo) ok = ok && Number(p.risco_fogo) > 0;
      if (areasQueimadas) ok = ok && Number(p.precipitacao) > 0;
      return ok;
    });
  }

  // --- Handler do filtro ---
  const handleFilterApply = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    setEstadoFiltrado(mapType === 'estado' ? estado : '');
    setBiomaFiltrado(mapType === 'bioma' ? bioma : '');

    // Exemplo de data fixa, ajuste para seu caso!
    const dataSelecionada = "2025-02-14"
    const todosPontos = await fetchPontosPorData(dataSelecionada)

    const pontosFiltrados = filtrarPontos(todosPontos, {
      estado,
      bioma,
      focosDeCalor: dataType === 'focos',
      riscoDeFogo: dataType === 'riscos',
      areasQueimadas: dataType === 'queimadas',
      mapType
    });

    const markersParaMapa = pontosFiltrados.map((item: any) => ({
      geocode: [Number(item.lat), Number(item.lon)] as [number, number],
      popUp: `${item.municipio || ''} - ${item.estado || ''} (${item.data_hora_gmt})`
    }));
    setMarkers(markersParaMapa);

    if (mapRef.current && mapType === 'estado' && estado && ESTADO_CENTERS[estado]) {
      mapRef.current.setView(ESTADO_CENTERS[estado], 7);
    }
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
              checked={dataType === 'focos'}
              onChange={() => setDataType('focos')}
            />
            Focos de Calor
          </label>
          <label>
            <input
              type="radio"
              name="dataType"
              value="riscos"
              checked={dataType === 'riscos'}
              onChange={() => setDataType('riscos')}
            />
            Riscos de Fogo
          </label>
          <label>
            <input
              type="radio"
              name="dataType"
              value="queimadas"
              checked={dataType === 'queimadas'}
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
          </div>
        )}

        {mapType === 'bioma' && (
          <div className={styles.selectGroup}>
            <select value={bioma} onChange={e => setBioma(e.target.value)}>
              <option value="">Todos</option>
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

        {mapType === 'bioma' && (
          <div style={{ marginTop: "1rem", display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
            {BIOMA_FILES.map(({ name, color }) => (
              <div key={name} style={{ display: "flex", alignItems: "center", minWidth: 140 }}>
                <span style={{
                  display: "inline-block",
                  width: 20,
                  height: 20,
                  borderRadius: 4,
                  marginRight: 8,
                  background: color,
                  border: "1.5px solid #333"
                }} />
                <span style={{ fontSize: 14 }}>{name}</span>
              </div>
            ))}
          </div>
        )}
      </form>

      <div id="mapid" className={styles.map}></div>
    </section>
  );
};

export default Mapa;