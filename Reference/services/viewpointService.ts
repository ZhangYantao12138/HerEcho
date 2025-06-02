/**
 * 视角服务
 * 管理不同角色间的互动关系和视角切换
 */

import type { Character } from '../types/character';
import type { ViewpointRelation } from '../types/viewpoint';
import { playerPromptConfig } from '../config/promptConfig';
import { generateDetailedPlayerPrompt } from '../config/playerPrompts';
import { 
  VIEWPOINT_MAPPING, 
  VIEWPOINT_DESCRIPTIONS,
  getViewpointDescriptionByKey 
} from '../config/viewpointConfig';

// 导出视角映射以便其他模块使用
export { VIEWPOINT_MAPPING };

/**
 * 检查当前角色是否有特定视角关系
 * @param character 当前对话的角色
 * @returns 如果有特定视角关系，返回视角关系配置；否则返回undefined
 */
export function checkViewpointRelation(character: Character): ViewpointRelation | undefined {
  return VIEWPOINT_MAPPING.find(mapping => mapping.characterId === character.id);
}

/**
 * 获取特定视角下的玩家提示
 * @param character 对话对象角色
 * @param message 角色的消息
 * @returns 根据视角关系生成的prompt
 */
export function getViewpointPrompt(character: Character, message: string): string {
  // 检查是否有特定的视角关系
  const viewpointRelation = checkViewpointRelation(character);
  
  if (!viewpointRelation || !viewpointRelation.promptKey) {
    // 没有特定视角关系，使用默认生成方式
    return generateDetailedPlayerPrompt(character, message);
  }
  
  // 获取视角提示
  const viewpointGuidance = playerPromptConfig.viewpointGuidance[viewpointRelation.promptKey as keyof typeof playerPromptConfig.viewpointGuidance];
  
  // 使用详细生成方式，但添加视角特定指导
  const basePrompt = generateDetailedPlayerPrompt(character, message);
  return `${basePrompt}\n\n视角指导：\n${viewpointGuidance}`;
}

/**
 * 获取当前角色对应的视角信息
 * @param characterId 角色ID
 * @returns 视角信息描述
 */
export function getViewpointDescription(characterId: string): string {
  const viewpointRelation = VIEWPOINT_MAPPING.find(mapping => mapping.characterId === characterId);
  
  if (!viewpointRelation) {
    return VIEWPOINT_DESCRIPTIONS.DEFAULT;
  }
  
  return getViewpointDescriptionByKey(viewpointRelation.promptKey);
}

/**
 * 获取角色可用的视角关系列表
 * @param characterId 角色ID
 * @returns 可用的视角关系列表
 */
export function getAvailableViewpoints(characterId: string): ViewpointRelation[] {
  // 返回所有可用的视角关系
  return VIEWPOINT_MAPPING.filter(vp => vp.characterId === characterId);
}

/**
 * 获取当前视角关系
 * @param characterId 角色ID
 * @returns 当前视角关系
 */
export function getCurrentViewpoint(characterId: string): ViewpointRelation | undefined {
  return VIEWPOINT_MAPPING.find(vp => vp.characterId === characterId);
} 