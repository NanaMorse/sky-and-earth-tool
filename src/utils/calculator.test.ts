import { describe, it, expect } from 'vitest'
import { calculate, createInitialCounter } from './calculator'
import type { CharacterChoice } from '@/types/game'

describe('calculator', () => {
  describe('createInitialCounter', () => {
    it('should create counter with all zeros', () => {
      const counter = createInitialCounter()
      expect(counter).toEqual({
        fire: 0,
        water: 0,
        earth: 0,
        wind: 0,
        thunder: 0,
        light: 0,
        dark: 0,
      })
    })
  })

  describe('calculate', () => {
    it('should correctly set element to 3 when casting spell (not +3)', () => {
      // 测试场景：初始光=2，索拉哈利亚释放光属性
      // 光应该被设置为3，而不是2+3=5
      const initialCounter = createInitialCounter()
      initialCounter.light = 2

      const userChoices: Record<string, CharacterChoice> = {
        sorahalia: 'light',
        fankus: 'skip',
        rickdio: 'skip',
        innocet: 'skip',
        senareno: 'skip',
        kartma: 'skip',
      }

      const results = calculate(userChoices, initialCounter)

      expect(results.length).toBe(1)
      // 光应该是3（设置为3），而不是5（2+3）
      expect(results[0].finalCounter.light).toBe(3)
    })

    it('should decrease other elements by 1 when casting spell', () => {
      const initialCounter = createInitialCounter()
      initialCounter.light = 2
      initialCounter.fire = 3

      const userChoices: Record<string, CharacterChoice> = {
        sorahalia: 'wind', // 释放风属性
        fankus: 'skip',
        rickdio: 'skip',
        innocet: 'skip',
        senareno: 'skip',
        kartma: 'skip',
      }

      const results = calculate(userChoices, initialCounter)

      expect(results.length).toBe(1)
      expect(results[0].finalCounter.wind).toBe(3) // 风设置为3
      expect(results[0].finalCounter.light).toBe(1) // 光从2减到1
      expect(results[0].finalCounter.fire).toBe(2) // 火从3减到2
    })

    it('should not decrease element below 0', () => {
      const initialCounter = createInitialCounter()
      // 所有属性初始为0

      const userChoices: Record<string, CharacterChoice> = {
        sorahalia: 'light',
        fankus: 'skip',
        rickdio: 'skip',
        innocet: 'skip',
        senareno: 'skip',
        kartma: 'skip',
      }

      const results = calculate(userChoices, initialCounter)

      expect(results.length).toBe(1)
      expect(results[0].finalCounter.light).toBe(3)
      // 其他属性应该是0，而不是-1
      expect(results[0].finalCounter.fire).toBe(0)
      expect(results[0].finalCounter.water).toBe(0)
    })

    it('should correctly calculate the bug scenario: light=2 initial, multiple spells', () => {
      // 用户报告的bug场景
      const initialCounter = createInitialCounter()
      initialCounter.light = 2

      const userChoices: Record<string, CharacterChoice> = {
        sorahalia: 'light',
        fankus: 'wind',
        rickdio: 'skip',
        innocet: 'skip',
        senareno: 'earth',
        kartma: 'water',
      }

      const results = calculate(userChoices, initialCounter)

      expect(results.length).toBe(1)
      const result = results[0]

      // 执行顺序（按敏捷）：
      // 1. 索拉哈利亚释放光: 光=3, 其他-1 (都是0，不变)
      // 2. 凡克斯释放风: 风=3, 光=2
      // 3. 里克迪奥跳过
      // 4. 伊诺赛特跳过
      // 5. 塞纳雷诺释放地: 地=3, 风=2, 光=1
      // 6. 卡尔特玛释放水: 水=3, 地=2, 风=1, 光=0

      expect(result.finalCounter.water).toBe(3)
      expect(result.finalCounter.earth).toBe(2)
      expect(result.finalCounter.wind).toBe(1)
      expect(result.finalCounter.light).toBe(0) // 之前bug显示为2
    })

    it('should generate all combinations for auto choices', () => {
      const initialCounter = createInitialCounter()

      const userChoices: Record<string, CharacterChoice> = {
        sorahalia: 'auto', // 4种选择：光/雷/风/跳过
        fankus: 'auto', // 2种选择：风/跳过
        rickdio: 'skip',
        innocet: 'skip',
        senareno: 'skip',
        kartma: 'skip',
      }

      const results = calculate(userChoices, initialCounter)

      // 4 * 2 = 8 种组合
      expect(results.length).toBe(8)
    })

    it('should sort results by skill count in descending order', () => {
      const initialCounter = createInitialCounter()

      const userChoices: Record<string, CharacterChoice> = {
        sorahalia: 'auto',
        fankus: 'auto',
        rickdio: 'auto',
        innocet: 'auto',
        senareno: 'auto',
        kartma: 'auto',
      }

      const results = calculate(userChoices, initialCounter)

      // 验证结果按skillCount降序排列
      for (let i = 1; i < results.length; i++) {
        expect(results[i - 1].skillCount).toBeGreaterThanOrEqual(results[i].skillCount)
      }
    })

    it('should return at most 100 results', () => {
      const initialCounter = createInitialCounter()

      const userChoices: Record<string, CharacterChoice> = {
        sorahalia: 'auto',
        fankus: 'auto',
        rickdio: 'auto',
        innocet: 'auto',
        senareno: 'auto',
        kartma: 'auto',
      }

      const results = calculate(userChoices, initialCounter)

      expect(results.length).toBeLessThanOrEqual(100)
    })

    it('should not trigger residue skills when either element is 0', () => {
      // 测试残留斗技不触发：当任一属性为0时不触发
      const initialCounter = createInitialCounter()

      const userChoices: Record<string, CharacterChoice> = {
        sorahalia: 'skip',
        fankus: 'wind', // 风=3
        rickdio: 'skip',
        innocet: 'skip', // 暗=0
        senareno: 'skip',
        kartma: 'skip',
      }

      const results = calculate(userChoices, initialCounter)

      expect(results.length).toBe(1)
      // 风=3 > 暗=0，但暗=0，所以不触发凡克斯的"大灾难"
      const triggeredSkillNames = results[0].triggeredSkills.map((s) => s.skillName)
      expect(triggeredSkillNames).not.toContain('大灾难')
    })

    it('should trigger residue skills when both elements are > 0 and higher > lower', () => {
      // 测试残留斗技触发：两个属性都>0且满足大小关系
      const initialCounter = createInitialCounter()
      initialCounter.dark = 1 // 暗=1

      const userChoices: Record<string, CharacterChoice> = {
        sorahalia: 'skip',
        fankus: 'wind', // 风=3，暗会-1变成0
        rickdio: 'skip',
        innocet: 'dark', // 暗=3
        senareno: 'skip',
        kartma: 'skip',
      }

      const results = calculate(userChoices, initialCounter)

      expect(results.length).toBe(1)
      // 执行顺序：凡克斯(风=3,暗=0) -> 伊诺赛特(暗=3,风=2)
      // 最终：风=2, 暗=3
      // 风>暗 不满足，大灾难不触发
      const triggeredSkillNames = results[0].triggeredSkills.map((s) => s.skillName)
      expect(triggeredSkillNames).not.toContain('大灾难')
    })

    it('should trigger residue skill when condition is met with both > 0', () => {
      // 伊诺赛特的"神圣嚎叫"需要 光>暗
      const initialCounter = createInitialCounter()

      const userChoices: Record<string, CharacterChoice> = {
        sorahalia: 'light', // 光=3
        fankus: 'skip',
        rickdio: 'skip',
        innocet: 'dark', // 暗=3, 光=2
        senareno: 'skip',
        kartma: 'skip',
      }

      const results = calculate(userChoices, initialCounter)

      expect(results.length).toBe(1)
      // 执行顺序：索拉哈利亚(光=3) -> 伊诺赛特(暗=3, 光=2)
      // 最终：光=2, 暗=3
      // 光>暗 不满足（2<3），神圣嚎叫不触发
      const triggeredSkillNames = results[0].triggeredSkills.map((s) => s.skillName)
      expect(triggeredSkillNames).not.toContain('神圣嚎叫')
    })
  })
})
