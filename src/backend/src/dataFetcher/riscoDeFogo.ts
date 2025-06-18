import pool from '../db'

export async function getRiscoDeFogoPontos(
  startDate?: string,
  endDate?: string,
  estado?: string,
  bioma?: string
): Promise<any[]> {
  const selects = [
    `SELECT lat as lat, lon as lon, municipio, estado, bioma, risco_fogo, data_hora_gmt as data FROM dados_satelite_2025`,
    `SELECT latitude as lat, longitude as lon, municipio, estado, bioma, risco_fogo, data_pas as data FROM dados_satelite_2024`,
    `SELECT latitude as lat, longitude as lon, municipio, estado, bioma, risco_fogo, data_pas as data FROM dados_satelite_2023`
  ];
  let wheres: string[] = [];
  const params: any[] = [];
  if (startDate) { params.push(startDate); wheres.push(`data >= $${params.length}`); }
  if (endDate)   { params.push(endDate);   wheres.push(`data <= $${params.length}`); }
  if (estado)    { params.push(estado);    wheres.push(`UPPER(estado) = UPPER($${params.length})`); }
  if (bioma)     { params.push(bioma);     wheres.push(`bioma = $${params.length}`); }
  const whereClause = wheres.length ? `WHERE ${wheres.join(' AND ')}` : '';
  const query = `
    SELECT * FROM (
      ${selects.join(' UNION ALL ')}
    ) AS riscos
    ${whereClause}
    LIMIT 10000
  `;
  try {
    const result = await pool.query(query, params);
    return result.rows;
  } catch (error) {
    console.error('Erro ao buscar risco de fogo (pontos):', error);
    return [];
  }
}