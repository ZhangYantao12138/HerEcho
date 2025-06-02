import axios from 'axios'
import { TTSRequestPayload, TTSResponse, TTSVoiceSetting, TTSAudioSetting } from '../types/tts'
import { TTSConfig } from '../types/script'
import { ttsCacheService } from './ttsCacheService'

const api = axios.create({
    baseURL: import.meta.env.VITE_MINIMAX_API_BASE_URL
})

const defaultVoiceSetting: TTSVoiceSetting = {
    voice_id: 'audiobook_male_1',
    speed: 1,
    vol: 1,
    pitch: 1
}

const defaultAudioSetting: TTSAudioSetting = {
    audio_sample_rate: 32000,
    bitrate: 128000,
    format: 'mp3',
    channel: 2
}

export const ttsService = {
    async textToSpeech(
        text: string,
        ttsConfig: TTSConfig,
        audioSetting: Partial<TTSAudioSetting> = {}
    ): Promise<string> {
        // 检查缓存
        const cachedAudio = await ttsCacheService.getCachedAudio(text)
        if (cachedAudio) {
            return cachedAudio
        }

        // 构建请求参数
        const payload: TTSRequestPayload = {
            model: import.meta.env.VITE_MINIMAX_TTS_MODEL || 'speech-02-hd',
            text,
            language_boost: 'auto',
            voice_setting: {
                ...defaultVoiceSetting,
                ...ttsConfig
            },
            audio_setting: {
                ...defaultAudioSetting,
                ...audioSetting
            }
        }

        // 如果角色有特定的发音字典，添加到请求中
        if (ttsConfig.pronunciation_dict) {
            payload.pronunciation_dict = ttsConfig.pronunciation_dict
        }

        try {
            // 发送异步请求
            const response = await api.post<TTSResponse>(
                '/t2a_async_v2',
                payload,
                {
                    headers: {
                        'Authorization': `Bearer ${import.meta.env.VITE_MINIMAX_API_KEY}`,
                        'Content-Type': 'application/json'
                    },
                    params: {
                        GroupId: import.meta.env.VITE_MINIMAX_GROUP_ID
                    }
                }
            )

            // 轮询任务状态
            const audioUrl = await this.pollTaskStatus(response.data.task_id)

            // 缓存结果
            if (audioUrl) {
                await ttsCacheService.cacheAudio(text, audioUrl)
            }

            return audioUrl
        } catch (error) {
            console.error('TTS request failed:', error)
            throw error
        }
    },

    async pollTaskStatus(taskId: string, maxAttempts = 30, interval = 1000): Promise<string> {
        let attempts = 0

        while (attempts < maxAttempts) {
            try {
                const response = await api.get<TTSResponse>(
                    `/t2a_async_v2/${taskId}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${import.meta.env.VITE_MINIMAX_API_KEY}`
                        }
                    }
                )

                if (response.data.status === 'completed' && response.data.audio_url) {
                    return response.data.audio_url
                }

                if (response.data.status === 'failed') {
                    throw new Error(response.data.error || 'TTS task failed')
                }

                await new Promise(resolve => setTimeout(resolve, interval))
                attempts++
            } catch (error) {
                console.error('Poll task status failed:', error)
                throw error
            }
        }

        throw new Error('TTS task timeout')
    }
} 