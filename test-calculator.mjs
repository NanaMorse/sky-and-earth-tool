/**
 * 测试计算器逻辑 - 独立脚本
 * 运行: node test-calculator.mjs
 */

const ALL_ELEMENTS = ['fire', 'water', 'earth', 'wind', 'thunder', 'light', 'dark']

const CHARACTERS = [
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
    residueSkills: [{ name: '神圣嚎叫', condition: { higher: 'light', lower: 'dark' } }],
  },
]

const CHARACTERS_BY_AGILITY = [...CHARACTERS].sort((a, b) => b.agility - a.agility)
const CHARACTER_MAP = new Map(CHARACTERS.map((c) => [c.id, c]))

function createInitialCounter() {
  return { fire: 0, water: 0, earth: 0, wind: 0, thunder: 0, light: 0, dark: 0 }
}

function applySpell(counter, element) {
  counter[element] = 3
  for (const el of ALL_ELEMENTS) {
    if (el !== element) {
      counter[el] = Math.max(0, counter[el] - 1)
    }
  }
}

function checkTriggeredSkills(counter) {
  const triggered = []
  for (const character of CHARACTERS_BY_AGILITY) {
    for (const skill of character.residueSkills) {
      const { higher, lower } = skill.condition
      const higherValue = counter[higher]
      const lowerValue = counter[lower]
      if (higherValue > 0 && lowerValue > 0 && higherValue > lowerValue) {
        triggered.push({ character: character.name, skill: skill.name })
      }
    }
  }
  return triggered
}

function getCharacterOptions(characterId) {
  const character = CHARACTER_MAP.get(characterId)
  if (!character) return ['skip']
  return [...character.elements, 'skip']
}

function generateCombinations(userChoices) {
  const results = []
  const autoCharacters = []
  const fixedChoices = {}

  for (const character of CHARACTERS_BY_AGILITY) {
    const choice = userChoices[character.id]
    if (choice === 'auto' || choice === undefined) {
      autoCharacters.push(character.id)
    } else {
      fixedChoices[character.id] = choice
    }
  }

  if (autoCharacters.length === 0) {
    return [fixedChoices]
  }

  const optionsList = autoCharacters.map((id) => getCharacterOptions(id))

  function cartesian(index, current) {
    if (index === autoCharacters.length) {
      results.push({ ...current })
      return
    }

    const characterId = autoCharacters[index]
    const options = optionsList[index]

    for (const option of options) {
      current[characterId] = option
      cartesian(index + 1, current)
    }
  }

  cartesian(0, { ...fixedChoices })
  return results
}

function simulateRound(choices, initialCounter) {
  const counter = { ...initialCounter }

  for (const character of CHARACTERS_BY_AGILITY) {
    const choice = choices[character.id]
    if (choice && choice !== 'skip' && choice !== 'auto') {
      applySpell(counter, choice)
    }
  }

  const triggeredSkills = checkTriggeredSkills(counter)
  const spellCount = Object.values(choices).filter((c) => c !== 'skip').length

  return { choices, finalCounter: counter, triggeredSkills, spellCount }
}

// ============================================
// 分析：调整初始属性值，探索最多能触发几个残留斗技
// ============================================
console.log('=== 调整初始属性值分析 ===\n')

// 固定敏捷顺序
const ORDER = CHARACTERS_BY_AGILITY

// 获取所有可能的选择组合
function getAllChoiceCombinations() {
  const results = []
  const chars = CHARACTERS

  function generate(index, current) {
    if (index === chars.length) {
      results.push({ ...current })
      return
    }
    const char = chars[index]
    for (const option of [...char.elements, 'skip']) {
      current[char.id] = option
      generate(index + 1, current)
    }
  }

  generate(0, {})
  return results
}

// 模拟回合
function simulate(choices, initialCounter) {
  const counter = { ...initialCounter }

  for (const character of ORDER) {
    const choice = choices[character.id]
    if (choice && choice !== 'skip' && choice !== 'auto') {
      applySpell(counter, choice)
    }
  }

  const triggeredSkills = checkTriggeredSkills(counter)
  return { choices, finalCounter: counter, triggeredSkills, initialCounter: { ...initialCounter } }
}

