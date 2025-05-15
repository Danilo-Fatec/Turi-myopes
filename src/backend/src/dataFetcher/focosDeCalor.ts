import pool from '../db'

export async function getFocosDeCalorPorEstado(): Promise<any[]> {
  const query = `
    SELECT estado, COUNT(*) AS total_focos
    FROM dados_satelite
    GROUP BY estado
    ORDER BY total_focos DESC;
  `
  const result = await pool.query(query)
  return result.rows
}

export async function getFocosDeCalorPorBioma(): Promise<any[]> {
  const query = `
    SELECT bioma, COUNT(*) AS total_focos
    FROM dados_satelite
    GROUP BY bioma
    ORDER BY total_focos DESC;
  `
  const result = await pool.query(query)
  return result.rows
}

export async function getProgressoFocosDeCalorPorEstado(estado: string): Promise<any[]> {
  const query = `
    SELECT data_hora_gmt::date AS data, COUNT(*) AS total_focos
    FROM dados_satelite
    WHERE estado = $1
    GROUP BY data_hora_gmt::date
    ORDER BY data_hora_gmt::date;
  `
  const result = await pool.query(query, [estado])
  return result.rows
}

export async function getProgressoFocosDeCalorPorBioma(bioma: string): Promise<any[]> {
  const query = `
    SELECT data_hora_gmt::date AS data, COUNT(*) AS total_focos
    FROM dados_satelite
    WHERE bioma = $1
    GROUP BY data_hora_gmt::date
    ORDER BY data_hora_gmt::date;
  `
  const result = await pool.query(query, [bioma])
  return result.rows
}