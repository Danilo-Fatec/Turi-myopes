import pool from '../db';

export async function getAreasQueimadasPorEstado(): Promise<any[]> {
  const query = `
    SELECT estado, SUM(precipitacao) AS total_precipitacao
    FROM dados_satelite
    GROUP BY estado
    ORDER BY total_precipitacao DESC;
  `;
  const result = await pool.query(query);
  return result.rows;
}

export async function getAreasQueimadasPorBioma(): Promise<any[]> {
  const query = `
    SELECT bioma, SUM(precipitacao) AS total_precipitacao
    FROM dados_satelite
    GROUP BY bioma
    ORDER BY total_precipitacao DESC;
  `;
  const result = await pool.query(query);
  return result.rows;
}