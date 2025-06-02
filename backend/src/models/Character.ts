import { BaseModel } from './BaseModel';

export interface Character extends BaseModel {
    id: string;                     // 角色ID，格式：B[剧本编号]C[角色编号]
    name: string;                   // 角色名称
    background_description?: string; // 角色背景描述
    relationships?: string;         // 角色关系描述
    system_prompt: string;          // 角色系统提示词
    voice_id?: string;             // 角色TTS音色ID
    voice_speed?: number;          // 语音播放速度
    voice_pitch?: number;          // 语音音调
    voice_volume?: number;         // 语音音量
    fallback_reply: string;        // 回退回复，用于API连接失败时的默认回复
    created_at: Date;              // 创建时间
    updated_at: Date;              // 更新时间
}

export class CharacterModel extends BaseModel {
    static tableName = 'characters';

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['id', 'name', 'system_prompt', 'fallback_reply'],
            properties: {
                id: { type: 'string', minLength: 1, maxLength: 10 },
                name: { type: 'string', minLength: 1, maxLength: 50 },
                background_description: { type: ['string', 'null'] },
                relationships: { type: ['string', 'null'] },
                system_prompt: { type: 'string', minLength: 1 },
                voice_id: { type: ['string', 'null'], maxLength: 50 },
                voice_speed: { type: ['number', 'null'], minimum: 0.5, maximum: 2.0 },
                voice_pitch: { type: ['number', 'null'], minimum: 0.5, maximum: 2.0 },
                voice_volume: { type: ['number', 'null'], minimum: 0.0, maximum: 1.0 },
                fallback_reply: { type: 'string', minLength: 1 },
                created_at: { type: 'string', format: 'date-time' },
                updated_at: { type: 'string', format: 'date-time' }
            }
        };
    }

    static async findById(id: string): Promise<Character | null> {
        const [character] = await this.query<Character>(
            'SELECT * FROM characters WHERE id = ?',
            [id]
        );
        return character || null;
    }

    static async findByStoryId(storyId: string): Promise<Character[]> {
        return this.query<Character>(
            'SELECT * FROM characters WHERE id LIKE ?',
            [`${storyId}%`]
        );
    }

    static async create(character: Omit<Character, 'created_at' | 'updated_at'>): Promise<Character> {
        const [result] = await this.query<{ insertId: number }>(
            'INSERT INTO characters (id, name, background_description, relationships, system_prompt, voice_id, voice_speed, voice_pitch, voice_volume, fallback_reply) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                character.id,
                character.name,
                character.background_description,
                character.relationships,
                character.system_prompt,
                character.voice_id,
                character.voice_speed,
                character.voice_pitch,
                character.voice_volume,
                character.fallback_reply
            ]
        );
        return this.findById(character.id) as Promise<Character>;
    }

    static async update(id: string, character: Partial<Character>): Promise<Character> {
        const fields = Object.keys(character)
            .filter(key => key !== 'id' && key !== 'createdAt' && key !== 'updatedAt')
            .map(key => `${this.camelToSnake(key)} = ?`);

        const values = Object.entries(character)
            .filter(([key]) => key !== 'id' && key !== 'createdAt' && key !== 'updatedAt')
            .map(([, value]) => value);

        await this.query(
            `UPDATE characters SET ${fields.join(', ')} WHERE id = ?`,
            [...values, id]
        );

        return this.findById(id) as Promise<Character>;
    }

    static async delete(id: string): Promise<void> {
        await this.query('DELETE FROM characters WHERE id = ?', [id]);
    }
} 