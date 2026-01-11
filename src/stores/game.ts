import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type {
  CharacterChoice,
  ElementCounter,
  CalculationResult,
  SkillFilterItem,
} from '@/types/game'
import { CHARACTERS_BY_AGILITY } from '@/data/characters'
import { createInitialCounter, calculate } from '@/utils/calculator'

export const useGameStore = defineStore('game', () => {
  // 初始属性计数
  const initialCounter = ref<ElementCounter>(createInitialCounter())

  // 用户对每个角色的选择
  const userChoices = ref<Record<string, CharacterChoice>>(
    Object.fromEntries(CHARACTERS_BY_AGILITY.map((c) => [c.id, 'auto' as CharacterChoice]))
  )

  // 计算结果列表
  const results = ref<CalculationResult[]>([])

  // 是否已计算
  const hasCalculated = ref(false)

  // 目标技能（用户选择期望触发的残留斗技）
  const targetSkills = ref<SkillFilterItem[]>([])

  // 检查两个技能是否互斥（A>B 与 B>A）
  function isConflicting(
    cond1: { higher: string; lower: string },
    cond2: { higher: string; lower: string }
  ): boolean {
    return cond1.higher === cond2.lower && cond1.lower === cond2.higher
  }

  // 被互斥屏蔽的技能集合
  const disabledSkills = computed(() => {
    const disabled = new Set<string>()
    for (const selected of targetSkills.value) {
      for (const char of CHARACTERS_BY_AGILITY) {
        for (const skill of char.residueSkills) {
          if (isConflicting(selected.condition, skill.condition)) {
            disabled.add(`${char.id}:${skill.name}`)
          }
        }
      }
    }
    return disabled
  })

  // 过滤后的结果（OR逻辑：触发任意一个目标技能即可）
  const filteredResults = computed(() => {
    if (targetSkills.value.length === 0) return results.value

    return results.value.filter((result) =>
      targetSkills.value.some((target) =>
        result.triggeredSkills.some(
          (t) => t.characterId === target.characterId && t.skillName === target.skillName
        )
      )
    )
  })

  // 重置初始计数
  function resetInitialCounter() {
    initialCounter.value = createInitialCounter()
  }

  // 重置用户选择
  function resetUserChoices() {
    userChoices.value = Object.fromEntries(
      CHARACTERS_BY_AGILITY.map((c) => [c.id, 'auto' as CharacterChoice])
    )
  }

  // 重置所有
  function resetAll() {
    resetInitialCounter()
    resetUserChoices()
    results.value = []
    hasCalculated.value = false
    targetSkills.value = []
  }

  // 切换目标技能选择
  function toggleTargetSkill(skill: SkillFilterItem) {
    const key = `${skill.characterId}:${skill.skillName}`
    const index = targetSkills.value.findIndex(
      (s) => s.characterId === skill.characterId && s.skillName === skill.skillName
    )
    if (index >= 0) {
      targetSkills.value.splice(index, 1)
    } else {
      // 检查是否被禁用
      if (!disabledSkills.value.has(key)) {
        targetSkills.value.push(skill)
      }
    }
  }

  // 清空目标技能
  function clearTargetSkills() {
    targetSkills.value = []
  }

  // 检查技能是否已选中
  function isSkillSelected(characterId: string, skillName: string): boolean {
    return targetSkills.value.some(
      (s) => s.characterId === characterId && s.skillName === skillName
    )
  }

  // 检查技能是否被禁用
  function isSkillDisabled(characterId: string, skillName: string): boolean {
    return disabledSkills.value.has(`${characterId}:${skillName}`)
  }

  // 执行计算
  function runCalculation() {
    results.value = calculate(userChoices.value, initialCounter.value)
    hasCalculated.value = true
  }

  return {
    initialCounter,
    userChoices,
    results,
    hasCalculated,
    targetSkills,
    disabledSkills,
    filteredResults,
    resetInitialCounter,
    resetUserChoices,
    resetAll,
    runCalculation,
    toggleTargetSkill,
    clearTargetSkills,
    isSkillSelected,
    isSkillDisabled,
  }
})
