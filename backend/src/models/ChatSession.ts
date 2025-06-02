import { BaseModel } from './BaseModel';

export interface ChatSession {
    id: number;
    userId: number;
    sessionId: string;
    characterId: string;
    startedAt: Date;
    endedAt?: Date;
}

export class ChatSessionModel extends BaseModel {
    static tableName = 'user_sessions';

    static async findById(id: number): Promise<ChatSession | null> {
        const [session] = await this.query<ChatSession>(
            'SELECT * FROM user_sessions WHERE id = ?',
            [id]
        );
        return session || null;
    }

    static async findBySessionId(sessionId: string): Promise<ChatSession | null> {
        const [session] = await this.query<ChatSession>(
            'SELECT * FROM user_sessions WHERE session_id = ?',
            [sessionId]
        );
        return session || null;
    }

    static async findByUserId(userId: number): Promise<ChatSession[]> {
        return this.query<ChatSession>(
            'SELECT * FROM user_sessions WHERE user_id = ? ORDER BY started_at DESC',
            [userId]
        );
    }

    static async create(session: Omit<ChatSession, 'id' | 'startedAt' | 'endedAt'>): Promise<ChatSession> {
        const [result] = await this.query<{ insertId: number }>(
            'INSERT INTO user_sessions (user_id, session_id, character_id) VALUES (?, ?, ?)',
            [session.userId, session.sessionId, session.characterId]
        );
        return this.findById(result.insertId) as Promise<ChatSession>;
    }

    static async endSession(id: number): Promise<void> {
        await this.query(
            'UPDATE user_sessions SET ended_at = CURRENT_TIMESTAMP WHERE id = ?',
            [id]
        );
    }

    static async delete(id: number): Promise<void> {
        await this.query('DELETE FROM user_sessions WHERE id = ?', [id]);
    }

    static async getActiveSessions(userId: number): Promise<ChatSession[]> {
        return this.query<ChatSession>(
            'SELECT * FROM user_sessions WHERE user_id = ? AND ended_at IS NULL ORDER BY started_at DESC',
            [userId]
        );
    }
} 