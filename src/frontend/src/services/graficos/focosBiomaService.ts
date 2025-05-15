import api from "../api"

const focosBiomaService = async () => {
    try {
        const response = await api.get('/focos-bioma')
        console.log(response.data)
        if (response.status === 200) {
            return { status: response.status, data: response.data }
        } else {
            return { status: response.status, message: response.data }
        }
    } catch (error) {
        console.error('Erro ao carregar os dados de focos por bioma', error);
        throw new Error('Erro ao carregar os dados de focos por bioma. Tente novamente mais tarde')
    }
}

export default focosBiomaService