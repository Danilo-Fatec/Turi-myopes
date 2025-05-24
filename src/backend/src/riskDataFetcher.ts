// src/riskDataFetcher.ts
import { query } from './db';

interface TopBottomResult {
    label: string;
    value: number;
}

/**
 * Função genérica para buscar Top/Bottom Risco Médio por uma categoria (estado ou bioma).
 * Agora aceita startDate e endDate para filtrar por período, abrangendo múltiplos anos.
 * @param category 'estado' ou 'bioma'
 * @param order 'ASC' para menor risco, 'DESC' para maior risco
 * @param limit O número de resultados a retornar
 * @param startDate Data de início do período (YYYY-MM-DD)
 * @param endDate Data de fim do período (YYYY-MM-DD)
 * @returns Um array de objetos { label: string, value: number }
 */
export async function fetchAverageRiskData(
    category: 'estado' | 'bioma',
    order: 'ASC' | 'DESC',
    limit: number,
    startDate: string,
    endDate: string
): Promise<TopBottomResult[]> {
    console.log(`Função fetchAverageRiskData() chamada para ${category}, ${order}, ${limit}, período ${startDate} a ${endDate}.`);

    // Geração dinâmica das partes UNION ALL para os anos 2023, 2024, 2025
    // Adicione ou remova anos aqui conforme a disponibilidade das suas tabelas de dados de satélite.
    const years = [2023, 2024, 2025];
    const unionParts = years.map(year => {
        // Usa data_pas para 2023/2024 e data_hora_gmt para 2025, conforme sua query original.
        const dateColumn = (year === 2025) ? 'data_hora_gmt' : 'data_pas';
        return `
            SELECT
                ${category} AS category_label,
                risco_fogo
            FROM "dados_satelite_${year}"
            WHERE risco_fogo IS NOT NULL
            AND ${category} IS NOT NULL
            AND ${dateColumn} BETWEEN $1 AND $2
        `;
    }).join('\nUNION ALL\n');

    const sql = `
        SELECT
            category_label AS label,
            AVG(risco_fogo) AS value
        FROM (
            ${unionParts}
        ) AS combined_data
        GROUP BY category_label
        ORDER BY value ${order}
        LIMIT ${limit};
    `;

    try {
        const result = await query(sql, [startDate, endDate]);
        // Garante que o valor seja um número
        return result.map(row => ({ label: String(row.label), value: parseFloat(row.value) }));
    } catch (error) {
        console.error(`Erro ao buscar Top/Bottom Risco Médio por ${category} para o período ${startDate} a ${endDate}:`, error);
        throw error;
    }
}

// Funções para Estados (atualizadas para usar startDate/endDate)
export async function getTopStatesByRisk(limit: number, startDate: string, endDate: string): Promise<TopBottomResult[]> {
    console.log(`Chamada: getTopStatesByRisk(${limit}, ${startDate}, ${endDate})`);
    return await fetchAverageRiskData('estado', 'DESC', limit, startDate, endDate);
}

export async function getBottomStatesByRisk(limit: number, startDate: string, endDate: string): Promise<TopBottomResult[]> {
    console.log(`Chamada: getBottomStatesByRisk(${limit}, ${startDate}, ${endDate})`);
    return await fetchAverageRiskData('estado', 'ASC', limit, startDate, endDate);
}

// NOVAS FUNÇÕES PARA BIOMAS (atualizadas para usar startDate/endDate)
export async function getTopBiomasByRisk(limit: number, startDate: string, endDate: string): Promise<TopBottomResult[]> {
    console.log(`Chamada: getTopBiomasByRisk(${limit}, ${startDate}, ${endDate})`);
    return await fetchAverageRiskData('bioma', 'DESC', limit, startDate, endDate);
}

export async function getBottomBiomasByRisk(limit: number, startDate: string, endDate: string): Promise<TopBottomResult[]> {
    console.log(`Chamada: getBottomBiomasByRisk(${limit}, ${startDate}, ${endDate})`);
    return await fetchAverageRiskData('bioma', 'ASC', limit, startDate, endDate);
}