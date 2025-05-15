import api from "../api"

const riscoBiomaService = async () => {
    try {
        const response = await api.get('/risco-bioma')
        console.log(response.data)
        if (response.status === 200) {
            return { status: response.status, data: response.data }
        } else {
            return { status: response.status, message: response.data }
        }
    } catch (error) {
        console.error('Erro ao carregar os dados de risco por bioma', error);
        throw new Error('Erro ao carregar os dados de risco por bioma. Tente novamente mais tarde')
    }
}

export default riscoBiomaService
