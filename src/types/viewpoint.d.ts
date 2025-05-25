/**
 * 视角相关类型定义
 */
export interface ViewpointRelation {
    characterId: string;
    viewpointId: string;
    promptKey: string;
}
export interface ViewpointDescriptionMap {
    [key: string]: string;
}
export interface ViewpointOption {
    id: string;
    name: string;
    description: string;
}
