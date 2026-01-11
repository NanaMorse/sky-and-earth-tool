// 七种属性
export type Element = 'fire' | 'water' | 'earth' | 'wind' | 'thunder' | 'light' | 'dark'

// 所有属性列表
export const ALL_ELEMENTS: Element[] = ['fire', 'water', 'earth', 'wind', 'thunder', 'light', 'dark']

// 属性中文名映射
export const ELEMENT_NAMES: Record<Element, string> = {
  fire: '火',
  water: '水',
  earth: '地',
  wind: '风',
  thunder: '雷',
  light: '光',
  dark: '暗',
}

// 残留斗技
export interface ResidueSkill {
  name: string
  condition: {
    higher: Element // 需要更大的属性
    lower: Element // 需要更小的属性
  }
}

// 角色定义
export interface Character {
  id: string
  name: string
  elements: Element[] // 该角色可选择的属性
  agility: number
  residueSkills: ResidueSkill[]
}

// 角色选择状态：选择某属性、跳过、或自动计算
export type CharacterChoice = Element | 'skip' | 'auto'

// 属性计数器
export type ElementCounter = Record<Element, number>

// 单个触发的残留斗技
export interface TriggeredSkill {
  characterId: string
  characterName: string
  skillName: string
}

// 计算结果
export interface CalculationResult {
  choices: Record<string, CharacterChoice> // 每个角色的选择
  triggeredSkills: TriggeredSkill[] // 触发的残留斗技列表
  skillCount: number // 触发数量
  finalCounter: ElementCounter // 最终属性计数
}

// 目标技能筛选项
export interface SkillFilterItem {
  characterId: string
  skillName: string
  condition: {
    higher: Element
    lower: Element
  }
}
