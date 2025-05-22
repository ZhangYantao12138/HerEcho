/**
 * 视角相关类型定义
 */

// 视角关系类型
export interface ViewpointRelation {
  characterId: string;   // 对话对象ID
  viewpointId: string;   // 视角角色ID
  promptKey: string;     // 对应的prompt配置键名
}

// 视角描述映射类型
export interface ViewpointDescriptionMap {
  [key: string]: string;
}

// 视角选项类型
export interface ViewpointOption {
  id: string;
  name: string;
  description: string;
} 