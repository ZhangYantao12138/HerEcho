import { StoryModel } from '../models/Story';
import { DatabaseService } from '../services/database/dbService';

// 剧本数据接口
interface StoryData {
    id: string;           // 剧本ID，格式：B[剧本编号]
    book_id: string;      // 剧本ID，格式：book[剧本编号]
    title: string;        // 剧本标题
    description: string;  // 剧本描述
    cover_image: string;  // 剧本封面图片
}

// 示例剧本数据
const stories: StoryData[] = [
    {
        id: 'B001',
        book_id: 'book001',
        title: '流氓叙事',
        cover_image: 'script001_lmxs.jpg',
        description: '在心理医院的背景下，展开一段关于治愈与救赎的故事。你将与羌青瓷、程聿怀等角色相遇，探索他们之间复杂的情感纠葛。'
    },
    {
        id: 'B002',
        book_id: 'book002',
        title: '阙落',
        cover_image: 'script002_ql.jpg',
        description: '一个发生在古代的故事，敬请期待...'
    }
    // 在这里添加更多剧本数据
];

async function seedStories() {
    try {
        // 获取数据库服务实例
        const db = DatabaseService.getInstance();

        // 清空stories表
        await db.query('DELETE FROM stories');
        console.log('已清空stories表');

        // 插入剧本数据
        for (const story of stories) {
            try {
                await StoryModel.create(story);
                console.log(`成功创建剧本: ${story.title}`);
            } catch (error) {
                console.error(`创建剧本 ${story.title} 失败:`, error);
            }
        }

        console.log('剧本数据填充完成');
    } catch (error) {
        console.error('填充剧本数据时发生错误:', error);
    }
}

// 执行填充
seedStories(); 