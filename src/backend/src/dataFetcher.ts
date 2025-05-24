// src/dataFetcher.ts
import { query } from './db';

interface TopBottomResult {
    label: string;
    value: number;
}

/**
 * Função genérica para buscar Top/Bottom Focos por uma categoria (estado ou bioma).
 * Filtra por startDate e endDate.
 * @param category 'estado' ou 'bioma'
 * @param order 'ASC' para menor, 'DESC' para maior
 * @param limit O número de resultados a retornar
 * @param startDate Data de início do período (YYYY-MM-DD)
 * @param endDate Data de fim do período (YYYY-MM-DD)
 * @returns Um array de objetos { label: string, value: number }
 */
export async function fetchTopBottomFocosCount(
    category: 'estado' | 'bioma',
    order: 'ASC' | 'DESC',
    limit: number,
    startDate: string,
    endDate: string
): Promise<TopBottomResult[]> {
    console.log(`Função fetchTopBottomFocosCount() chamada para ${category}, ${order}, ${limit}, período ${startDate} a ${endDate}.`);

    // Geração dinâmica das partes UNION ALL para os anos 2023, 2024, 2025
    // Adicione ou remova anos aqui conforme a disponibilidade das suas tabelas de dados de satélite.
    const years = [2023, 2024, 2025];
    const unionParts = years.map(year => {
        // Usa data_pas para 2023/2024 e data_hora_gmt para 2025, conforme sua query original.
        const dateColumn = (year === 2025) ? 'data_hora_gmt' : 'data_pas';
        return `
            SELECT
                ${category} AS category_label,
                ${dateColumn} AS data_evento
            FROM "dados_satelite_${year}"
            WHERE ${category} IS NOT NULL
            AND risco_fogo IS NOT NULL -- Mantido, embora focos não dependa estritamente de risco_fogo para contagem
            AND ${dateColumn} BETWEEN $1 AND $2
        `;
    }).join('\nUNION ALL\n');

    const sql = `
        SELECT
            category_label AS label,
            COUNT(*) AS value
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
        return result.map(row => ({ label: String(row.label), value: parseInt(row.value, 10) }));
    } catch (error) {
        console.error(`Erro ao buscar Top/Bottom Focos por ${category}:`, error);
        throw error;
    }
}

// Funções para Estados
export async function getTopStatesByFocoCount(limit: number, startDate: string, endDate: string): Promise<TopBottomResult[]> {
    console.log(`Chamada: getTopStatesByFocoCount(${limit}, ${startDate}, ${endDate})`);
    return await fetchTopBottomFocosCount('estado', 'DESC', limit, startDate, endDate);
}

export async function getBottomStatesByFocoCount(limit: number, startDate: string, endDate: string): Promise<TopBottomResult[]> {
    console.log(`Chamada: getBottomStatesByFocoCount(${limit}, ${startDate}, ${endDate})`);
    return await fetchTopBottomFocosCount('estado', 'ASC', limit, startDate, endDate);
}

// NOVAS FUNÇÕES PARA BIOMAS
export async function getTopBiomasByFocoCount(limit: number, startDate: string, endDate: string): Promise<TopBottomResult[]> {
    console.log(`Chamada: getTopBiomasByFocoCount(${limit}, ${startDate}, ${endDate})`);
    return await fetchTopBottomFocosCount('bioma', 'DESC', limit, startDate, endDate);
}

export async function getBottomBiomasByFocoCount(limit: number, startDate: string, endDate: string): Promise<TopBottomResult[]> {
    console.log(`Chamada: getBottomBiomasByFocoCount(${limit}, ${startDate}, ${endDate})`);
    return await fetchTopBottomFocosCount('bioma', 'ASC', limit, startDate, endDate);
}