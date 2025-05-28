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

  const brasilLayerRef = useRef<L.GeoJSON | null>(null);
  const estadoLayerRef = useRef<L.GeoJSON | null>(null);
  const biomasLayerRef = useRef<L.GeoJSON | null>(null);
  const biomaLayerRef = useRef<L.GeoJSON | null>(null);
  const leafletMarkersRef = useRef<L.Marker[]>([]);

  const [geojsonEstados, setGeojsonEstados] = useState<any>(null);
  const [geojsonBiomasLayer, setGeojsonBiomasLayer] = useState<any>(null);
  const [geojsonBiomaFiltro, setGeojsonBiomaFiltro] = useState<any>(null);

  const [markers, setMarkers] = useState<{ geocode: [number, number]; popUp: string }[]>([])
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

  const normalize = (str: string) =>
    (str || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

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

  useEffect(() => {
    fetch('/brazil-states.geojson')
      .then(res => res.json())
      .then(data => setGeojsonEstados(data));
    fetch('/brazil-biomes.geojson')
      .then(res => res.json())
      .then(data => setGeojsonBiomasLayer(data));
    fetch('/bioma.geojson')
      .then(res => res.json())
      .then(data => setGeojsonBiomaFiltro(data));
  }, []);

  useEffect(() => {
    if (!mapRef.current || !geojsonEstados) return;

    if (brasilLayerRef.current) {
      brasilLayerRef.current.remove();
      brasilLayerRef.current = null;
    }

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
  }, [geojsonEstados, mapType]);

  useEffect(() => {
    if (!mapRef.current || !geojsonBiomasLayer) return;

    if (biomasLayerRef.current) {
      biomasLayerRef.current.remove();
      biomasLayerRef.current = null;
    }

    if (mapType !== 'bioma') return;

    const biomasLayer = L.geoJSON(geojsonBiomasLayer, {
      style: {
        color: '#43a047',
        weight: 2,
        fillColor: 'transparent',
        fillOpacity: 0,
        opacity: 0.7,
      },
      interactive: false
    });
    biomasLayer.addTo(mapRef.current);
    biomasLayerRef.current = biomasLayer;
  }, [geojsonBiomasLayer, mapType]);

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
  }, [geojsonEstados, estadoFiltrado, mapType]);

  useEffect(() => {
    if (!mapRef.current || !geojsonBiomaFiltro) return;
    if (biomaLayerRef.current) {
      biomaLayerRef.current.remove();
      biomaLayerRef.current = null;
    }
    if (!biomaFiltrado || mapType !== 'bioma') return;

    const featuresFiltradas = geojsonBiomaFiltro.features.filter((feature: any) => {
      const props = feature.properties || {};
      const biomeName = props.bioma || props.name || props.NOME || "";
      return normalize(biomeName) === normalize(biomaFiltrado);
    });
    if (!featuresFiltradas.length) return;

    const geojsonFiltrado = {
      ...geojsonBiomaFiltro,
      features: featuresFiltradas,
    };

    const biomaLayer = L.geoJSON(geojsonFiltrado, {
      style: {
        color: '#1b5e20',
        weight: 3.5,
        fillColor: '#a5d6a7',
        fillOpacity: 0.18,
        opacity: 0.95,
        dashArray: '2,7',
      },
      onEachFeature: (feature, layer) => {
        const props = feature?.properties as any;
        if (props && (props.bioma || props.name)) {
          layer.bindPopup(props.bioma || props.name);
        }
      },
    });

    biomaLayer.addTo(mapRef.current);
    biomaLayerRef.current = biomaLayer;

    if (biomaLayer.getLayers().length > 0 && biomaLayer.getBounds().isValid()) {
      const bounds = biomaLayer.getBounds();
      mapRef.current.fitBounds(bounds);
      const center = bounds.getCenter();
      mapRef.current.setView(center, 15);
    }
  }, [geojsonBiomaFiltro, biomaFiltrado, mapType]);

  async function fetchPontosPorData(data: string) {
    const response = await fetch(`http://localhost:3000/dados-dia?data=${data}`)
    console.log(response)
    return await response.json()
  }

  // icone do marcador
  const defaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  })

  // useEffet para mudar marcadores para novos e/ou remover os antigos
  useEffect(() => {
    if (!mapRef.current) return;

    // para remover marcadores antigos
    leafletMarkersRef.current.forEach(marker => marker.remove());
    leafletMarkersRef.current = [];

    // para adicionar novos marcadores
    markers.forEach(({ geocode, popUp }) => {
      const marker = L.marker(geocode, { icon: defaultIcon }).addTo(mapRef.current!)
      if (popUp) marker.bindPopup(popUp)
      leafletMarkersRef.current.push(marker)
    })
    console.log('Markers atualizados:', markers)
  }, [markers])

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
    console.log('Filtros:', { estado, bioma, focosDeCalor, riscoDeFogo, areasQueimadas, mapType });
    console.log('Primeiro ponto:', pontos[0]);
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

  const handleFilterApply = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    setEstadoFiltrado(mapType === 'estado' ? estado : '');
    setBiomaFiltrado(mapType === 'bioma' ? bioma : '');

    const dataSelecionada = "2025-02-14"
    const todosPontos = await fetchPontosPorData(dataSelecionada)
    console.log('Pontos recebidos do backend:', todosPontos)

    const pontosFiltrados = filtrarPontos(todosPontos, {
      estado,
      bioma,
      focosDeCalor: dataType === 'focos',
      riscoDeFogo: dataType === 'riscos',
      areasQueimadas: dataType === 'queimadas',
      mapType
    });
    console.log('Pontos após filtro:', pontosFiltrados)

    const markersParaMapa = pontosFiltrados.map((item: any) => ({
      geocode: [Number(item.lat), Number(item.lon)] as [number, number],
      popUp: `${item.municipio || ''} - ${item.estado || ''} (${item.data_hora_gmt})`
    }));
    console.log('Markers para o mapa:', markersParaMapa);
    setMarkers(markersParaMapa)

    if (mapRef.current) {
      if (mapType === 'estado' && estado && ESTADO_CENTERS[estado]) {
        mapRef.current.setView(ESTADO_CENTERS[estado], 7);
      } else if (mapType === 'bioma' && bioma && BIOMA_CENTERS[bioma]) {
        mapRef.current.setView(BIOMA_CENTERS[bioma], 5);
      }
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
            <select value={cidade} onChange={(e) => setCidade(e.target.value)}>
              <option value="">Cidade</option>
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