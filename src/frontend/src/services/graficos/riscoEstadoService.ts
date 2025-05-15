import api from "../api"

const riscoEstadoService = async () => {
    try {
        const response = await api.get('/risco-estado')
        console.log(response.data)
        if (response.status === 200) {
            return { status: response.status, data: response.data }
        } else {
            return { status: response.status, message: response.data }
        }
    } catch (error) {
        console.error('Erro ao carregar os dados de risco por estado', error);
        throw new Error('Erro ao carregar os dados de risco por estado. Tente novamente mais tarde')
    }
}

export default riscoEstadoService