const allChoices = getAllChoiceCombinations()
console.log(`选择组合数: ${allChoices.length}`)
console.log(`敏捷顺序: ${ORDER.map((c) => c.name.slice(0, 2)).join(' → ')}\n`)

// 搜索不同的初始属性组合
// 属性值范围 0-3（因为法术最多设置为3）
let globalBest = 0
let globalBestResults = []

console.log('搜索中...\n')

// 为了减少搜索空间，只考虑每个属性 0-3 的值
// 总共 4^7 = 16384 种初始状态
for (let fire = 0; fire <= 3; fire++) {
  for (let water = 0; water <= 3; water++) {
    for (let earth = 0; earth <= 3; earth++) {
      for (let wind = 0; wind <= 3; wind++) {
        for (let thunder = 0; thunder <= 3; thunder++) {
          for (let light = 0; light <= 3; light++) {
            for (let dark = 0; dark <= 3; dark++) {
              const initCounter = { fire, water, earth, wind, thunder, light, dark }

              for (const choices of allChoices) {
                const result = simulate(choices, initCounter)
                const count = result.triggeredSkills.length

                if (count > globalBest) {
                  globalBest = count
                  globalBestResults = [result]
                } else if (count === globalBest && globalBestResults.length < 10) {
                  globalBestResults.push(result)
                }
              }
            }
          }
        }
      }
    }
  }
}

console.log(`=== 最优结果: 触发 ${globalBest} 个残留斗技 ===\n`)

// 显示最优结果
for (let i = 0; i < Math.min(5, globalBestResults.length); i++) {
  const r = globalBestResults[i]
  console.log(`方案 ${i + 1}:`)

  // 显示初始属性（只显示非零的）
  const initStr = ALL_ELEMENTS.filter((el) => r.initialCounter[el] > 0)
    .map((el) => `${el.slice(0, 2)}=${r.initialCounter[el]}`)
    .join(', ')
  console.log(`  初始属性: ${initStr || '全部为0'}`)

  // 显示选择
  const choiceStr = ORDER.map((c) => {
    const choice = r.choices[c.id]
    return `${c.name.slice(0, 2)}:${choice === 'skip' ? '跳' : choice.slice(0, 2)}`
  }).join(' ')
  console.log(`  选择: ${choiceStr}`)

  // 显示最终属性
  const finalStr = ALL_ELEMENTS.filter((el) => r.finalCounter[el] > 0)
    .map((el) => `${el.slice(0, 2)}=${r.finalCounter[el]}`)
    .join(', ')
  console.log(`  最终属性: ${finalStr || '全部为0'}`)

  // 显示触发技能
  console.log(`  触发技能: ${r.triggeredSkills.map((s) => s.skill).join(', ')}`)
  console.log('')
}

// ============================================
// 重新分析：初始属性只能是上回合残留（最多3个非零，值为1/2/3）
// ============================================
console.log('=== 符合实际的初始属性分析（最多3个非零属性）===\n')

// 生成合法的初始属性：上回合残留的结果
// 规则：最后施法的属性=3，倒数第二=2，倒数第三=1，其他=0
// 所以只能是以下几种模式：
// - 0人施法：全0
// - 1人施法：一个属性=3
// - 2人施法：一个=3，一个=2
// - 3人施法：一个=3，一个=2，一个=1
function generateValidInitialCounters() {
  const results = []

  // 0人施法：全0
  results.push({ fire: 0, water: 0, earth: 0, wind: 0, thunder: 0, light: 0, dark: 0 })

  // 1人施法：一个属性=3
  for (const el of ALL_ELEMENTS) {
    const counter = { fire: 0, water: 0, earth: 0, wind: 0, thunder: 0, light: 0, dark: 0 }
    counter[el] = 3
    results.push(counter)
  }

  // 2人施法：一个=3，一个=2
  for (let i = 0; i < ALL_ELEMENTS.length; i++) {
    for (let j = 0; j < ALL_ELEMENTS.length; j++) {
      if (i !== j) {
        const counter = { fire: 0, water: 0, earth: 0, wind: 0, thunder: 0, light: 0, dark: 0 }
        counter[ALL_ELEMENTS[i]] = 3 // 最后施法
        counter[ALL_ELEMENTS[j]] = 2 // 倒数第二
        results.push(counter)
      }
    }
  }

  // 3人施法：一个=3，一个=2，一个=1
  for (let i = 0; i < ALL_ELEMENTS.length; i++) {
    for (let j = 0; j < ALL_ELEMENTS.length; j++) {
      for (let k = 0; k < ALL_ELEMENTS.length; k++) {
        if (i !== j && j !== k && i !== k) {
          const counter = { fire: 0, water: 0, earth: 0, wind: 0, thunder: 0, light: 0, dark: 0 }
          counter[ALL_ELEMENTS[i]] = 3 // 最后施法
          counter[ALL_ELEMENTS[j]] = 2 // 倒数第二
          counter[ALL_ELEMENTS[k]] = 1 // 倒数第三
          results.push(counter)
        }
      }
    }
  }

  return results
}

