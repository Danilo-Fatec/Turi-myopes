// src/db.ts
import { Pool } from 'pg';

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: '123', // <-- COLOQUE SUA SENHA AQUI
    port: 5432,
});

export async function query(text: string, params?: any[]) {
    console.log('Executando consulta:', text); // Para depuração
    if (params && params.length > 0) {
        console.log('Com parâmetros:', params); // Para depuração dos parâmetros
    }
    const client = await pool.connect();
    try {
        const res = await client.query(text, params);
        // console.log('Resultado da consulta:', res.rows); // Descomente para ver os resultados brutos no console
        return res.rows;
    } finally {
        client.release();
    }
}

export async function closePool() {
    await pool.end();
    console.log('Pool de conexão fechado.');
}