import axios from 'axios';
import type { AxiosProgressEvent } from 'axios';
import type { Character } from '../types/character';

interface TTSRequest {
    model: string;
    text: string;
    voice_setting: {
        voice_id: string;
        speed: number;
        vol: number;
        pitch: number;
    };
    stream: boolean;
    audio_setting: {
        sample_rate: number;
        bitrate: number;
        format: string;
        channel: number;
    };
}

interface TTSResponse {
    data: {
        audio: string;
        status: number;
    };
    extra_info?: {
        audio_length: number;
        audio_sample_rate: number;
        audio_size: number;
        audio_bitrate: number;
        word_count: number;
        invisible_character_ratio: number;
        audio_format: string;
        usage_characters: number;
    };
    base_resp: {
        status_code: number;
        status_msg: string;
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
    private isGenerating: boolean;

    private constructor() {
        // 从.env文件读取配置
        this.baseUrl = import.meta.env.VITE_MINIMAX_API_URL;
        this.apiKey = import.meta.env.VITE_MINIMAX_API_KEY;
        this.groupId = import.meta.env.VITE_MINIMAX_GROUP_ID;

        // 验证必要的环境变量
        if (!this.baseUrl) {
            console.error('[TTS] 错误: 未设置 VITE_MINIMAX_API_URL');
            console.error('[TTS] 请在项目根目录创建 .env 文件并添加以下配置：');
            console.error('VITE_MINIMAX_API_URL=https://api.minimax.chat/v1/t2a_v2');
            throw new Error('TTS服务配置错误：未设置 VITE_MINIMAX_API_URL');
        }
        if (!this.apiKey) {
            console.error('[TTS] 错误: 未设置 VITE_MINIMAX_API_KEY');
            console.error('[TTS] 请在项目根目录创建 .env 文件并添加以下配置：');
            console.error('VITE_MINIMAX_API_KEY=your_api_key_here');
            throw new Error('TTS服务配置错误：未设置 VITE_MINIMAX_API_KEY');
        }
        if (!this.groupId) {
            console.error('[TTS] 错误: 未设置 VITE_MINIMAX_GROUP_ID');
            console.error('[TTS] 请在项目根目录创建 .env 文件并添加以下配置：');
            console.error('VITE_MINIMAX_GROUP_ID=your_group_id_here');
            throw new Error('TTS服务配置错误：未设置 VITE_MINIMAX_GROUP_ID');
        }

        this.audioCache = new Map();
        this.audioContext = null;
        this.currentAudioSource = null;
        this.onEndedCallback = null;
        this.isGenerating = false;
        this.headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
        };

        console.log('[TTS] 服务初始化完成:', {
            baseUrl: this.baseUrl,
            groupId: this.groupId,
            hasApiKey: !!this.apiKey
        });
    }

    public static getInstance(): TTSService {
        if (!TTSService.instance) {
            TTSService.instance = new TTSService();
        }
        return TTSService.instance;
    }

