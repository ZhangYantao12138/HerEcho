import mongoose from 'mongoose';
declare class DatabaseService {
    private static instance;
    private isConnected;
    private constructor();
    static getInstance(): DatabaseService;
    connect(): Promise<void>;
    logChat(data: {
        userId: string;
        sessionId: string;
        role: string;
        messageType: 'user' | 'assistant';
        inputMethod: 'auto' | 'manual';
        message: string;
        round: number;
        metadata: {
            responseTime: number;
            tokensUsed: number;
        };
    }): Promise<void>;
    private updateUserStats;
    getUserStats(userId: string): Promise<(mongoose.Document<unknown, {}, {
        totalSessions: number;
        totalMessages: number;
        averageSessionLength: number;
        autoReplyUsage: number;
        manualInputUsage: number;
        lastActive: NativeDate;
        userId?: string | null | undefined;
        preferredRoles?: any;
    }, {}> & {
        totalSessions: number;
        totalMessages: number;
        averageSessionLength: number;
        autoReplyUsage: number;
        manualInputUsage: number;
        lastActive: NativeDate;
        userId?: string | null | undefined;
        preferredRoles?: any;
    } & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }) | null>;
    exportChatLogs(filters?: any): Promise<(mongoose.Document<unknown, {}, {
        timestamp: NativeDate;
        metadata?: any;
        userId?: string | null | undefined;
        sessionId?: string | null | undefined;
        role?: string | null | undefined;
        message?: string | null | undefined;
        round?: number | null | undefined;
        messageType?: "user" | "assistant" | null | undefined;
        inputMethod?: "auto" | "manual" | null | undefined;
    }, {}> & {
        timestamp: NativeDate;
        metadata?: any;
        userId?: string | null | undefined;
        sessionId?: string | null | undefined;
        role?: string | null | undefined;
        message?: string | null | undefined;
        round?: number | null | undefined;
        messageType?: "user" | "assistant" | null | undefined;
        inputMethod?: "auto" | "manual" | null | undefined;
    } & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    })[]>;
}
export default DatabaseService;
