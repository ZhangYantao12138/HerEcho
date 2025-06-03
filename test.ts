import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

interface TTSRequest {
    text: string;
    voice_id: string;
    model: string;
    stream: boolean;
}

async function testTTSAPI() {
    try {
        const request: TTSRequest = {
            text: "这是一条测试消息",
            voice_id: "your_voice_id", // 需要替换为实际的voice_id
            model: "speech-1",
            stream: true
        };

        const response = await axios({
            method: 'post',
            url: process.env.MINIMAX_API_URL,
            headers: {
                'Authorization': `Bearer ${process.env.MINIMAX_API_KEY}`,
                'Content-Type': 'application/json'
            },
            data: request,
            responseType: 'stream'
        });

        // 创建输出目录
        const outputDir = path.join(__dirname, 'output');
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir);
        }

        // 保存音频文件
        const outputPath = path.join(outputDir, 'test_audio.mp3');
        const writer = fs.createWriteStream(outputPath);

        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', () => {
                console.log('音频文件已保存到:', outputPath);
                resolve(outputPath);
            });
            writer.on('error', reject);
        });
    } catch (error) {
        console.error('TTS API调用失败:', error);
        throw error;
    }
}

// 执行测试
testTTSAPI()
    .then(() => console.log('测试完成'))
    .catch(console.error);
