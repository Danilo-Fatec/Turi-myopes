// src/testScript.ts (ou test.ts)
import { closePool } from './db'; // Importa a função para fechar o pool de conexão do banco de dados
import {
    getTopStatesByFocoCount,
    getBottomStatesByFocoCount,
    getTopBiomasByFocoCount,
    getBottomBiomasByFocoCount
} from './dataFetcher'; // Importa as funções do módulo de focos

import {
    getTopStatesByRisk,
    getBottomStatesByRisk,
    getTopBiomasByRisk,
    getBottomBiomasByRisk
} from './riskDataFetcher'; // Importa as funções do módulo de risco

async function runTests() {
    console.log('Iniciando testes focados em Top/Bottom Biomas e Estados com filtro de data...');

    // Parâmetros de teste para o filtro de data e limite
    const limit = 5;
    const startDate = '2023-01-01'; // Data de início para os testes
    const endDate = '2025-12-31';   // Data de fim para os testes

    console.log(`\n--- Testando funções para o período: ${startDate} a ${endDate} e Limite ${limit} ---`);

    // --- Testes de Focos por Estado ---
    console.log('\n>> Testando Funções Top/Bottom 5 Focos por Estado (dataFetcher)...');
    try {
        const topStatesFocos = await getTopStatesByFocoCount(limit, startDate, endDate);
        console.log('Resultado (Top 5 Estados por Focos):', topStatesFocos);
    } catch (error) {
        console.error('Falha no teste de TopStatesByFocoCount:', error);
    }

    try {
        const bottomStatesFocos = await getBottomStatesByFocoCount(limit, startDate, endDate);
        console.log('Resultado (Bottom 5 Estados por Focos):', bottomStatesFocos);
    } catch (error) {
        console.error('Falha no teste de BottomStatesByFocoCount:', error);
    }


    // --- Testes de Focos por Bioma ---
    console.log('\n>> Testando Funções Top/Bottom 5 Focos por Bioma (dataFetcher)...');
    try {
        const topBiomasFocos = await getTopBiomasByFocoCount(limit, startDate, endDate);
        console.log('Resultado (Top 5 Biomas por Focos):', topBiomasFocos);
    } catch (error) {
        console.error('Falha no teste de TopBiomasByFocoCount:', error);
    }

    try {
        const bottomBiomasFocos = await getBottomBiomasByFocoCount(limit, startDate, endDate);
        console.log('Resultado (Bottom 5 Biomas por Focos):', bottomBiomasFocos);
    } catch (error) {
        console.error('Falha no teste de BottomBiomasByFocoCount:', error);
    }


    // --- Testes de Risco por Estado ---
    console.log('\n>> Testando Funções Top/Bottom 5 Risco Médio por Estado (riskDataFetcher)...');
    try {
        const topStatesRisk = await getTopStatesByRisk(limit, startDate, endDate);
        console.log(`Resultado (Top 5 Estados por Risco Médio ${startDate} a ${endDate}):`, topStatesRisk);
    } catch (error) {
        console.error('Falha no teste de TopStatesByRisk:', error);
    }

    try {
        const bottomStatesRisk = await getBottomStatesByRisk(limit, startDate, endDate);
        console.log(`Resultado (Bottom 5 Estados por Risco Médio ${startDate} a ${endDate}):`, bottomStatesRisk);
    } catch (error) {
        console.error('Falha no teste de BottomStatesByRisk:', error);
    }


    // --- Testes de Risco por Bioma ---
    console.log('\n>> Testando Funções Top/Bottom 5 Risco Médio por Bioma (riskDataFetcher)...');
    try {
        const topBiomasRisk = await getTopBiomasByRisk(limit, startDate, endDate);
        console.log(`Resultado (Top 5 Biomas por Risco Médio ${startDate} a ${endDate}):`, topBiomasRisk);
    } catch (error) {
        console.error('Falha no teste de TopBiomasByRisk:', error);
    }

    try {
        const bottomBiomasRisk = await getBottomBiomasByRisk(limit, startDate, endDate);
        console.log(`Resultado (Bottom 5 Biomas por Risco Médio ${startDate} a ${endDate}):`, bottomBiomasRisk);
    } catch (error) {
        console.error('Falha no teste de BottomBiomasByRisk:', error);
    }


    // --- Finalização ---
    await closePool(); // Fecha a conexão com o banco de dados
    console.log('\nExecução dos testes finalizada.');
}

// Executa todos os testes
runTests();