import { BaseModel } from './BaseModel';

export interface UserFavorite {
    id: number;
    userId: number;
    characterId: string;
    createdAt: Date;
}

export class UserFavoriteModel extends BaseModel {
    static tableName = 'user_favorites';

    static async findById(id: number): Promise<UserFavorite | null> {
        const [favorite] = await this.query<UserFavorite>(
            'SELECT * FROM user_favorites WHERE id = ?',
            [id]
        );
        return favorite || null;
    }

    static async findByUserId(userId: number): Promise<UserFavorite[]> {
        return this.query<UserFavorite>(
            'SELECT * FROM user_favorites WHERE user_id = ? ORDER BY created_at DESC',
            [userId]
        );
    }

    static async findByCharacterId(characterId: string): Promise<UserFavorite[]> {
        return this.query<UserFavorite>(
            'SELECT * FROM user_favorites WHERE character_id = ? ORDER BY created_at DESC',
            [characterId]
        );
    }

    static async isFavorite(userId: number, characterId: string): Promise<boolean> {
        const [result] = await this.query<{ count: number }>(
            'SELECT COUNT(*) as count FROM user_favorites WHERE user_id = ? AND character_id = ?',
            [userId, characterId]
        );
        return result.count > 0;
    }

    static async create(favorite: Omit<UserFavorite, 'id' | 'createdAt'>): Promise<UserFavorite> {
        const [result] = await this.query<{ insertId: number }>(
            'INSERT INTO user_favorites (user_id, character_id) VALUES (?, ?)',
            [favorite.userId, favorite.characterId]
        );
        return this.findById(result.insertId) as Promise<UserFavorite>;
    }

    static async delete(id: number): Promise<void> {
        await this.query('DELETE FROM user_favorites WHERE id = ?', [id]);
    }

    static async deleteByUserIdAndCharacterId(userId: number, characterId: string): Promise<void> {
        await this.query(
            'DELETE FROM user_favorites WHERE user_id = ? AND character_id = ?',
            [userId, characterId]
        );
    }

    static async getFavoriteCount(characterId: string): Promise<number> {
        const [result] = await this.query<{ count: number }>(
            'SELECT COUNT(*) as count FROM user_favorites WHERE character_id = ?',
            [characterId]
        );
        return result.count;
    }
} 