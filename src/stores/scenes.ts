import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

// 分镜数据类型定义
interface Option {
  id: string;
  text: string;
  nextSceneId?: string;
}

interface Scene {
  id: string;
  title: string;
  image: string;
  canReplay: boolean;
  options: Option[];
  description?: string; // 分镜描述，可选
}

// 导入所需资源
import sceneOneImage from '../assets/one.png';

// 创建分镜数据存储
export const useScenesStore = defineStore('scenes', () => {
  // 定义分镜数据
  const scenesData: Record<string, Scene> = {
    // 初始场景
    'scene1': {
      id: 'scene1',
      title: '面对皇后的刁难，你应该怎么办？',
      image: sceneOneImage,
      canReplay: true,
      options: [
        { id: 'A', text: '暗中寻找机会反击皇后', nextSceneId: 'scene2_engagement' },
        { id: 'B', text: '揭发皇后的秘密', nextSceneId: 'scene2_bathroom' },
        { id: 'C', text: '你突然感到一股神秘的力量附身于你...', nextSceneId: 'scene2_rescue' }
      ]
    },
    
    // 分镜1：订婚宴暗流
    'scene2_engagement': {
      id: 'scene2_engagement',
      title: '订婚宴上暗流涌动，你需要决定如何行动',
      image: sceneOneImage, // 需要替换为实际图片
      description: '莱诺家族的订婚宴上，你察觉到了一些异常的气氛...',
      canReplay: true,
      options: [
        { id: 'A', text: '追击蒋伯驾', nextSceneId: 'scene3A_spy' },
        { id: 'B', text: '维持假面', nextSceneId: 'scene3B_canary' },
        { id: 'C', text: '收集情报', nextSceneId: 'scene3C_intel' },
        { id: 'D', text: '联系程聿怀', nextSceneId: 'scene3D_rescue' }
      ]
    },
    
    // 分镜2：浴室囚牢
    'scene2_bathroom': {
      id: 'scene2_bathroom',
      title: '你被困在了豪华浴室中，蒋伯驾正向你走来',
      image: sceneOneImage, // 需要替换为实际图片
      description: '豪华的浴室成了你的囚牢，蒋伯驾正满面笑容地接近...',
      canReplay: true,
      options: [
        { id: 'A', text: '撕裂衬衫', nextSceneId: 'scene3E_tattoo' },
        { id: 'B', text: '呼救未遂', nextSceneId: 'scene3F_silence' },
        { id: 'C', text: '触碰伤痕', nextSceneId: 'scene3G_memory' },
        { id: 'D', text: '支票羞辱', nextSceneId: 'scene3H_explosion' }
      ]
    },
    
    // 分镜3：暴雨救援
    'scene2_rescue': {
      id: 'scene2_rescue',
      title: '暴雨中的危险救援',
      image: sceneOneImage, // 需要替换为实际图片
      description: '雨夜中，你被神秘人物所救，却也面临新的威胁...',
      canReplay: true,
      options: [
        { id: 'A', text: '孤身迎战', nextSceneId: 'scene3I_journalist' },
        { id: 'B', text: '身份质询', nextSceneId: 'scene3J_revelation' },
        { id: 'C', text: '拍摄特写', nextSceneId: 'scene3K_blackmail' },
        { id: 'D', text: '依赖体温', nextSceneId: 'scene3L_key' }
      ]
    },
    
    // 分镜4：真相赌局
    'scene4_truth': {
      id: 'scene4_truth',
      title: '最终的真相赌局',
      image: sceneOneImage, // 需要替换为实际图片
      description: '一切谜团都将在这场危险的赌局中揭晓...',
      canReplay: true,
      options: [
        { id: 'A', text: '玉石俱焚', nextSceneId: 'ending_phoenix' },
        { id: 'B', text: '情绪崩溃', nextSceneId: 'ending_puppet' },
        { id: 'C', text: '制造混乱', nextSceneId: 'ending_justice' }
      ]
    },
    
    // 结局场景 - 这里只列举部分，其余可以继续添加
    'scene3A_spy': {
      id: 'scene3A_spy',
      title: '你追踪蒋伯驾至天台，发现了惊人的秘密',
      image: sceneOneImage,
      description: '你跟踪至天台发现他与羌青瓷密谈莱诺家族阴谋...',
      canReplay: true,
      options: [
        { id: 'A', text: '继续调查', nextSceneId: 'scene4_truth' },
        { id: 'B', text: '隐藏退走', nextSceneId: 'scene4_truth' }
      ]
    },
    
    'scene3B_canary': {
      id: 'scene3B_canary',
      title: '你选择维持表面的平静，但代价是沉重的',
      image: sceneOneImage,
      description: '卢特起疑扣押程走柳护照，你陷入被控制的境地...',
      canReplay: true,
      options: [
        { id: 'A', text: '继续观察', nextSceneId: 'ending_canary' },
        { id: 'B', text: '寻找突破', nextSceneId: 'scene4_truth' }
      ]
    },
    
    // 可以继续添加更多分镜和结局场景...
    
    // 结局
    'ending_phoenix': {
      id: 'ending_phoenix',
      title: '涅槃结局：浴火重生',
      image: sceneOneImage,
      description: '子弹穿透两人心脏引爆炸药库，尸骨中开出并蒂孤挺花...',
      canReplay: true,
      options: [
        { id: 'A', text: '重新开始', nextSceneId: 'scene1' }
      ]
    },
    
    'ending_puppet': {
      id: 'ending_puppet',
      title: '傀儡结局：失去自我',
      image: sceneOneImage,
      description: '被伯纳德注射致幻剂控制，成为新任"劳伦"替身...',
      canReplay: true,
      options: [
        { id: 'A', text: '重新开始', nextSceneId: 'scene1' }
      ]
    },
    
    'ending_justice': {
      id: 'ending_justice',
      title: '审判结局：正义得到伸张',
      image: sceneOneImage,
      description: '引爆天花板砸断伯纳德脊椎，轮椅上的伯纳德被撒该弟弟凌迟...',
      canReplay: true,
      options: [
        { id: 'A', text: '重新开始', nextSceneId: 'scene1' }
      ]
    },
    
    'ending_canary': {
      id: 'ending_canary',
      title: '金丝雀挽歌：沦为宣传工具',
      image: sceneOneImage,
      description: '你最终沦为莱诺家族的宣传工具，失去了自由...',
      canReplay: true,
      options: [
        { id: 'A', text: '重新开始', nextSceneId: 'scene1' }
      ]
    }
  };

  // 当前分镜ID
  const currentSceneId = ref('scene1');
  
  // 计算当前分镜数据
  const currentScene = computed(() => scenesData[currentSceneId.value]);
  
  // 用户选择记录
  const userChoices = ref<Array<{sceneId: string, optionId: string}>>([]);
  
  // 用户解锁的隐藏线索
  const unlockedSecrets = ref<Set<string>>(new Set());
  
  // 选择选项方法
  function selectOption(optionId: string) {
    const currentOptions = currentScene.value.options;
    const selectedOption = currentOptions.find(option => option.id === optionId);
    
    // 记录用户选择
    userChoices.value.push({
      sceneId: currentSceneId.value,
      optionId
    });
    
    // 特殊选择处理 - 可以在这里添加解锁隐藏线索的逻辑
    if (currentSceneId.value === 'scene2_engagement' && optionId === 'A') {
      unlockedSecrets.value.add('spy_line'); // 解锁双面谍影线索
    }
    
    // 如果有下一个场景ID，更新当前场景
    if (selectedOption && selectedOption.nextSceneId) {
      currentSceneId.value = selectedOption.nextSceneId;
      return true;
    }
    
    return false;
  }
  
  // 重播当前分镜
  function replayCurrentScene() {
    // 这里可以添加重置动画或其他逻辑
    console.log(`重播分镜: ${currentSceneId.value}`);
  }
  
  // 重置到开始
  function resetToStart() {
    currentSceneId.value = 'scene1';
    userChoices.value = [];
  }
  
  // 检查是否解锁了特定隐藏线索
  function hasUnlockedSecret(secretId: string): boolean {
    return unlockedSecrets.value.has(secretId);
  }
  
  return {
    currentSceneId,
    currentScene,
    userChoices,
    selectOption,
    replayCurrentScene,
    resetToStart,
    hasUnlockedSecret,
    unlockedSecrets
  };
}); 