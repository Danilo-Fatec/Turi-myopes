import express, { Request, Response } from 'express'
/* import { fetchFocosDeCalor, 
    getFocosPorEstadoBiomaParaPizza, 
    getFocosPorRiscoEstadoParaPizza } 
    from './dataFetcher' */
import cors from 'cors'
import pool from './db'
import { getFocosDeCalorPorEstado, 
    getFocosDeCalorPorBioma, 
    getProgressoFocosDeCalorPorEstado, 
    getProgressoFocosDeCalorPorBioma } 
    from './dataFetcher/focosDeCalor'
import { getRiscoDeFogoPorEstado, 
    getRiscoDeFogoPorBioma } 
    from './dataFetcher/riscoDeFogo'
import { getAreasQueimadasPorEstado, 
    getAreasQueimadasPorBioma } 
    from './dataFetcher/areasQueimadas'


const app = express()
const port = 3000

app.use(cors())

app.get('/focos-estado', async (req, res) => {
  const data = await getFocosDeCalorPorEstado()
  res.json(data)
})

app.get('/focos-bioma', async (req, res) => {
  const data = await getFocosDeCalorPorBioma()
  res.json(data)
})

app.get('/risco-estado', async (req, res) => {
  const data = await getRiscoDeFogoPorEstado()
  res.json(data)
})

app.get('/risco-bioma', async (req, res) => {
  const data = await getRiscoDeFogoPorBioma()
  res.json(data)
})

app.get('/areas-estado', async (req, res) => {
  const data = await getAreasQueimadasPorEstado()
  res.json(data)
})

app.get('/areas-bioma', async (req, res) => {
  const data = await getAreasQueimadasPorBioma()
  res.json(data)
})

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

/* app.get('/dados-grafico', async (req, res) => {
    const { mapType, dataType, startDate, endDate, region } = req.query;

    try {
        // Substitua pela lógica para buscar os dados filtrados no banco
        const data = await getDadosFiltrados(mapType as string, dataType as string, startDate as string);
        res.json(data);
    } catch (error) {
        console.error('Erro ao buscar dados do gráfico:', error);
        res.status(500).json({ error: 'Erro ao buscar dados' });
    }
});

app.get('/focos', async (req: Request, res: Response) => {
    try {
        const data = await fetchFocosDeCalor();
        res.json(data);
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
        res.status(500).json({ error: 'Erro ao buscar dados do banco de dados' });
    }
});
 
app.get('/focos-por-risco-estado-pizza', async (req, res) => {
    try {
        const data = await getFocosPorRiscoEstadoParaPizza();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar dados' });
    }
});

app.get('/focos-por-estado-bioma-pizza', async (req, res) => {
    try {
        const data = await getFocosPorEstadoBiomaParaPizza();
        console.log('Dados enviados para o frontend:', data);
        res.json(data)
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
        res.status(500).json({ error: 'Erro ao buscar dados' });
    }
}); */
