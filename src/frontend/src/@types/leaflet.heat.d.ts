import 'leaflet';

declare module 'leaflet' {
  namespace heatLayer {
    interface HeatLayerOptions {
      minOpacity?: number;
      maxZoom?: number;
      radius?: number;
      blur?: number;
      max?: number;
      gradient?: { [key: number]: string };
    }
  }

  function heatLayer(
    latlngs: [number, number, number][],
    options?: heatLayer.HeatLayerOptions
  ): Layer;
}