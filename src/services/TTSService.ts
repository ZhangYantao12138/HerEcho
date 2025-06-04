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
        // 使用正则表达式匹配括号中的内容
        return text.replace(/\([^)]*\)/g, '，');
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
            stream: true,
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

    private async streamTTS(text: string, character: Character): Promise<ArrayBuffer> {
        console.log('[TTS] 开始流式TTS请求');

        const request = this.buildTTSRequest(text, character);
        const url = new URL(this.baseUrl);
        url.searchParams.append('GroupId', this.groupId);

        console.log('[TTS] 请求URL:', url.toString());

        try {
            const response = await axios.post(url.toString(), request, {
                headers: this.headers,
                responseType: 'text',
                onDownloadProgress: (progressEvent: AxiosProgressEvent) => {
                    console.log('[TTS] 下载进度:', {
                        loaded: progressEvent.loaded,
                        total: progressEvent.total
                    });
                }
            });

            console.log('[TTS] 完整响应数据:', response.data);

            if (!response.data) {
                throw new Error('响应数据为空');
            }

            // 检查响应是否为错误信息
            try {
                const errorResponse = JSON.parse(response.data);
                if (errorResponse.base_resp && errorResponse.base_resp.status_code !== 0) {
                    const errorMsg = `API错误 (${errorResponse.base_resp.status_code}): ${errorResponse.base_resp.status_msg}`;
                    console.error('[TTS]', errorMsg);
                    if (errorResponse.base_resp.status_code === 1004) {
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
            } catch (parseError) {
                // 如果不是 JSON 格式，继续处理
            }

            const lines = response.data.split('\n').filter((line: string) => line.trim());
            console.log('[TTS] 解析后的行数:', lines.length);

            if (lines.length === 0) {
                throw new Error('响应数据格式错误：没有有效的行数据');
            }

            const audioChunks: Uint8Array[] = [];
            let isFirstChunk = true;

            for (const line of lines) {
                if (line.startsWith('data:')) {
                    try {
                        const jsonData = JSON.parse(line.slice(5)) as TTSResponse;
                        console.log('[TTS] 解析的数据块:', jsonData);

                        if (jsonData.base_resp.status_code !== 0) {
                            throw new Error(`API错误: ${jsonData.base_resp.status_msg}`);
                        }

                        if (jsonData.data.audio) {
                            // 使用 Uint8Array 替代 Buffer
                            const hexString = jsonData.data.audio;
                            const audioData = new Uint8Array(hexString.length / 2);
                            for (let i = 0; i < hexString.length; i += 2) {
                                audioData[i / 2] = parseInt(hexString.substr(i, 2), 16);
                            }
                            audioChunks.push(audioData);

                            if (isFirstChunk) {
                                console.log('[TTS] 收到第一个音频块:', {
                                    size: audioData.length,
                                    status: jsonData.data.status
                                });
                                isFirstChunk = false;
                            }
                        }

                        if (jsonData.data.status === 2) {
                            console.log('[TTS] 收到最后一个音频块');
                            break;
                        }
                    } catch (error) {
                        console.error('[TTS] 解析响应数据失败:', error, '原始数据:', line);
                        throw error;
                    }
                }
            }

            if (audioChunks.length === 0) {
                console.error('[TTS] 未收到任何音频数据，原始响应:', response.data);
                throw new Error('未收到任何音频数据');
            }

            // 合并所有音频块
            const totalLength = audioChunks.reduce((acc, chunk) => acc + chunk.length, 0);
            const combinedAudio = new Uint8Array(totalLength);
            let offset = 0;
            for (const chunk of audioChunks) {
                combinedAudio.set(chunk, offset);
                offset += chunk.length;
            }

            console.log('[TTS] 音频数据合并完成:', {
                totalChunks: audioChunks.length,
                totalSize: combinedAudio.length
            });

            return combinedAudio.buffer;
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
            return this.audioCache.get(cacheKey)!;
        }

        try {
            const audioData = await this.streamTTS(text, character);
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
                this.currentAudioSource.stop();
                this.currentAudioSource = null;
            }

            const audioBuffer = await this.audioContext.decodeAudioData(audioData.slice(0));
            console.log('[TTS] 音频解码成功:', {
                duration: audioBuffer.duration,
                numberOfChannels: audioBuffer.numberOfChannels,
                sampleRate: audioBuffer.sampleRate
            });

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