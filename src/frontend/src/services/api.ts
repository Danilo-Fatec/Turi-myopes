import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:3000',
    timeout: 300000 
})

export default api