/**
 * 视角配置文件
 * 定义系统中不同角色之间的视角关系
 */
import type { ViewpointRelation } from '../types/viewpoint';
/**
 * 视角映射关系配置
 * 第一个ID是对话对象，第二个ID是视角角色
 */
export declare const VIEWPOINT_MAPPING: ViewpointRelation[];
/**
 * 视角描述映射
 * 将promptKey映射到可读性更好的描述
 */
export declare const VIEWPOINT_DESCRIPTIONS: Record<string, string>;
/**
 * 根据promptKey获取视角描述
 * @param promptKey 视角的提示词键名
 * @returns 视角描述
 */
export declare function getViewpointDescriptionByKey(promptKey?: string): string;
