import { BaseModel } from './BaseModel';

export interface Story {
    id: string;                     // 剧本ID，格式：B[剧本编号]
    book_id: string;                // 剧本ID，格式：book[剧本编号]
    title: string;                  // 剧本标题
    description: string;            // 剧本描述
    cover_image: string;            // 剧本封面图片
    created_at: Date;              // 创建时间
    updated_at: Date;              // 更新时间
}

export class StoryModel extends BaseModel {
    static tableName = 'stories';

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['id', 'book_id', 'title', 'cover_image'],
            properties: {
                id: { type: 'string', minLength: 1, maxLength: 5 },
                book_id: { type: 'string', minLength: 1, maxLength: 10 },
                title: { type: 'string', minLength: 1, maxLength: 100 },
                description: { type: ['string', 'null'] },
                cover_image: { type: ['string', 'null'] },
                created_at: { type: 'string', format: 'date-time' },
                updated_at: { type: 'string', format: 'date-time' }
            }
        };
    }

    static async findById(id: string): Promise<Story | null> {
        const [story] = await this.query<Story>(
            'SELECT * FROM stories WHERE id = ?',
            [id]
        );
        return story || null;
    }

    static async findByBookId(bookId: string): Promise<Story | null> {
        const [story] = await this.query<Story>(
            'SELECT * FROM stories WHERE book_id = ?',
            [bookId]
        );
        return story || null;
    }

    static async findAll(): Promise<Story[]> {
        return this.query<Story>('SELECT * FROM stories ORDER BY id');
    }

    static async create(story: Omit<Story, 'created_at' | 'updated_at'>): Promise<Story> {
        await this.query(
            'INSERT INTO stories (id, book_id, title, description, cover_image) VALUES (?, ?, ?, ?, ?)',
            [
                story.id,
                story.book_id,
                story.title,
                story.description,
                story.cover_image
            ]
        );
        return this.findById(story.id) as Promise<Story>;
    }

    static async update(id: string, story: Partial<Story>): Promise<Story> {
        const fields = Object.keys(story)
            .filter(key => key !== 'id' && key !== 'created_at' && key !== 'updated_at')
            .map(key => `${this.camelToSnake(key)} = ?`);

        const values = Object.entries(story)
            .filter(([key]) => key !== 'id' && key !== 'created_at' && key !== 'updated_at')
            .map(([, value]) => value);

        await this.query(
            `UPDATE stories SET ${fields.join(', ')} WHERE id = ?`,
            [...values, id]
        );

        return this.findById(id) as Promise<Story>;
    }

    static async delete(id: string): Promise<void> {
        await this.query('DELETE FROM stories WHERE id = ?', [id]);
    }
} 