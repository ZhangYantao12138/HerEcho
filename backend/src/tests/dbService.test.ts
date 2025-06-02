import { DatabaseService } from '../services/database/dbService';
import { expect } from 'chai';

interface QueryResult {
    test?: number;
    value?: string;
    [key: string]: any;
}

describe('DatabaseService', () => {
    let dbService: DatabaseService;

    before(async () => {
        dbService = DatabaseService.getInstance();
    });

    describe('单例模式', () => {
        it('应该返回相同的实例', () => {
            const instance1 = DatabaseService.getInstance();
            const instance2 = DatabaseService.getInstance();
            expect(instance1).to.equal(instance2);
        });
    });

    describe('查询功能', () => {
        it('应该能执行基本查询', async () => {
            const result = await dbService.query('SELECT 1 as test') as QueryResult[];
            expect(result[0].test).to.equal(1);
        });

        it('应该能处理带参数的查询', async () => {
            const result = await dbService.query('SELECT ? as value', ['test']) as QueryResult[];
            expect(result[0].value).to.equal('test');
        });
    });

    describe('事务功能', () => {
        it('应该能执行事务', async () => {
            const result = await dbService.transaction(async (connection) => {
                await connection.query('SELECT 1 as test');
                return { success: true };
            });
            expect(result.success).to.be.true;
        });

        it('应该在错误时回滚事务', async () => {
            try {
                await dbService.transaction(async (connection) => {
                    await connection.query('SELECT 1 as test');
                    throw new Error('测试错误');
                });
                expect.fail('应该抛出错误');
            } catch (error: any) {
                expect(error.message).to.equal('测试错误');
            }
        });
    });
}); 