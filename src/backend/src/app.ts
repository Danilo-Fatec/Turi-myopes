// src/app.ts
import express from 'express';
import cors from 'cors';
import {
    getTopStatesByFocoCount,
    getBottomStatesByFocoCount,
    getTopBiomasByFocoCount,
    getBottomBiomasByFocoCount
} from './dataFetcher';

import {
    getTopStatesByRisk,
    getBottomStatesByRisk,
    getTopBiomasByRisk,
    getBottomBiomasByRisk
} from './riskDataFetcher';

const app = express();

// Middlewares
app.use(cors()); // Habilita o CORS para todas as rotas
app.use(express.json()); // Habilita o parsing de JSON no corpo das requisições

// Rota de teste simples
app.get('/', (req, res) => {
    res.send('API de Monitoramento de Risco Ambiental está online!');
});

/**
 * Rota para obter Top/Bottom Focos por Estado
 * Exemplo: GET /api/focos/states?limit=5&startDate=2023-01-01&endDate=2025-12-31
 */
app.get('/api/focos/states', async (req, res) => {
    const limit = parseInt(req.query.limit as string) || 5;
    const startDate = req.query.startDate as string;
    const endDate = req.query.endDate as string;

    if (!startDate || !endDate) {
        return res.status(400).json({ error: 'startDate e endDate são parâmetros obrigatórios.' });
    }

    try {
        const top = await getTopStatesByFocoCount(limit, startDate, endDate);
        const bottom = await getBottomStatesByFocoCount(limit, startDate, endDate);
        res.json({ topStates: top, bottomStates: bottom });
    } catch (error) {
        console.error('Erro ao buscar focos por estado:', error);
        res.status(500).json({ error: 'Erro interno do servidor ao buscar dados de focos por estado.' });
    }
});

/**
 * Rota para obter Top/Bottom Focos por Bioma
 * Exemplo: GET /api/focos/biomas?limit=5&startDate=2023-01-01&endDate=2025-12-31
 */
app.get('/api/focos/biomas', async (req, res) => {
    const limit = parseInt(req.query.limit as string) || 5;
    const startDate = req.query.startDate as string;
    const endDate = req.query.endDate as string;

    if (!startDate || !endDate) {
        return res.status(400).json({ error: 'startDate e endDate são parâmetros obrigatórios.' });
    }

    try {
        const top = await getTopBiomasByFocoCount(limit, startDate, endDate);
        const bottom = await getBottomBiomasByFocoCount(limit, startDate, endDate);
        res.json({ topBiomas: top, bottomBiomas: bottom });
    } catch (error) {
        console.error('Erro ao buscar focos por bioma:', error);
        res.status(500).json({ error: 'Erro interno do servidor ao buscar dados de focos por bioma.' });
    }
});

/**
 * Rota para obter Top/Bottom Risco Médio por Estado
 * Exemplo: GET /api/risk/states?limit=5&startDate=2023-01-01&endDate=2025-12-31
 */
app.get('/api/risk/states', async (req, res) => {
    const limit = parseInt(req.query.limit as string) || 5;
    const startDate = req.query.startDate as string;
    const endDate = req.query.endDate as string;

    if (!startDate || !endDate) {
        return res.status(400).json({ error: 'startDate e endDate são parâmetros obrigatórios.' });
    }

    try {
        const top = await getTopStatesByRisk(limit, startDate, endDate);
        const bottom = await getBottomStatesByRisk(limit, startDate, endDate);
        res.json({ topStates: top, bottomStates: bottom });
    } catch (error) {
        console.error('Erro ao buscar risco médio por estado:', error);
        res.status(500).json({ error: 'Erro interno do servidor ao buscar dados de risco por estado.' });
    }
});

/**
 * Rota para obter Top/Bottom Risco Médio por Bioma
 * Exemplo: GET /api/risk/biomas?limit=5&startDate=2023-01-01&endDate=2025-12-31
 */
app.get('/api/risk/biomas', async (req, res) => {
    const limit = parseInt(req.query.limit as string) || 5;
    const startDate = req.query.startDate as string;
    const endDate = req.query.endDate as string;

    if (!startDate || !endDate) {
        return res.status(400).json({ error: 'startDate e endDate são parâmetros obrigatórios.' });
    }

    try {
        const top = await getTopBiomasByRisk(limit, startDate, endDate);
        const bottom = await getBottomBiomasByRisk(limit, startDate, endDate);
        res.json({ topBiomas: top, bottomBiomas: bottom });
    } catch (error) {
        console.error('Erro ao buscar risco médio por bioma:', error);
        res.status(500).json({ error: 'Erro interno do servidor ao buscar dados de risco por bioma.' });
    }
});

export default app;