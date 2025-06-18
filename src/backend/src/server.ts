import express from 'express'
import cors from 'cors'
import { 
  getFocosDeCalorPorGrupo, 
  getRiscoDeFogoPorGrupo, 
  getAreasQueimadasPorGrupo 
} from './dataFetcher'
import { getAreasQueimadasPontos } from './dataFetcher/areasQueimadas'
import { getRiscoDeFogoPontos } from './dataFetcher/riscoDeFogo'
import { getFocosDeCalorPontos } from './dataFetcher/focosDeCalor'

const app = express()
const port = 3000

app.use(cors())

// Focos de Calor
app.get('/focos-por-estado-pizza', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const data = await getFocosDeCalorPorGrupo('estado', startDate as string, endDate as string);
    res.json(data);
  } catch (error) {
    console.error('Erro na rota /focos-por-estado-pizza:', error);
    res.status(500).json({ error: 'Erro ao buscar dados' });
  }
});

app.get('/focos-por-bioma-pizza', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const data = await getFocosDeCalorPorGrupo('bioma', startDate as string, endDate as string);
    res.json(data);
  } catch (error) {
    console.error('Erro na rota /focos-por-bioma-pizza:', error);
    res.status(500).json({ error: 'Erro ao buscar dados' });
  }
});

// Risco de Fogo
app.get('/risco-por-estado-pizza', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const data = await getRiscoDeFogoPorGrupo('estado', startDate as string, endDate as string);
    res.json(data);
  } catch (error) {
    console.error('Erro na rota /risco-por-estado-pizza:', error);
    res.status(500).json({ error: 'Erro ao buscar dados' });
  }
});

app.get('/risco-por-bioma-pizza', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const data = await getRiscoDeFogoPorGrupo('bioma', startDate as string, endDate as string);
    res.json(data);
  } catch (error) {
    console.error('Erro na rota /risco-por-bioma-pizza:', error);
    res.status(500).json({ error: 'Erro ao buscar dados' });
  }
});

// Áreas Queimadas
app.get('/areas-por-estado-pizza', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const data = await getAreasQueimadasPorGrupo('estado', startDate as string, endDate as string);
    res.json(data);
  } catch (error) {
    console.error('Erro na rota /areas-por-estado-pizza:', error);
    res.status(500).json({ error: 'Erro ao buscar dados' });
  }
});

app.get('/areas-por-bioma-pizza', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const data = await getAreasQueimadasPorGrupo('bioma', startDate as string, endDate as string);
    res.json(data);
  } catch (error) {
    console.error('Erro na rota /areas-por-bioma-pizza:', error);
    res.status(500).json({ error: 'Erro ao buscar dados' });
  }
});

app.get('/focos-pontos', async (req, res) => {
  try {
    const { startDate, endDate, estado, bioma } = req.query;
    const data = await getFocosDeCalorPontos(
      startDate as string,
      endDate as string,
      estado as string,
      bioma as string
    );
    res.json(data);
  } catch (error) {
    console.error('Erro na rota /focos-pontos:', error)
    res.status(500).json({ error: 'Erro ao buscar pontos de focos de calor' })
  }
})

app.get('/riscos-pontos', async (req, res) => {
  try {
    const { startDate, endDate, estado, bioma } = req.query;
    const data = await getRiscoDeFogoPontos(
      startDate as string,
      endDate as string,
      estado as string,
      bioma as string
    );
    res.json(data)
  } catch (error) {
    console.error('Erro na rota /riscos-pontos:', error)
    res.status(500).json({ error: 'Erro ao buscar pontos de risco de fogo' })
  }
});

app.get('/queimadas-pontos', async (req, res) => {
  try {
    const { startDate, endDate, estado, bioma } = req.query;
    const data = await getAreasQueimadasPontos(
      startDate as string,
      endDate as string,
      estado as string,
      bioma as string
    );
    res.json(data)
  } catch (error) {
    console.error('Erro na rota /queimadas-pontos:', error)
    res.status(500).json({ error: 'Erro ao buscar pontos de áreas queimadas' })
  }
})

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});