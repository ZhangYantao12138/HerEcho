import { defineStore } from 'pinia'

interface Option {
    id: string
    text: string
    content?: string
    nextSceneId?: string
    specialEffect?: string
    consequences?: {
        unlockStoryline?: string
        triggerEnding?: string
        unlockClue?: string
        triggerEvent?: string
        nextSceneId?: string
    }
}

interface Scene {
    id: string
    title: string
    description: string
    options?: Option[]
}

interface Ending {
    id: string
    title: string
    description: string
    type: 'BE' | 'NE' | 'TE' | 'HE' // Bad/Normal/True/Hidden Ending
}

interface GameState {
    currentSceneId: string
    scenes: Scene[]
    showOptionDialog: boolean
    currentOption: Option | null
    unlockedEffects: string[]
    unlockedStorylines: string[]
    collectedClues: string[]
    memoryFlashbackCount: number
    harmToJiangCount: number
    endings: Ending[]
    activeEnding: string | null
    currentStoryId: string
}

export const useDreamStore = defineStore('dream', {
    state: (): GameState => ({
        currentSceneId: '',
        scenes: [],
        showOptionDialog: false,
        currentOption: null,
        unlockedEffects: [],
        unlockedStorylines: [],
        collectedClues: [],
        memoryFlashbackCount: 0,
        harmToJiangCount: 0,
        endings: [],
        activeEnding: null,
        currentStoryId: ''
    }),

    getters: {
        currentScene(): Scene | undefined {
            return this.scenes.find(scene => scene.id === this.currentSceneId)
        },

        hasUnlockedHiddenEnding(): boolean {
            return this.harmToJiangCount >= 3 ||
                this.memoryFlashbackCount >= 2 ||
                this.hasCollectedAllDeathClues
        },

        hasCollectedAllDeathClues(): boolean {
            const requiredClues = ['撒该之死', '劳伦之死', '母亲之死']
            return requiredClues.every(clue => this.collectedClues.includes(clue))
        }
    },

    actions: {
        initializeStory(storyId: string) {
            console.log('初始化故事:', storyId);
            this.currentStoryId = storyId;

            // 重置状态
            this.showOptionDialog = false;
            this.currentOption = null;
            this.unlockedEffects = [];
            this.unlockedStorylines = [];
            this.collectedClues = [];
            this.memoryFlashbackCount = 0;
            this.harmToJiangCount = 0;
            this.activeEnding = null;

            // 初始化场景
            this.initializeScenes();

            // 设置初始场景
            this.currentSceneId = 'scene1';
        },

        resetToStart() {
            this.initializeScenes()
            this.currentSceneId = 'scene1'
            this.showOptionDialog = false
            this.currentOption = null
            this.unlockedEffects = []
            this.unlockedStorylines = []
            this.collectedClues = []
            this.memoryFlashbackCount = 0
            this.harmToJiangCount = 0
            this.activeEnding = null
        },

        initializeScenes() {
            this.scenes = [
                {
                    id: 'scene1',
                    title: '订婚宴暗流',
                    description: '在这场表面平静的订婚宴上，暗流涌动...',
                    options: [
                        {
                            id: 'scene1_opt1',
                            text: '追击蒋伯驾',
                            content: '你决定跟踪蒋伯驾，来到了天台...',
                            consequences: {
                                unlockStoryline: '双面谍影',
                                nextSceneId: 'scene2'
                            }
                        },
                        {
                            id: 'scene1_opt2',
                            text: '维持假面',
                            content: '你选择继续维持表面的平静...',
                            consequences: {
                                triggerEnding: '金丝雀挽歌'
                            }
                        },
                        {
                            id: 'scene1_opt3',
                            text: '收集情报',
                            content: '你仔细聆听着周围的谈话...',
                            consequences: {
                                unlockClue: '圣女计划',
                                nextSceneId: 'scene2'
                            }
                        },
                        {
                            id: 'scene1_opt4',
                            text: '联系程聿怀',
                            content: '你冒险联系了程聿怀...',
                            consequences: {
                                triggerEvent: '血亲保护机制',
                                nextSceneId: 'scene2'
                            }
                        }
                    ]
                },
                {
                    id: 'scene2',
                    title: '浴室囚牢',
                    description: '在这个密闭的空间里，真相与谎言交织...',
                    options: [
                        {
                            id: 'scene2_opt1',
                            text: '撕裂衬衫',
                            content: '你猛地撕开他的衬衫...',
                            consequences: {
                                unlockClue: '缪家毒蛇纹身'
                            }
                        },
                        {
                            id: 'scene2_opt2',
                            text: '呼救未遂',
                            content: '你试图呼救，但情况变得更糟...',
                            consequences: {
                                triggerEnding: '流放结局'
                            }
                        },
                        {
                            id: 'scene2_opt3',
                            text: '触碰伤痕',
                            content: '你轻轻触碰那道伤痕...',
                            consequences: {
                                triggerEvent: '记忆闪回'
                            }
                        },
                        {
                            id: 'scene2_opt4',
                            text: '支票羞辱',
                            content: '你掏出支票，试图羞辱他...',
                            consequences: {
                                triggerEnding: '灰烬情书'
                            }
                        }
                    ]
                },
                {
                    id: 'scene3',
                    title: '暴雨救援',
                    description: '暴雨中的真相往往伴随着鲜血...',
                    options: [
                        {
                            id: 'scene3_opt1',
                            text: '孤身迎战',
                            content: '你选择独自面对危险...',
                            consequences: {
                                unlockStoryline: '独手战鹰'
                            }
                        },
                        {
                            id: 'scene3_opt2',
                            text: '身份质询',
                            content: '你决定质问他的真实身份...',
                            consequences: {
                                triggerEvent: '身份揭露'
                            }
                        },
                        {
                            id: 'scene3_opt3',
                            text: '拍摄特写',
                            content: '你抓拍下关键证据...',
                            consequences: {
                                triggerEvent: '媒体战'
                            }
                        },
                        {
                            id: 'scene3_opt4',
                            text: '依赖体温',
                            content: '在高烧中，你无意识地说出了真相...',
                            consequences: {
                                unlockClue: '父亲死亡真相'
                            }
                        }
                    ]
                },
                {
                    id: 'scene4',
                    title: '真相赌局',
                    description: '最后的对决，一切将在此揭晓...',
                    options: [
                        {
                            id: 'scene4_opt1',
                            text: '玉石俱焚',
                            content: '你选择与他同归于尽...',
                            consequences: {
                                triggerEnding: '涅槃结局'
                            }
                        },
                        {
                            id: 'scene4_opt2',
                            text: '情绪崩溃',
                            content: '你的精神终于崩溃...',
                            consequences: {
                                triggerEnding: '傀儡结局'
                            }
                        },
                        {
                            id: 'scene4_opt3',
                            text: '制造混乱',
                            content: '你果断引爆了天花板...',
                            consequences: {
                                triggerEnding: '审判结局'
                            }
                        },
                        {
                            id: 'scene4_opt4',
                            text: '血色拥吻',
                            content: '你用最后的方式传递了真相...',
                            consequences: {
                                triggerEnding: '黎明结局'
                            }
                        }
                    ]
                }
            ]

            this.endings = [
                {
                    id: 'golden_cage',
                    title: '金丝雀挽歌',
                    description: '你成为了莱诺家族的宣传工具...',
                    type: 'BE'
                },
                {
                    id: 'ashes_letter',
                    title: '灰烬情书',
                    description: '在火光中，你们的故事化为灰烬...',
                    type: 'BE'
                },
                {
                    id: 'nirvana',
                    title: '涅槃重生',
                    description: '在废墟中开出了并蒂孤挺花...',
                    type: 'TE'
                },
                {
                    id: 'dawn',
                    title: '黎明曙光',
                    description: '三年后，你终于站上了胜利的领奖台...',
                    type: 'HE'
                },
                {
                    id: 'dark_transformation',
                    title: '黑化',
                    description: '你继承了伯纳德的衣钵，成为新的暗影...',
                    type: 'HE'
                }
            ]
        },

        selectOption(optionId: string): boolean {
            const currentScene = this.currentScene
            if (!currentScene) return false

            const selectedOption = currentScene.options?.find(opt => opt.id === optionId)
            if (!selectedOption) return false

            this.currentOption = selectedOption
            this.showOptionDialog = true

            // 处理选项后果
            if (selectedOption.consequences) {
                const { unlockStoryline, triggerEnding, unlockClue, triggerEvent } = selectedOption.consequences

                if (unlockStoryline && !this.unlockedStorylines.includes(unlockStoryline)) {
                    this.unlockedStorylines.push(unlockStoryline)
                }

                if (unlockClue && !this.collectedClues.includes(unlockClue)) {
                    this.collectedClues.push(unlockClue)
                }

                if (triggerEvent === '记忆闪回') {
                    this.memoryFlashbackCount++
                }

                // 检查是否触发特殊结局
                if (this.harmToJiangCount >= 3) {
                    this.activeEnding = 'dark_transformation'
                } else if (triggerEnding) {
                    this.activeEnding = triggerEnding
                }
            }

            return true
        },

        continueToNextScene(): boolean {
            if (!this.currentOption?.consequences?.nextSceneId) {
                this.showOptionDialog = false
                this.currentOption = null
                return false
            }

            this.currentSceneId = this.currentOption.consequences.nextSceneId
            this.showOptionDialog = false
            this.currentOption = null
            return true
        },

        // 检查是否满足特殊结局条件
        checkSpecialEndings() {
            if (this.hasCollectedAllDeathClues) {
                this.unlockedStorylines.push('真相子弹')
            }
            if (this.memoryFlashbackCount >= 2) {
                this.unlockedStorylines.push('时溯系统')
            }
        }
    }
}) 