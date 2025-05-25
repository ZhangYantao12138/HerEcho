/**
 * 视角服务
 * 管理不同角色间的互动关系和视角切换
 */
import type { Character } from '../types/character';
import type { ViewpointRelation } from '../types/viewpoint';
import { VIEWPOINT_MAPPING } from '../config/viewpointConfig';
export { VIEWPOINT_MAPPING };
/**
 * 检查当前角色是否有特定视角关系
 * @param character 当前对话的角色
 * @returns 如果有特定视角关系，返回视角关系配置；否则返回undefined
 */
export declare function checkViewpointRelation(character: Character): ViewpointRelation | undefined;
/**
 * 获取特定视角下的玩家提示
 * @param character 对话对象角色
 * @param message 角色的消息
 * @returns 根据视角关系生成的prompt
 */
export declare function getViewpointPrompt(character: Character, message: string): string;
/**
 * 获取当前角色对应的视角信息
 * @param characterId 角色ID
 * @returns 视角信息描述
 */
export declare function getViewpointDescription(characterId: string): string;
/**
 * 获取角色可用的视角关系列表
 * @param characterId 角色ID
 * @returns 可用的视角关系列表
 */
export declare function getAvailableViewpoints(characterId: string): ViewpointRelation[];
/**
 * 获取当前视角关系
 * @param characterId 角色ID
 * @returns 当前视角关系
 */
export declare function getCurrentViewpoint(characterId: string): ViewpointRelation | undefined;
