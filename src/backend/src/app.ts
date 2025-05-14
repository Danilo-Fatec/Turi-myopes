// src/app.ts
import { fetchFocosDeCalor } from './dataFetcher';

async function main() {
    try {
        const data = await fetchFocosDeCalor();
        const jsonData = JSON.stringify(data, null, 2); // Converte para JSON com indentação
        console.log(jsonData);
    } catch (error) {
        console.error('Erro ao executar a aplicação:', error);
    } finally {
        // Opcional: Fechar a conexão com o banco de dados após o uso
        const pool = (await import('./db')).default;
        pool.end();
    }
}

main();