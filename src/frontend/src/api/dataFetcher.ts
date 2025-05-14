import api from "./axiosConfig";

export async function getFocosPorEstadoBiomaParaPizza(): Promise<any[]> {
    try {
    const response = await api.get('/focos-por-estado-bioma-pizza')
    return response.data
  } catch (error) {
    console.error('Erro ao buscar dados:', error)
    throw error
  }
}