import { BaseModel } from './BaseModel';

export type Theme = 'light' | 'dark' | 'system';

export interface UserPreference {
    id: number;
    userId: number;
    theme: Theme;
    language: string;
    notificationEnabled: boolean;
    autoSaveChat: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export class UserPreferenceModel extends BaseModel {
    static tableName = 'user_preferences';

    static async findByUserId(userId: number): Promise<UserPreference | null> {
        const [preference] = await this.query<UserPreference>(
            'SELECT * FROM user_preferences WHERE user_id = ?',
            [userId]
        );
        return preference || null;
    }

    static async create(preference: Omit<UserPreference, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserPreference> {
        const [result] = await this.query<{ insertId: number }>(
            'INSERT INTO user_preferences (user_id, theme, language, notification_enabled, auto_save_chat) VALUES (?, ?, ?, ?, ?)',
            [preference.userId, preference.theme, preference.language, preference.notificationEnabled, preference.autoSaveChat]
        );
        return this.findByUserId(preference.userId) as Promise<UserPreference>;
    }

    static async update(userId: number, preference: Partial<UserPreference>): Promise<UserPreference> {
        const fields = Object.keys(preference)
            .filter(key => key !== 'id' && key !== 'userId' && key !== 'createdAt' && key !== 'updatedAt')
            .map(key => `${this.camelToSnake(key)} = ?`);

        const values = Object.entries(preference)
            .filter(([key]) => key !== 'id' && key !== 'userId' && key !== 'createdAt' && key !== 'updatedAt')
            .map(([, value]) => value);

        await this.query(
            `UPDATE user_preferences SET ${fields.join(', ')} WHERE user_id = ?`,
            [...values, userId]
        );

        return this.findByUserId(userId) as Promise<UserPreference>;
    }

    static async delete(userId: number): Promise<void> {
        await this.query('DELETE FROM user_preferences WHERE user_id = ?', [userId]);
    }

    static async getOrCreateDefault(userId: number): Promise<UserPreference> {
        const preference = await this.findByUserId(userId);
        if (preference) {
            return preference;
        }

        return this.create({
            userId,
            theme: 'system',
            language: 'zh-CN',
            notificationEnabled: true,
            autoSaveChat: true
        });
    }
} 