    private processText(text: string): string {
        // 使用正则表达式匹配括号中的内容，并替换为适当的停顿
        return text.replace(/\([^)]*\)/g, (match) => {
            // 如果括号内容包含动作描述，替换为逗号
            if (match.includes('轻轻') || match.includes('微微') || match.includes('慢慢') ||
                match.includes('缓缓') || match.includes('静静') || match.includes('默默')) {
                return '，';
            }
            // 如果括号内容包含表情描述，替换为句号
            if (match.includes('笑') || match.includes('哭') || match.includes('怒') ||
                match.includes('喜') || match.includes('悲') || match.includes('惊')) {
                return '。';
            }
            // 其他情况替换为逗号
            return '，';
        });
    }

    private buildTTSRequest(text: string, character: Character): TTSRequest {
        // 处理文本，将括号内容替换为停顿
        const processedText = this.processText(text);

        const request: TTSRequest = {
            model: 'speech-02-turbo',
            text: processedText,
            voice_setting: {
                voice_id: character.voiceSettings.voice_id,
                speed: character.voiceSettings.speed || 1.0,
                vol: character.voiceSettings.vol || 1.0,
                pitch: character.voiceSettings.pitch || 0
            },
            stream: false,
            audio_setting: {
                sample_rate: 32000,
                bitrate: 128000,
                format: 'mp3',
                channel: 1
            }
        };

        console.log('[TTS] 请求参数:', JSON.stringify(request, null, 2));
        return request;
    }

    private async generateTTS(text: string, character: Character): Promise<ArrayBuffer> {
        console.log('[TTS] 开始TTS请求');

        const request = this.buildTTSRequest(text, character);
        const url = new URL(this.baseUrl);
        url.searchParams.append('GroupId', this.groupId);

        console.log('[TTS] 请求URL:', url.toString());

        try {
            const response = await axios.post(url.toString(), request, {
                headers: this.headers,
                responseType: 'json'
            });

            console.log('[TTS] 收到响应:', response.data);

            if (!response.data) {
                throw new Error('响应数据为空');
            }

            const ttsResponse = response.data as TTSResponse;

            if (ttsResponse.base_resp.status_code !== 0) {
                const errorMsg = `API错误 (${ttsResponse.base_resp.status_code}): ${ttsResponse.base_resp.status_msg}`;
                console.error('[TTS]', errorMsg);
                if (ttsResponse.base_resp.status_code === 1004) {
                    console.error('[TTS] 请检查以下配置：');
                    console.error('1. VITE_MINIMAX_API_KEY 是否正确');
                    console.error('2. VITE_MINIMAX_GROUP_ID 是否与 API Key 匹配');
                    console.error('3. API Key 是否有权限访问该 Group');
                    console.error('当前配置：', {
                        groupId: this.groupId,
                        hasApiKey: !!this.apiKey,
                        url: url.toString()
                    });
                }
                throw new Error(errorMsg);
            }

            if (!ttsResponse.data.audio) {
                throw new Error('响应中没有音频数据');
            }

            // 将十六进制字符串转换为 ArrayBuffer
            const hexString = ttsResponse.data.audio;
            const audioData = new Uint8Array(hexString.length / 2);
            for (let i = 0; i < hexString.length; i += 2) {
                audioData[i / 2] = parseInt(hexString.substr(i, 2), 16);
            }

            console.log('[TTS] 音频数据生成成功:', {
                size: audioData.length,
                extraInfo: ttsResponse.extra_info
            });

            return audioData.buffer;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('[TTS] API错误:', {
                    status: error.response?.status,
                    statusText: error.response?.statusText,
                    data: error.response?.data,
                    message: error.message
                });
            }
            throw error;
        }
    }

    public async generateAudio(text: string, character: Character): Promise<ArrayBuffer> {
        const cacheKey = `${character.id}_${text}`;

        if (this.audioCache.has(cacheKey)) {
            console.log('[TTS] 使用缓存的音频数据');
            return this.audioCache.get(cacheKey)!;
        }

        try {
            const audioData = await this.generateTTS(text, character);
            this.audioCache.set(cacheKey, audioData);
            return audioData;
        } catch (error) {
            console.error('[TTS] 音频生成失败:', error);
            throw error;
        }
    }

    public async playAudio(audioData: ArrayBuffer): Promise<void> {
        try {
            if (!this.audioContext) {
                this.audioContext = new AudioContext();
            }

            console.log('[TTS] 开始解码音频数据:', {
                dataSize: audioData.byteLength,
                sampleRate: this.audioContext.sampleRate
            });

            // 停止当前正在播放的音频
            if (this.currentAudioSource) {
                try {
                    this.currentAudioSource.stop();
                    this.currentAudioSource.disconnect();
                } catch (error) {
                    console.warn('[TTS] 停止当前音频失败:', error);
                }
                this.currentAudioSource = null;
            }

            const audioBuffer = await this.audioContext.decodeAudioData(audioData.slice(0));
            console.log('[TTS] 音频解码成功:', {
                duration: audioBuffer.duration,
                numberOfChannels: audioBuffer.numberOfChannels,
                sampleRate: audioBuffer.sampleRate
            });

            // 创建新的音频源
            const source = this.audioContext.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(this.audioContext.destination);

            // 设置结束回调
            source.onended = () => {
                console.log('[TTS] 音频播放结束');
                if (this.currentAudioSource === source) {
                    source.disconnect();
                    this.currentAudioSource = null;
                    if (this.onEndedCallback) {
                        this.onEndedCallback();
                    }
                }
            };

            // 保存当前音频源并开始播放
            this.currentAudioSource = source;
            source.start();
            console.log('[TTS] 音频开始播放');
        } catch (error) {
            console.error('[TTS] 音频播放失败:', error);
            if (this.currentAudioSource) {
                this.currentAudioSource.disconnect();
                this.currentAudioSource = null;
            }
            if (error instanceof Error && error.name === 'EncodingError') {
                console.error('[TTS] 音频数据详情:', {
                    size: audioData.byteLength,
                    firstBytes: new Uint8Array(audioData.slice(0, 16))
                });
            }
            throw error;
        }
    }

    public stopAudio(): void {
        console.log('[TTS] 停止音频播放');
        if (this.currentAudioSource) {
            try {
                this.currentAudioSource.stop();
                this.currentAudioSource.disconnect();
                this.currentAudioSource = null;
                console.log('[TTS] 音频已停止');
            } catch (error) {
                console.error('[TTS] 停止音频失败:', error);
            }
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