const validInitCounters = generateValidInitialCounters()
console.log(`合法的初始属性组合数: ${validInitCounters.length}\n`)

let bestResult2 = null
let bestCount2 = 0
const bestResults2 = []

for (const initCounter of validInitCounters) {
  for (const choices of allChoices) {
    const result = simulate(choices, initCounter)
    const count = result.triggeredSkills.length

    if (count > bestCount2) {
      bestCount2 = count
      bestResults2.length = 0
      bestResults2.push(result)
    } else if (count === bestCount2 && bestResults2.length < 20) {
      bestResults2.push(result)
    }
  }
}

console.log(`=== 最优结果: 触发 ${bestCount2} 个残留斗技 ===\n`)

// 显示最优结果
for (let i = 0; i < Math.min(5, bestResults2.length); i++) {
  const r = bestResults2[i]
  console.log(`方案 ${i + 1}:`)

  const initStr = ALL_ELEMENTS.filter((el) => r.initialCounter[el] > 0)
    .map((el) => `${el.slice(0, 2)}=${r.initialCounter[el]}`)
    .join(', ')
  console.log(`  初始属性: ${initStr || '全部为0'}`)

  const choiceStr = ORDER.map((c) => {
    const choice = r.choices[c.id]
    return `${c.name.slice(0, 2)}:${choice === 'skip' ? '跳' : choice.slice(0, 2)}`
  }).join(' ')
  console.log(`  选择: ${choiceStr}`)

  const finalStr = ALL_ELEMENTS.filter((el) => r.finalCounter[el] > 0)
    .map((el) => `${el.slice(0, 2)}=${r.finalCounter[el]}`)
    .join(', ')
  console.log(`  最终属性: ${finalStr || '全部为0'}`)

  console.log(`  触发技能: ${r.triggeredSkills.map((s) => s.skill).join(', ')}`)
  console.log('')
}

// 按初始非零属性数量统计
console.log('=== 按初始非零属性数量统计 ===\n')

for (let nonZero = 0; nonZero <= 3; nonZero++) {
  const subset = validInitCounters.filter(
    (c) => ALL_ELEMENTS.filter((el) => c[el] > 0).length === nonZero
  )

  let maxInGroup = 0
  let bestInGroup = null

  for (const initCounter of subset) {
    for (const choices of allChoices) {
      const result = simulate(choices, initCounter)
      if (result.triggeredSkills.length > maxInGroup) {
        maxInGroup = result.triggeredSkills.length
        bestInGroup = result
      }
    }
  }

  console.log(`初始${nonZero}个非零属性: ${subset.length}种状态, 最多触发${maxInGroup}个`)

  if (bestInGroup && maxInGroup > 0) {
    const initStr = ALL_ELEMENTS.filter((el) => bestInGroup.initialCounter[el] > 0)
      .map((el) => `${el.slice(0, 2)}=${bestInGroup.initialCounter[el]}`)
      .join(', ')
    const choiceStr = ORDER.map((c) => {
      const choice = bestInGroup.choices[c.id]
      return choice === 'skip' ? '-' : choice.slice(0, 1)
    }).join('/')
    console.log(`  示例: 初始[${initStr || '无'}] 选择[${choiceStr}]`)
    console.log(`  技能: ${bestInGroup.triggeredSkills.map((s) => s.skill).join(', ')}`)
  }
  console.log('')
}
