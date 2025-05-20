#!/bin/bash

# 修复CharacterChatPage.vue中的错误
sed -i '' 's/const newCharacter = ref<Character | null>(null);/\/\/ 移除未使用的变量/' src/components/CharacterChatPage.vue

# 修复ChatHeader.vue中的错误
sed -i '' 's/const props = defineProps<{/defineProps<{/' src/components/ChatHeader.vue

# 修复ChatPage.vue中的错误
sed -i '' 's/import { RiArrowUpSLine, RiDeleteBin2Line, RiTestTubeLine } from/import { RiArrowUpSLine, RiDeleteBin2Line } from/' src/components/ChatPage.vue

# 修复ChatPage.vue中的组件属性错误
sed -i '' 's/:roleName="currentCharacter.name"/:currentCharacter="currentCharacter"/' src/components/ChatPage.vue
sed -i '' 's/:onTestApi="testApiConnection"//' src/components/ChatPage.vue

# 修复config/characters.ts中的未使用类型
sed -i '' 's/import type { Character, Message, SceneInfo } from/import type { Character } from/' src/config/characters.ts

echo "修复完成" 