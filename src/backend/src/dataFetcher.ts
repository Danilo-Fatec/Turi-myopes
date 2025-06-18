import pool from './db';

// Focos de Calor (unindo todas as tabelas de satélite)
async function getFocosDeCalorPorGrupo(
  groupBy: 'estado' | 'bioma',
  startDate?: string,
  endDate?: string
): Promise<any[]> {
  try {
    let where = '';
    const params: any[] = [];
    if (startDate) {
      params.push(startDate);
      where += ` AND data >= $${params.length}`;
    }
    if (endDate) {
      params.push(endDate);
      where += ` AND data <= $${params.length}`;
    }
    const query = `
      SELECT ${groupBy}, COUNT(*) AS total_focos FROM (
        SELECT ${groupBy}, data_hora_gmt as data FROM dados_satelite_2025
        UNION ALL
        SELECT ${groupBy}, data_pas as data FROM dados_satelite_2024
        UNION ALL
        SELECT ${groupBy}, data_pas as data FROM dados_satelite_2023
      ) AS uniao
      WHERE 1=1 ${where}
      GROUP BY ${groupBy}
      ORDER BY total_focos DESC
      LIMIT 10
    `;
    const result = await pool.query(query, params);
    return result.rows.map(row => ({
      label: row[groupBy],
      value: parseInt(row.total_focos, 10)
    }));
  } catch (error) {
    console.error('Erro ao buscar focos de calor:', error);
    return [];
  }
}

// Risco de Fogo (unindo todas as tabelas de satélite)
async function getRiscoDeFogoPorGrupo(
  groupBy: 'estado' | 'bioma',
  startDate?: string,
  endDate?: string
): Promise<any[]> {
  try {
    let where = '';
    const params: any[] = [];
    if (startDate) {
      params.push(startDate);
      where += ` AND data >= $${params.length}`;
    }
    if (endDate) {
      params.push(endDate);
      where += ` AND data <= $${params.length}`;
    }
    const query = `
      SELECT ${groupBy}, AVG(ABS(risco_fogo)) AS risco_medio FROM (
        SELECT ${groupBy}, risco_fogo, data_hora_gmt as data FROM dados_satelite_2025
        UNION ALL
        SELECT ${groupBy}, risco_fogo, data_pas as data FROM dados_satelite_2024
        UNION ALL
        SELECT ${groupBy}, risco_fogo, data_pas as data FROM dados_satelite_2023
      ) AS uniao
      WHERE 1=1 ${where}
      AND risco_fogo <= 1 AND risco_fogo >= -1
      GROUP BY ${groupBy}
      ORDER BY risco_medio DESC
      LIMIT 10
    `;
    const result = await pool.query(query, params);
    return result.rows.map(row => ({
      label: row[groupBy],
      value: Number(row.risco_medio)
    }));
  } catch (error) {
    console.error('Erro ao buscar risco de fogo:', error);
    return [];
  }
}

// Áreas Queimadas (usando apenas a tabela area_queimada)
async function getAreasQueimadasPorGrupo(
  groupBy: 'estado' | 'bioma',
  startDate?: string,
  endDate?: string
): Promise<any[]> {
  try {
    let where = '';
    const params: any[] = [];
    if (startDate) {
      params.push(startDate);
      where += ` AND data_hora >= $${params.length}`;
    }
    if (endDate) {
      params.push(endDate);
      where += ` AND data_hora <= $${params.length}`;
    }
    const query = `
      SELECT ${groupBy}, COUNT(*) AS total_queimadas
      FROM area_queimada
      WHERE 1=1 ${where}
      GROUP BY ${groupBy}
      ORDER BY total_queimadas DESC
      LIMIT 10
    `;
    const result = await pool.query(query, params);
    return result.rows.map(row => ({
      label: row[groupBy],
      value: Number(row.total_queimadas)
    }));
  } catch (error) {
    console.error('Erro ao buscar áreas queimadas:', error);
    return [];
  }
}

export {
  getFocosDeCalorPorGrupo,
  getRiscoDeFogoPorGrupo,
  getAreasQueimadasPorGrupo
}