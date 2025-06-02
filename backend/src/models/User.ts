import { BaseModel } from './BaseModel';
import { UserRole, UserStatus } from './types';

export interface User extends BaseModel {
    id: number;                     // 用户ID
    username: string;               // 用户名
    email: string;                  // 电子邮箱
    password_hash: string;          // 密码哈希值
    nickname?: string;              // 用户昵称
    role: UserRole;                 // 用户角色：普通用户/管理员
    status: UserStatus;             // 用户状态：活跃/非活跃/封禁
    last_login_at?: Date;           // 最后登录时间
    created_at: Date;               // 创建时间
    updated_at: Date;               // 更新时间
}

export class UserModel extends BaseModel {
    static tableName = 'users';

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['username', 'email', 'password_hash', 'role', 'status'],
            properties: {
                id: { type: 'integer', minimum: 1 },
                username: { type: 'string', minLength: 3, maxLength: 50 },
                email: { type: 'string', format: 'email', maxLength: 100 },
                password_hash: { type: 'string', minLength: 1, maxLength: 255 },
                nickname: { type: ['string', 'null'], maxLength: 50 },
                role: { type: 'string', enum: ['user', 'admin'] },
                status: { type: 'string', enum: ['active', 'inactive', 'banned'] },
                last_login_at: { type: ['string', 'null'], format: 'date-time' },
                created_at: { type: 'string', format: 'date-time' },
                updated_at: { type: 'string', format: 'date-time' }
            }
        };
    }

    static async findById(id: number): Promise<User | null> {
        const [user] = await this.query<User>(
            'SELECT * FROM users WHERE id = ?',
            [id]
        );
        return user || null;
    }

    static async findByUsername(username: string): Promise<User | null> {
        const [user] = await this.query<User>(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );
        return user || null;
    }

    static async findByEmail(email: string): Promise<User | null> {
        const [user] = await this.query<User>(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );
        return user || null;
    }

    static async create(user: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
        this.validateRequired(user, ['username', 'email', 'password_hash', 'role', 'status']);
        this.validateLength(user.username, 3, 50);
        this.validateLength(user.email, 5, 100);
        this.validateEnum(user.role, ['user', 'admin']);
        this.validateEnum(user.status, ['active', 'inactive', 'banned']);

        const [result] = await this.query<{ insertId: number }>(
            'INSERT INTO users (username, email, password_hash, nickname, role, status) VALUES (?, ?, ?, ?, ?, ?)',
            [user.username, user.email, user.password_hash, user.nickname, user.role, user.status]
        );
        return this.findById(result.insertId) as Promise<User>;
    }

    static async update(id: number, user: Partial<User>): Promise<User> {
        if (user.username) this.validateLength(user.username, 3, 50);
        if (user.email) this.validateLength(user.email, 5, 100);
        if (user.role) this.validateEnum(user.role, ['user', 'admin']);
        if (user.status) this.validateEnum(user.status, ['active', 'inactive', 'banned']);

        const fields = Object.keys(user)
            .filter(key => key !== 'id' && key !== 'created_at' && key !== 'updated_at')
            .map(key => `${this.camelToSnake(key)} = ?`);

        const values = Object.entries(user)
            .filter(([key]) => key !== 'id' && key !== 'created_at' && key !== 'updated_at')
            .map(([, value]) => value);

        await this.query(
            `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
            [...values, id]
        );

        return this.findById(id) as Promise<User>;
    }

    static async updateLastLogin(id: number): Promise<void> {
        await this.query(
            'UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?',
            [id]
        );
    }

    static async delete(id: number): Promise<void> {
        await this.query('DELETE FROM users WHERE id = ?', [id]);
    }

    static async getActiveSubscription(userId: number): Promise<any> {
        const [subscription] = await this.query(
            `SELECT * FROM user_subscriptions 
            WHERE user_id = ? AND status = 'active' 
            AND DATE_ADD(created_at, INTERVAL duration_days DAY) > NOW()
            ORDER BY created_at DESC LIMIT 1`,
            [userId]
        );
        return subscription;
    }
} 