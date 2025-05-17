import { LatLngExpression } from "leaflet";

// Cada bioma deve ter seu polígono aproximado. Exemplo com coordenadas fictícias e simplificadas:
export const BIOMAS_GEOJSON: Record<string, LatLngExpression[][]> = {
  "Amazônia": [
    [ // Array de pontos do polígono
      [-7.0, -73.0], [-2.0, -58.0], [-4.0, -51.0], [-9.0, -51.0], [-11.0, -63.0], [-7.0, -73.0]
    ]
  ],
  "Caatinga": [
    [
      [-3.5, -42.0], [-8.5, -37.0], [-13.0, -39.0], [-15.0, -44.0], [-9.0, -46.0], [-3.5, -42.0]
    ]
  ],
  "Cerrado": [
    [
      [-8.0, -47.0], [-12.0, -55.0], [-18.0, -52.0], [-15.0, -44.0], [-8.0, -47.0]
    ]
  ],
  "Mata Atlântica": [
    [
      [-5.0, -35.0], [-20.0, -39.0], [-27.0, -48.0], [-23.0, -46.0], [-5.0, -35.0]
    ]
  ],
  "Pampa": [
    [
      [-29.0, -57.0], [-31.0, -53.0], [-32.0, -55.0], [-29.0, -57.0]
    ]
  ],
  "Pantanal": [
    [
      [-16.0, -57.0], [-19.0, -56.0], [-20.0, -58.0], [-17.0, -59.0], [-16.0, -57.0]
    ]
  ],
};