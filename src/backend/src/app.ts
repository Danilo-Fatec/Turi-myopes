import { fetchFocosDeCalor } from './dataFetcher'

async function main() {
    try {
        const data = await fetchFocosDeCalor()
        const jsonData = JSON.stringify(data, null, 2)
        console.log(jsonData)
    } catch (error) {
        console.error('Erro ao executar a aplicação:', error)
    } finally {
        const pool = (await import('./db')).default
        pool.end()
    }
}

main();