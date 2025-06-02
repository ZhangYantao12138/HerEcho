import { DatabaseService } from '../services/database/dbService';

export abstract class BaseModel {
    protected static db = DatabaseService.getInstance();

    protected static async query<T>(sql: string, params?: any[]): Promise<T[]> {
        return this.db.query<T>(sql, params);
    }

    protected static camelToSnake(str: string): string {
        return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    }

    protected static snakeToCamel(str: string): string {
        return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    }

    protected static generateId(prefix: string, length: number = 6): string {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const random = Math.floor(Math.random() * Math.pow(10, length)).toString().padStart(length, '0');
        return `${prefix}${year}${month}${day}${random}`;
    }

    protected static validateRequired<T>(data: T, requiredFields: (keyof T)[]): void {
        const missingFields = requiredFields.filter(field => !data[field]);
        if (missingFields.length > 0) {
            throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
        }
    }

    protected static validateLength(str: string, min: number, max: number): void {
        if (str.length < min || str.length > max) {
            throw new Error(`String length must be between ${min} and ${max} characters`);
        }
    }

    protected static validateEnum<T>(value: T, enumValues: T[]): void {
        if (!enumValues.includes(value)) {
            throw new Error(`Invalid value. Must be one of: ${enumValues.join(', ')}`);
        }
    }

    protected static validateNumber(value: number, min: number, max: number): void {
        if (value < min || value > max) {
            throw new Error(`Number must be between ${min} and ${max}`);
        }
    }
} 