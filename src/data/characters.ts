import type { Character } from '@/types/game'

// 所有角色数据
export const CHARACTERS: Character[] = [
  {
    id: 'rickdio',
    name: '里克迪奥',
    elements: ['earth'],
    agility: 456,
    residueSkills: [
      { name: '疾升拳', condition: { higher: 'wind', lower: 'earth' } },
      { name: '业龙冰爪', condition: { higher: 'water', lower: 'earth' } },
      { name: '业火爆灭', condition: { higher: 'fire', lower: 'light' } },
      { name: '地龙裂坏破', condition: { higher: 'earth', lower: 'thunder' } },
    ],
  },
  {
    id: 'sorahalia',
    name: '索拉哈利亚',
    elements: ['light', 'thunder', 'wind'],
    agility: 618,
    residueSkills: [
      { name: '烈火斩', condition: { higher: 'fire', lower: 'wind' } },
      { name: '地裂斩波', condition: { higher: 'earth', lower: 'fire' } },
    ],
  },
  {
    id: 'kartma',
    name: '卡尔特玛',
    elements: ['water'],
    agility: 399,
    residueSkills: [{ name: '奔驰鸣枪', condition: { higher: 'thunder', lower: 'water' } }],
  },
  {
    id: 'senareno',
    name: '塞纳雷诺',
    elements: ['water', 'fire', 'earth'],
    agility: 414,
    residueSkills: [
      { name: '外传招雷', condition: { higher: 'thunder', lower: 'earth' } },
      { name: '外传焦岚', condition: { higher: 'wind', lower: 'fire' } },
      { name: '外传冰牢狱', condition: { higher: 'water', lower: 'dark' } },
      { name: '外传业炎灭葬', condition: { higher: 'fire', lower: 'water' } },
    ],
  },
  {
    id: 'fankus',
    name: '凡克斯',
    elements: ['wind'],
    agility: 546,
    residueSkills: [
      { name: '大地践踏', condition: { higher: 'earth', lower: 'water' } },
      { name: '闪光碎击', condition: { higher: 'light', lower: 'thunder' } },
      { name: '闪电冲击', condition: { higher: 'thunder', lower: 'fire' } },
      { name: '大灾难', condition: { higher: 'wind', lower: 'dark' } },
    ],
  },
  {
    id: 'innocet',
    name: '伊诺赛特',
    elements: ['dark'],
    agility: 445,
    residueSkills: [
      { name: '神圣嚎叫', condition: { higher: 'light', lower: 'dark' } },
      { name: '悲惨之池', condition: { higher: 'dark', lower: 'light' } },
    ],
  },
]

// 按敏捷从高到低排序的角色列表
export const CHARACTERS_BY_AGILITY = [...CHARACTERS].sort((a, b) => b.agility - a.agility)

// 角色ID到角色的映射
export const CHARACTER_MAP = new Map<string, Character>(CHARACTERS.map((c) => [c.id, c]))
