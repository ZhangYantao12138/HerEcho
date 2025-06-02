import { TTSCacheConfig, TTSCacheItem } from '../types/tts'
import axios from 'axios'

const defaultConfig: TTSCacheConfig = {
    enabled: import.meta.env.VITE_TTS_CACHE_ENABLED === 'true',
    dir: import.meta.env.VITE_TTS_CACHE_DIR || './cache/tts',
    maxAge: parseInt(import.meta.env.VITE_TTS_CACHE_MAX_AGE || '86400000'), // 默认24小时
    maxSize: parseInt(import.meta.env.VITE_TTS_CACHE_MAX_SIZE || '104857600') // 默认100MB
}

class TTSCacheService {
    private cache: Map<string, TTSCacheItem> = new Map()
    private config: TTSCacheConfig

    constructor(config: Partial<TTSCacheConfig> = {}) {
        this.config = { ...defaultConfig, ...config }
        this.initCache()
    }

    private async initCache() {
        if (!this.config.enabled) return

        try {
            // 从本地存储加载缓存索引
            const cacheIndex = localStorage.getItem('tts_cache_index')
            if (cacheIndex) {
                const items = JSON.parse(cacheIndex) as TTSCacheItem[]
                items.forEach(item => this.cache.set(item.text, item))
            }

            // 清理过期缓存
            await this.cleanExpiredCache()
        } catch (error) {
            console.error('Failed to initialize TTS cache:', error)
        }
    }

    private async cleanExpiredCache() {
        const now = Date.now()
        for (const [text, item] of this.cache.entries()) {
            if (now - item.timestamp > this.config.maxAge) {
                this.cache.delete(text)
                try {
                    // 删除本地缓存文件
                    await this.deleteCacheFile(item.taskId)
                } catch (error) {
                    console.error(`Failed to delete cache file for ${item.taskId}:`, error)
                }
            }
        }
        this.saveCacheIndex()
    }

    private async deleteCacheFile(taskId: string) {
        try {
            const response = await axios.delete(`/api/tts/cache/${taskId}`)
            return response.data
        } catch (error) {
            console.error('Failed to delete cache file:', error)
            throw error
        }
    }

    private saveCacheIndex() {
        if (!this.config.enabled) return
        const items = Array.from(this.cache.values())
        localStorage.setItem('tts_cache_index', JSON.stringify(items))
    }

    async getCachedAudio(text: string): Promise<string | null> {
        if (!this.config.enabled) return null

        const item = this.cache.get(text)
        if (!item) return null

        // 检查是否过期
        if (Date.now() - item.timestamp > this.config.maxAge) {
            this.cache.delete(text)
            this.saveCacheIndex()
            return null
        }

        return item.audioUrl
    }

    async cacheAudio(text: string, audioUrl: string): Promise<void> {
        if (!this.config.enabled) return

        const item: TTSCacheItem = {
            taskId: this.generateTaskId(),
            audioUrl,
            text,
            timestamp: Date.now(),
            size: 0 // 实际大小需要从服务器获取
        }

        this.cache.set(text, item)
        this.saveCacheIndex()

        // 检查缓存大小
        await this.checkCacheSize()
    }

    private generateTaskId(): string {
        return `tts_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }

    private async checkCacheSize() {
        let totalSize = 0
        for (const item of this.cache.values()) {
            totalSize += item.size
        }

        if (totalSize > this.config.maxSize) {
            // 按时间排序，删除最旧的缓存
            const sortedItems = Array.from(this.cache.values())
                .sort((a, b) => a.timestamp - b.timestamp)

            while (totalSize > this.config.maxSize && sortedItems.length > 0) {
                const item = sortedItems.shift()
                if (item) {
                    totalSize -= item.size
                    this.cache.delete(item.text)
                    await this.deleteCacheFile(item.taskId)
                }
            }

            this.saveCacheIndex()
        }
    }
}

export const ttsCacheService = new TTSCacheService() 