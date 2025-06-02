export interface TTSVoiceSetting {
    voice_id: string
    speed: number
    vol: number
    pitch: number
}

export interface TTSPronunciationDict {
    tone: string[]
}

export interface TTSAudioSetting {
    audio_sample_rate: number
    bitrate: number
    format: 'mp3'
    channel: number
}

export interface TTSRequestPayload {
    model: string
    text: string
    language_boost: 'auto' | string
    voice_setting: TTSVoiceSetting
    pronunciation_dict?: TTSPronunciationDict
    audio_setting: TTSAudioSetting
}

export interface TTSResponse {
    task_id: string
    status: 'pending' | 'processing' | 'completed' | 'failed'
    audio_url?: string
    error?: string
}

export interface TTSCacheConfig {
    enabled: boolean
    dir: string
    maxAge: number // 缓存过期时间（毫秒）
    maxSize: number // 最大缓存大小（字节）
}

export interface TTSCacheItem {
    taskId: string
    audioUrl: string
    text: string
    timestamp: number
    size: number
} 