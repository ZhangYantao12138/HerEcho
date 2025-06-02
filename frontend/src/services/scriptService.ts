import axios from 'axios'
import { Script } from '../types/script'

const api = axios.create({
    baseURL: '/api'
})

export const scriptService = {
    async getScripts(): Promise<Script[]> {
        const response = await api.get('/scripts')
        return response.data
    },

    async getScriptById(id: string): Promise<Script> {
        const response = await api.get(`/scripts/${id}`)
        return response.data
    },

    async getCharactersByScriptId(scriptId: string) {
        const response = await api.get(`/scripts/${scriptId}/characters`)
        return response.data
    }
} 