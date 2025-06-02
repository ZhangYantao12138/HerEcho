export interface Script {
    id: string
    title: string
    description: string
    coverImage?: string
    characters: Character[]
}

export interface Character {
    id: string
    name: string
    avatar: string
    description: string
    ttsConfig: TTSConfig
}

export interface TTSConfig {
    voice_id: string
    speed: number
    vol: number
    pitch: number
    // 可选：角色特定的发音字典
    pronunciation_dict?: {
        tone: string[]
    }
}

export interface ScriptState {
    scripts: Script[]
    selectedScript: Script | null
    loading: boolean
    error: string | null
} 