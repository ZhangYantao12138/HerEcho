// 消息来源类型
export type MessageSource = 'userInput' | 'autoReplyOption' | 'character';

// 消息类型（用于统计）
export type MessageType = 0 | 1 | 2 | 3 | 10;

// 用户角色
export type UserRole = 'user' | 'admin';

// 用户状态
export type UserStatus = 'active' | 'inactive' | 'banned';

// 订阅计划类型
export type SubscriptionPlan = 'free' | 'basic' | 'premium';

// 订阅状态
export type SubscriptionStatus = 'active' | 'expired' | 'cancelled';

// 消息来源到消息类型的映射
export const messageSourceToType: Record<MessageSource, MessageType> = {
    userInput: 0,
    autoReplyOption: 1,
    character: 2
};

// 消息类型到消息来源的映射
export const messageTypeToSource: Record<MessageType, MessageSource> = {
    0: 'userInput',
    1: 'autoReplyOption',
    2: 'character',
    3: 'autoReplyOption',
    10: 'userInput'
}; 