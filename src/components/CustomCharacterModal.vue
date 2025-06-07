<script setup lang="ts">
import { ref, watch } from 'vue';

interface Props {
  show: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits(['close', 'start']);

const characterName = ref('');
const characterSetting = ref('');
const isSubmitting = ref(false);

// 清空表单
function clearForm() {
  characterName.value = '';
  characterSetting.value = '';
  isSubmitting.value = false;
}

// 监听弹窗状态变化
watch(() => props.show, (newShow) => {
  if (newShow) {
    clearForm();
  }
});

// 关闭弹窗
function closeModal() {
  emit('close');
}

// 开始对话
async function startChat() {
  if (!characterName.value.trim() || !characterSetting.value.trim()) {
    alert('请填写角色名称和角色设定');
    return;
  }

  isSubmitting.value = true;
  
  try {
    emit('start', {
      characterName: characterName.value.trim(),
      characterSetting: characterSetting.value.trim()
    });
  } catch (error) {
    console.error('创建角色失败:', error);
    alert('创建角色失败，请重试');
  } finally {
    isSubmitting.value = false;
  }
}

// 快速填充示例
function fillExample() {
  characterName.value = '温柔的小猫咪';
  characterSetting.value = `你是一只可爱的小猫咪，性格温柔甜美。你有以下特点：

性格特征：
- 非常温柔体贴，总是关心别人
- 说话时喜欢用"喵~"结尾
- 性格有点害羞，但很善良
- 喜欢撒娇，偶尔会调皮

说话风格：
- 语气温柔甜美
- 经常用可爱的表情
- 喜欢用"呐~"、"嗯嗯~"等语气词
- 对人很亲近，会用亲昵的称呼

兴趣爱好：
- 喜欢温暖的阳光
- 爱吃小鱼干和各种美食
- 喜欢被轻抚头部
- 爱听温柔的音乐`;
}
</script>

<template>
  <div v-if="show" class="modal-overlay" @click="closeModal">
    <div class="custom-character-modal" @click.stop>
      <div class="modal-header">
        <h2 class="modal-title">创建自建角色</h2>
        <button class="close-btn" @click="closeModal">×</button>
      </div>
      
      <div class="dev-tag">测试功能，开发中</div>
      
      <div class="modal-content">
        <div class="form-section">
          <label class="form-label">角色名称</label>
          <input 
            v-model="characterName"
            type="text" 
            class="form-input"
            placeholder="请输入角色名称（如：温柔的小姐姐、酷炫的剑客等）"
            maxlength="20"
          />
        </div>
        
        <div class="form-section">
          <label class="form-label">角色设定</label>
          <div class="textarea-header">
            <span class="char-count">{{ characterSetting.length }}/1000</span>
            <button type="button" class="example-btn" @click="fillExample">
              填充示例
            </button>
          </div>
          <textarea 
            v-model="characterSetting"
            class="form-textarea"
            placeholder="请详细描述你想要的角色特征，包括性格、说话风格、背景故事等。描述越详细，AI的角色扮演效果越好。&#10;&#10;例如：&#10;- 性格特点（温柔、活泼、冷静等）&#10;- 说话风格（正式、可爱、幽默等）&#10;- 角色背景（职业、身份、经历等）&#10;- 特殊技能或爱好&#10;- 对用户的称呼方式"
            maxlength="1000"
            rows="12"
          ></textarea>
        </div>
        
        <div class="tip-section">
          <div class="tip-title">💡 设定小贴士</div>
          <div class="tip-content">
            <p>• 详细的角色设定能让AI更好地理解和扮演角色</p>
            <p>• 可以包含性格、说话方式、背景故事等信息</p>
            <p>• 建议字数在200-800字之间，获得最佳效果</p>
          </div>
        </div>
      </div>
      
      <div class="modal-footer">
        <button class="cancel-btn" @click="closeModal" :disabled="isSubmitting">
          取消
        </button>
        <button 
          class="start-btn" 
          @click="startChat"
          :disabled="isSubmitting || !characterName.trim() || !characterSetting.trim()"
        >
          <span v-if="isSubmitting">创建中...</span>
          <span v-else>开始对话</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
}

.custom-character-modal {
  background-color: #1e1e1e;
  border-radius: 16px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  color: white;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.dev-tag {
  background-color: #ff9800;
  color: #000;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  margin: -8px 24px 16px;
  display: inline-block;
}

.modal-title {
  margin: 0;
  font-size: 20px;
  font-weight: bold;
  color: white;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #bbb;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
}

.modal-content {
  padding: 20px 24px;
}

.form-section {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #f0f0f0;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  background-color: #2a2a2a;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: white;
  font-size: 14px;
  transition: border-color 0.2s ease;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #3498db;
}

.textarea-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.char-count {
  font-size: 12px;
  color: #888;
}

.example-btn {
  background: linear-gradient(45deg, #3498db, #2ecc71);
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.example-btn:hover {
  opacity: 0.8;
}

.form-textarea {
  width: 100%;
  padding: 12px 16px;
  background-color: #2a2a2a;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: white;
  font-size: 14px;
  line-height: 1.5;
  resize: vertical;
  min-height: 120px;
  font-family: inherit;
  transition: border-color 0.2s ease;
  box-sizing: border-box;
}

.form-textarea:focus {
  outline: none;
  border-color: #3498db;
}

.tip-section {
  background-color: rgba(52, 152, 219, 0.1);
  border: 1px solid rgba(52, 152, 219, 0.3);
  border-radius: 8px;
  padding: 16px;
  margin-top: 16px;
}

.tip-title {
  font-weight: 500;
  color: #3498db;
  margin-bottom: 8px;
}

.tip-content p {
  margin: 4px 0;
  font-size: 13px;
  color: #bbb;
  line-height: 1.4;
}

.modal-footer {
  display: flex;
  gap: 12px;
  padding: 16px 24px 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.cancel-btn, .start-btn {
  flex: 1;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.cancel-btn {
  background-color: #404040;
  color: white;
}

.cancel-btn:hover:not(:disabled) {
  background-color: #505050;
}

.start-btn {
  background: linear-gradient(45deg, #3498db, #2ecc71);
  color: white;
}

.start-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
}

.start-btn:disabled, .cancel-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* 滚动条样式 */
.custom-character-modal::-webkit-scrollbar {
  width: 6px;
}

.custom-character-modal::-webkit-scrollbar-track {
  background: #2a2a2a;
}

.custom-character-modal::-webkit-scrollbar-thumb {
  background: #555;
  border-radius: 3px;
}

.custom-character-modal::-webkit-scrollbar-thumb:hover {
  background: #666;
}
</style> 