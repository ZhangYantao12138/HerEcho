/**
 * 聊天消息类型
 */
export interface Message {
    id: number;
    content: string;
    isUser: boolean;
    hasAudio: boolean;
}
