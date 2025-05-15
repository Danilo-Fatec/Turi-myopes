import pool from '../db'

export async function getRiscoDeFogoPorEstado(): Promise<any[]> {
  const query = `
    SELECT estado, AVG(risco_fogo) AS risco_medio
    FROM dados_satelite
    GROUP BY estado
    ORDER BY risco_medio DESC;
  `
  const result = await pool.query(query)
  return result.rows
}

export async function getRiscoDeFogoPorBioma(): Promise<any[]> {
  const query = `
    SELECT bioma, AVG(risco_fogo) AS risco_medio
    FROM dados_satelite
    GROUP BY bioma
    ORDER BY risco_medio DESC;
  `
  const result = await pool.query(query)
  return result.rows
}