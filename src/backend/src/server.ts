// src/server.ts
import app from './app'; // Importa a instância do Express app de app.ts
import { closePool } from './db'; // Para fechar a conexão do banco de dados ao encerrar o servidor

const port = process.env.PORT || 3000; // Porta do servidor

// Iniciar o servidor
const server = app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});

// Lidar com o encerramento do servidor para fechar o pool de conexão do banco de dados
process.on('SIGINT', async () => {
    console.log('Recebido SIGINT. Encerrando o servidor e fechando pool de conexão...');
    await closePool();
    server.close(() => {
        console.log('Servidor encerrado.');
        process.exit(0);
    });
});

process.on('SIGTERM', async () => {
    console.log('Recebido SIGTERM. Encerrando o servidor e fechando pool de conexão...');
    await closePool();
    server.close(() => {
        console.log('Servidor encerrado.');
        process.exit(0);
    });
});