export default interface QueimadaInterface {
  type: 'Feature';
  properties: {
    bioma: string;
    data: string;
    [key: string]: any;
  };
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
}
/* 
interface BiomaFeature {
  type: 'Feature';
  properties: {
    Bioma: string;
  };
  geometry: {
    type: string;
    coordinates: any;
  };
} */