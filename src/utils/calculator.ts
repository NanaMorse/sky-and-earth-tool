import type {
  Element,
  CharacterChoice,
  ElementCounter,
  CalculationResult,
  TriggeredSkill,
} from '@/types/game'
import { ALL_ELEMENTS } from '@/types/game'
import { CHARACTERS_BY_AGILITY, CHARACTER_MAP } from '@/data/characters'

// 创建初始属性计数器
export function createInitialCounter(): ElementCounter {
  return {
    fire: 0,
    water: 0,
    earth: 0,
    wind: 0,
    thunder: 0,
    light: 0,
    dark: 0,
  }
}

// 释放法术后更新属性计数
function applySpell(counter: ElementCounter, element: Element): void {
  // 该属性设置为 3
  counter[element] = 3
  // 其余属性 -1（最小为0）
  for (const el of ALL_ELEMENTS) {
    if (el !== element) {
      counter[el] = Math.max(0, counter[el] - 1)
    }
  }
}

// 检查所有角色的残留斗技触发情况
function checkTriggeredSkills(counter: ElementCounter): TriggeredSkill[] {
  const triggered: TriggeredSkill[] = []

  for (const character of CHARACTERS_BY_AGILITY) {
    for (const skill of character.residueSkills) {
      const { higher, lower } = skill.condition
      const higherValue = counter[higher]
      const lowerValue = counter[lower]
      // 触发条件：higher > lower，且两者都不为0
      if (higherValue > 0 && lowerValue > 0 && higherValue > lowerValue) {
        triggered.push({
          characterId: character.id,
          characterName: character.name,
          skillName: skill.name,
        })
      }
    }
  }

  return triggered
}

// 获取角色的所有可能选择（其属性 + 跳过）
function getCharacterOptions(characterId: string): CharacterChoice[] {
  const character = CHARACTER_MAP.get(characterId)
  if (!character) return ['skip']
  return [...character.elements, 'skip']
}

// 生成所有可能的选择组合
function generateCombinations(
  userChoices: Record<string, CharacterChoice>
): Record<string, CharacterChoice>[] {
  const results: Record<string, CharacterChoice>[] = []

  // 找出需要自动计算的角色
  const autoCharacters: string[] = []
  const fixedChoices: Record<string, CharacterChoice> = {}

  for (const character of CHARACTERS_BY_AGILITY) {
    const choice = userChoices[character.id]
    if (choice === 'auto' || choice === undefined) {
      autoCharacters.push(character.id)
    } else {
      fixedChoices[character.id] = choice
    }
  }

  // 如果没有需要自动计算的角色，直接返回固定选择
  if (autoCharacters.length === 0) {
    return [fixedChoices]
  }

  // 获取每个自动角色的选项
  const optionsList = autoCharacters.map((id) => getCharacterOptions(id))

  // 计算笛卡尔积
  function cartesian(index: number, current: Record<string, CharacterChoice>): void {
    if (index === autoCharacters.length) {
      results.push({ ...current })
      return
    }

    const characterId = autoCharacters[index]!
    const options = optionsList[index]!

    for (const option of options) {
      current[characterId] = option
      cartesian(index + 1, current)
    }
  }

  cartesian(0, { ...fixedChoices })

  return results
}

// 模拟一个回合并返回结果
function simulateRound(
  choices: Record<string, CharacterChoice>,
  initialCounter: ElementCounter
): CalculationResult {
  // 复制初始计数器
  const counter: ElementCounter = { ...initialCounter }

  // 按敏捷顺序执行每个角色的选择
  for (const character of CHARACTERS_BY_AGILITY) {
    const choice = choices[character.id]
    if (choice && choice !== 'skip' && choice !== 'auto') {
      applySpell(counter, choice as Element)
    }
  }

  // 检查触发的残留斗技
  const triggeredSkills = checkTriggeredSkills(counter)

  return {
    choices,
    triggeredSkills,
    skillCount: triggeredSkills.length,
    finalCounter: counter,
  }
}

// 主计算函数
export function calculate(
  userChoices: Record<string, CharacterChoice>,
  initialCounter: ElementCounter
): CalculationResult[] {
  // 生成所有可能的组合
  const combinations = generateCombinations(userChoices)

  // 模拟每个组合
  const results = combinations.map((choices) => simulateRound(choices, initialCounter))

  // 按触发数量降序排序
  results.sort((a, b) => b.skillCount - a.skillCount)

  // 返回前100个结果
  return results.slice(0, 100)
}
