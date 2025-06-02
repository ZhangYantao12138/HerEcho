import { BaseModel } from './BaseModel';
import { SubscriptionPlan, SubscriptionStatus } from './types';

export interface UserSubscription extends BaseModel {
    id: number;                     // 订阅ID
    user_id: number;                // 用户ID
    plan: SubscriptionPlan;         // 订阅计划类型：免费/基础/高级
    status: SubscriptionStatus;     // 订阅状态：活跃/过期/已取消
    duration_days: number;          // 订阅时长（天）
    amount: number;                 // 订阅金额
    last_payment_at?: Date;         // 最后支付时间
    created_at: Date;               // 创建时间
    updated_at: Date;               // 更新时间
}

export class UserSubscriptionModel extends BaseModel {
    static tableName = 'user_subscriptions';

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['user_id', 'plan', 'status', 'duration_days', 'amount'],
            properties: {
                id: { type: 'integer', minimum: 1 },
                user_id: { type: 'integer', minimum: 1 },
                plan: { type: 'string', enum: ['free', 'basic', 'premium'] },
                status: { type: 'string', enum: ['active', 'expired', 'cancelled'] },
                duration_days: { type: 'integer', minimum: 1 },
                amount: { type: 'number', minimum: 0 },
                last_payment_at: { type: ['string', 'null'], format: 'date-time' },
                created_at: { type: 'string', format: 'date-time' },
                updated_at: { type: 'string', format: 'date-time' }
            }
        };
    }

    static async findById(id: number): Promise<UserSubscription | null> {
        const [subscription] = await this.query<UserSubscription>(
            'SELECT * FROM user_subscriptions WHERE id = ?',
            [id]
        );
        return subscription || null;
    }

    static async findByUserId(userId: number): Promise<UserSubscription[]> {
        return this.query<UserSubscription>(
            'SELECT * FROM user_subscriptions WHERE user_id = ? ORDER BY created_at DESC',
            [userId]
        );
    }

    static async create(subscription: Omit<UserSubscription, 'id' | 'created_at' | 'updated_at'>): Promise<UserSubscription> {
        this.validateRequired(subscription, ['user_id', 'plan', 'status', 'duration_days', 'amount']);
        this.validateEnum(subscription.plan, ['free', 'basic', 'premium']);
        this.validateEnum(subscription.status, ['active', 'expired', 'cancelled']);
        this.validateNumber(subscription.duration_days, 1, 3650); // 最大10年
        this.validateNumber(subscription.amount, 0, 999999);

        const [result] = await this.query<{ insertId: number }>(
            'INSERT INTO user_subscriptions (user_id, plan, status, duration_days, amount, last_payment_at) VALUES (?, ?, ?, ?, ?, ?)',
            [subscription.user_id, subscription.plan, subscription.status, subscription.duration_days, subscription.amount, subscription.last_payment_at]
        );
        return this.findById(result.insertId) as Promise<UserSubscription>;
    }

    static async update(id: number, subscription: Partial<UserSubscription>): Promise<UserSubscription> {
        if (subscription.plan) this.validateEnum(subscription.plan, ['free', 'basic', 'premium']);
        if (subscription.status) this.validateEnum(subscription.status, ['active', 'expired', 'cancelled']);
        if (subscription.duration_days) this.validateNumber(subscription.duration_days, 1, 3650);
        if (subscription.amount) this.validateNumber(subscription.amount, 0, 999999);

        const fields = Object.keys(subscription)
            .filter(key => key !== 'id' && key !== 'created_at' && key !== 'updated_at')
            .map(key => `${this.camelToSnake(key)} = ?`);

        const values = Object.entries(subscription)
            .filter(([key]) => key !== 'id' && key !== 'created_at' && key !== 'updated_at')
            .map(([, value]) => value);

        await this.query(
            `UPDATE user_subscriptions SET ${fields.join(', ')} WHERE id = ?`,
            [...values, id]
        );

        return this.findById(id) as Promise<UserSubscription>;
    }

    static async cancel(id: number): Promise<void> {
        await this.query(
            'UPDATE user_subscriptions SET status = ? WHERE id = ?',
            ['cancelled', id]
        );
    }

    static async getActiveSubscriptions(): Promise<UserSubscription[]> {
        return this.query<UserSubscription>(
            `SELECT * FROM user_subscriptions 
            WHERE status = 'active' 
            AND DATE_ADD(created_at, INTERVAL duration_days DAY) > NOW()`
        );
    }

    static async checkExpiredSubscriptions(): Promise<void> {
        await this.query(
            `UPDATE user_subscriptions 
            SET status = 'expired' 
            WHERE status = 'active' 
            AND DATE_ADD(created_at, INTERVAL duration_days DAY) <= NOW()`
        );
    }
} 