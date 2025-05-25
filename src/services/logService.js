import { systemPromptConfig } from '../config/promptConfig';
// 远程日志服务的配置
const LOG_ENDPOINT = import.meta.env.VITE_LOG_SERVICE_URL || '';
const LOG_API_KEY = import.meta.env.VITE_LOG_SERVICE_KEY || '';
export async function logCharacterInteraction(characterId, characterName, action) {
    const logEntry = {
        timestamp: new Date().toISOString(),
        type: 'character_interaction',
        characterId,
        characterName,
        message: action
    };
    await sendLog(logEntry);
    // 同时保存到本地存储作为备份
    saveToLocalStorage(logEntry);
}
export async function logViewpointChange(viewpointKey, characterId, characterName) {
    const logEntry = {
        timestamp: new Date().toISOString(),
        type: 'viewpoint_change',
        characterId,
        characterName,
        viewpointKey,
        message: `视角切换到 ${characterName} (${viewpointKey})`
    };
    await sendLog(logEntry);
    saveToLocalStorage(logEntry);
}
async function sendLog(logEntry) {
    if (!LOG_ENDPOINT) {
        console.log('远程日志服务未配置，仅保存到本地存储');
        return;
    }
    try {
        const response = await fetch(LOG_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${LOG_API_KEY}`
            },
            body: JSON.stringify(logEntry)
        });
        if (!response.ok) {
            throw new Error(`日志发送失败: ${response.statusText}`);
        }
    }
    catch (error) {
        console.error('发送日志到远程服务失败:', error);
        // 确保即使远程服务失败，日志也会保存在本地
        saveToLocalStorage(logEntry);
    }
}
function saveToLocalStorage(logEntry) {
    try {
        const key = `character_log_${logEntry.timestamp}`;
        const existingLogs = JSON.parse(localStorage.getItem('character_logs') || '[]');
        existingLogs.push(logEntry);
        // 只保留最近的1000条日志
        if (existingLogs.length > 1000) {
            existingLogs.shift();
        }
        localStorage.setItem('character_logs', JSON.stringify(existingLogs));
    }
    catch (error) {
        console.error('保存日志到本地存储失败:', error);
    }
}
// 获取所有本地存储的日志
export function getLocalLogs() {
    try {
        return JSON.parse(localStorage.getItem('character_logs') || '[]');
    }
    catch (error) {
        console.error('读取本地日志失败:', error);
        return [];
    }
}
// 清除本地日志
export function clearLocalLogs() {
    localStorage.removeItem('character_logs');
}
