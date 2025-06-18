import pool from '../db';

export async function getAreasQueimadasPontos(
  startDate?: string,
  endDate?: string,
  estado?: string,
  bioma?: string
): Promise<any[]> {
  let where = '';
  const params: any[] = [];
  if (startDate) { params.push(startDate); where += ` AND data_hora >= $${params.length}`; }
  if (endDate)   { params.push(endDate);   where += ` AND data_hora <= $${params.length}`; }
  if (estado)    { params.push(estado);    where += ` AND UPPER(estado) = UPPER($${params.length})`; }
  if (bioma)     { params.push(bioma);     where += ` AND bioma = $${params.length}`; }
  const query = `
    SELECT latitude as lat, longitude as lon, municipio, estado, bioma, data_hora as data
    FROM area_queimada
    WHERE 1=1 ${where}
    LIMIT 10000
  `;
  try {
    const result = await pool.query(query, params);
    return result.rows;
  } catch (error) {
    console.error('Erro ao buscar áreas queimadas (pontos):', error);
    return [];
  }
}