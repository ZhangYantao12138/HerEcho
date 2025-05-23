/**
 * 视角配置文件
 * 定义系统中不同角色之间的视角关系
 */

import type { ViewpointRelation } from '../types/viewpoint';

/**
 * 视角映射关系配置
 * 第一个ID是对话对象，第二个ID是视角角色
 */
export const VIEWPOINT_MAPPING: ViewpointRelation[] = [
  // 1. 羌青瓷(B001C001) 对话时，玩家视角为程聿怀(B001C002)
  { characterId: 'B001C001', viewpointId: 'B001C002', promptKey: 'CYC_TO_QQC' },

  // 2. 程聿怀(B001C002) 对话时，玩家视角为羌青瓷(B001C001)
  { characterId: 'B001C002', viewpointId: 'B001C001', promptKey: 'QQC_TO_CYC' },

  // 3. 程走柳(B001C004) 对话时，玩家视角为蒋伯驾(B001C006)
  { characterId: 'B001C004', viewpointId: 'B001C006', promptKey: 'JBJ_TO_CZL' },

  // 4. 缪宏谟(B001C007) 对话时，玩家视角为以撒(B001C008)
  { characterId: 'B001C007', viewpointId: 'B001C008', promptKey: 'YS_TO_MHM' },

  // 5. 以撒(B001C008) 对话时，玩家视角为缪宏谟(B001C007)
  { characterId: 'B001C008', viewpointId: 'B001C007', promptKey: 'MHM_TO_YS' },

  // 6. 蒋伯驾(B001C006) 对话时，玩家视角为程走柳(B001C004)
  { characterId: 'B001C006', viewpointId: 'B001C004', promptKey: 'CZL_TO_JBJ' }
];

/**
 * 视角描述映射
 * 将promptKey映射到可读性更好的描述
 */
export const VIEWPOINT_DESCRIPTIONS = {
  'CYC_TO_QQC': '程聿怀视角',
  'QQC_TO_CYC': '羌青瓷视角',
  'JBJ_TO_CZL': '蒋伯驾视角',
  'YS_TO_MHM': '以撒视角',
  'MHM_TO_YS': '缪宏谟视角',
  'CZL_TO_JBJ': '程走柳视角',
  'DEFAULT': '默认视角'
};

/**
 * 根据promptKey获取视角描述
 * @param promptKey 视角的提示词键名
 * @returns 视角描述
 */
export function getViewpointDescriptionByKey(promptKey: string = ''): string {
  if (!promptKey) return VIEWPOINT_DESCRIPTIONS.DEFAULT;
  return VIEWPOINT_DESCRIPTIONS[promptKey as keyof typeof VIEWPOINT_DESCRIPTIONS] || VIEWPOINT_DESCRIPTIONS.DEFAULT;
} 