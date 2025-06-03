import axios from 'axios';
import type { Character } from '../types/character';

interface TTSRequest {
    model: string;
    text: string;
    voice_id: string;
    stream: boolean;
}

interface TTSResponse {
    data?: {
        audio?: string;
    };
}

export class TTSService {
    private static instance: TTSService;
    private baseUrl: string;
    private apiKey: string;
    private groupId: string;
    private audioCache: Map<string, ArrayBuffer>;
    private audioContext: AudioContext | null;
    private currentAudioSource: AudioBufferSourceNode | null;
    private onEndedCallback: (() => void) | null;
    private headers: Record<string, string>;

    private constructor() {
        this.baseUrl = import.meta.env.VITE_MINIMAX_API_URL || 'https://api.minimax.chat/v1/t2a_v2';
        this.apiKey = import.meta.env.VITE_MINIMAX_API_KEY || '';
        this.groupId = import.meta.env.VITE_MINIMAX_GROUP_ID || '';
        this.audioCache = new Map();
        this.audioContext = null;
        this.currentAudioSource = null;
        this.onEndedCallback = null;
        this.headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
        };

        if (!this.apiKey) {
            console.error('[TTS] 错误: 未设置 MINIMAX_API_KEY');
        }
        if (!this.groupId) {
            console.error('[TTS] 错误: 未设置 MINIMAX_GROUP_ID');
        }
    }

    public static getInstance(): TTSService {
        if (!TTSService.instance) {
            TTSService.instance = new TTSService();
        }
        return TTSService.instance;
    }

    private buildTTSRequest(text: string, character: Character): TTSRequest {
        console.log('[TTS] 构建请求:', {
            text: text.substring(0, 50) + (text.length > 50 ? '...' : ''),
            characterId: character.id,
            characterName: character.name
        });

        const request: TTSRequest = {
            model: 'speech-1',
            text,
            voice_id: character.voiceSettings.voice_id,
            stream: true
        };

        console.log('[TTS] 请求参数:', request);
        return request;
    }

    private async streamTTS(text: string, character: Character): Promise<ArrayBuffer> {
        console.log('[TTS] 开始流式TTS请求');

        const request = this.buildTTSRequest(text, character);
        const url = `${this.baseUrl}?GroupId=${this.groupId}`;

        console.log('[TTS] 请求URL:', url);

        try {
            const response = await axios.post(url, request, {
                headers: this.headers,
                responseType: 'arraybuffer'
            });

            console.log('[TTS] 收到响应:', {
                status: response.status,
                contentType: response.headers['content-type'],
                dataSize: response.data.byteLength
            });

            return response.data;
        } catch (error) {
            console.error('[TTS] 请求失败:', error);
            if (axios.isAxiosError(error)) {
                console.error('[TTS] 错误详情:', {
                    status: error.response?.status,
                    statusText: error.response?.statusText,
                    data: error.response?.data
                });
            }
            throw error;
        }
    }

    public async generateAudio(text: string, character: Character): Promise<ArrayBuffer> {
        console.log('[TTS] 开始生成音频');

        const cacheKey = `${character.id}_${text}`;
        console.log('[TTS] 缓存键:', cacheKey);

        if (this.audioCache.has(cacheKey)) {
            console.log('[TTS] 使用缓存音频');
            return this.audioCache.get(cacheKey)!;
        }

        try {
            const audioData = await this.streamTTS(text, character);
            console.log('[TTS] 音频生成成功:', {
                size: audioData.byteLength,
                cacheKey
            });

            this.audioCache.set(cacheKey, audioData);
            return audioData;
        } catch (error) {
            console.error('[TTS] 音频生成失败:', error);
            throw error;
        }
    }

    public async playAudio(audioData: ArrayBuffer): Promise<void> {
        console.log('[TTS] 开始播放音频:', {
            dataSize: audioData.byteLength
        });

        try {
            if (!this.audioContext) {
                console.log('[TTS] 创建新的AudioContext');
                this.audioContext = new AudioContext();
            }

            const audioBuffer = await this.audioContext.decodeAudioData(audioData);
            console.log('[TTS] 音频解码成功:', {
                duration: audioBuffer.duration,
                numberOfChannels: audioBuffer.numberOfChannels,
                sampleRate: audioBuffer.sampleRate
            });

            if (this.currentAudioSource) {
                console.log('[TTS] 停止当前播放的音频');
                this.currentAudioSource.stop();
            }

            this.currentAudioSource = this.audioContext.createBufferSource();
            this.currentAudioSource.buffer = audioBuffer;
            this.currentAudioSource.connect(this.audioContext.destination);

            this.currentAudioSource.onended = () => {
                console.log('[TTS] 音频播放结束');
                if (this.onEndedCallback) {
                    this.onEndedCallback();
                }
            };

            this.currentAudioSource.start();
            console.log('[TTS] 音频开始播放');
        } catch (error) {
            console.error('[TTS] 音频播放失败:', error);
            throw error;
        }
    }

    public stopAudio(): void {
        console.log('[TTS] 停止音频播放');

        if (this.currentAudioSource) {
            try {
                this.currentAudioSource.stop();
                console.log('[TTS] 音频已停止');
            } catch (error) {
                console.error('[TTS] 停止音频失败:', error);
            }
            this.currentAudioSource = null;
        }
    }

    public onAudioEnded(callback: () => void): void {
        this.onEndedCallback = callback;
    }

    public clearCache(): void {
        console.log('[TTS] 清除音频缓存');
        this.audioCache.clear();
    }
} 