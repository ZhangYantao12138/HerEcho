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
  // 默认视角 - 程聿怀与羌青瓷
  { characterId: 'B001C001', viewpointId: 'B001C002', promptKey: '' },
  
  // 蒋伯驾视角与程走柳对话
  { characterId: 'B001C004', viewpointId: 'B001C006', promptKey: 'BJX_TO_CZL' },
  
  // 以撒视角与缪宏谟对话
  { characterId: 'B001C007', viewpointId: 'B001C008', promptKey: 'YS_TO_MHM' }
];

/**
 * 视角描述映射
 * 将promptKey映射到可读性更好的描述
 */
export const VIEWPOINT_DESCRIPTIONS = {
  'BJX_TO_CZL': '蒋伯驾视角',
  'YS_TO_MHM': '以撒视角',
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