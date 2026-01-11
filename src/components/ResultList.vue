<script setup lang="ts">
import { useGameStore } from '@/stores/game'
import { ELEMENT_NAMES, ALL_ELEMENTS } from '@/types/game'
import type { CharacterChoice } from '@/types/game'

const store = useGameStore()

function getChoiceDisplay(choice: CharacterChoice): string {
  if (choice === 'auto') return '自动'
  if (choice === 'skip') return '-'
  return ELEMENT_NAMES[choice]
}

function getChoiceClass(choice: CharacterChoice): string {
  if (choice === 'auto' || choice === 'skip') return ''
  return choice
}
</script>

<template>
  <div class="result-list">
    <div v-if="!store.hasCalculated" class="no-results">
      点击「开始计算」按钮查看结果
    </div>

    <div v-else-if="store.results.length === 0" class="no-results">
      没有找到任何结果
    </div>

    <template v-else>
      <div class="results-header">
        <span>共 {{ store.filteredResults.length }} 个方案</span>
        <span v-if="store.targetSkills.length > 0" class="filter-info">
          (从 {{ store.results.length }} 个方案中筛选，目标技能:
          <el-tag
            v-for="skill in store.targetSkills"
            :key="`${skill.characterId}:${skill.skillName}`"
            size="small"
            type="warning"
            closable
            @close="store.toggleTargetSkill(skill)"
          >
            {{ skill.skillName }}
          </el-tag>
          <el-button size="small" text type="primary" @click="store.clearTargetSkills">
            清空筛选
          </el-button>
          )
        </span>
      </div>

      <div v-if="store.filteredResults.length === 0" class="no-results">
        没有找到符合筛选条件的方案
      </div>

      <el-table v-else :data="store.filteredResults" style="width: 100%" stripe>
        <el-table-column type="expand">
          <template #default="{ row }">
            <div class="expand-content">
              <div class="final-counter">
                <span class="label">最终属性计数:</span>
                <span
                  v-for="el in ALL_ELEMENTS"
                  :key="el"
                  class="counter-item"
                >
                  <span class="element-mini" :class="el">{{ ELEMENT_NAMES[el] }}</span>
                  <span class="counter-value">{{ row.finalCounter[el] }}</span>
                </span>
              </div>
              <div class="triggered-skills-detail">
                <span class="label">触发的残留斗技:</span>
                <div class="skills-list">
                  <el-tag
                    v-for="(skill, index) in row.triggeredSkills"
                    :key="index"
                    size="small"
                    type="success"
                  >
                    {{ skill.characterName }} - {{ skill.skillName }}
                  </el-tag>
                  <span v-if="row.triggeredSkills.length === 0" class="no-skills">无</span>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="skillCount" label="触发数" width="80" align="center">
          <template #default="{ row }">
            <el-tag :type="row.skillCount > 0 ? 'success' : 'info'" size="large">
              {{ row.skillCount }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="索拉哈利亚" width="100" align="center">
          <template #default="{ row }">
            <span class="choice-cell" :class="getChoiceClass(row.choices['sorahalia'])">
              {{ getChoiceDisplay(row.choices['sorahalia']) }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="凡克斯" width="80" align="center">
          <template #default="{ row }">
            <span class="choice-cell" :class="getChoiceClass(row.choices['fankus'])">
              {{ getChoiceDisplay(row.choices['fankus']) }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="里克迪奥" width="90" align="center">
          <template #default="{ row }">
            <span class="choice-cell" :class="getChoiceClass(row.choices['rickdio'])">
              {{ getChoiceDisplay(row.choices['rickdio']) }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="伊诺赛特" width="90" align="center">
          <template #default="{ row }">
            <span class="choice-cell" :class="getChoiceClass(row.choices['innocet'])">
              {{ getChoiceDisplay(row.choices['innocet']) }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="塞纳雷诺" width="90" align="center">
          <template #default="{ row }">
            <span class="choice-cell" :class="getChoiceClass(row.choices['senareno'])">
              {{ getChoiceDisplay(row.choices['senareno']) }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="卡尔特玛" width="90" align="center">
          <template #default="{ row }">
            <span class="choice-cell" :class="getChoiceClass(row.choices['kartma'])">
              {{ getChoiceDisplay(row.choices['kartma']) }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="触发技能" min-width="200">
          <template #default="{ row }">
            <div class="triggered-skills">
              <el-tag
                v-for="(skill, index) in row.triggeredSkills.slice(0, 3)"
                :key="index"
                size="small"
                type="success"
              >
                {{ skill.skillName }}
              </el-tag>
              <el-tag v-if="row.triggeredSkills.length > 3" size="small" type="info">
                +{{ row.triggeredSkills.length - 3 }}
              </el-tag>
              <span v-if="row.triggeredSkills.length === 0" class="no-skills">-</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </template>
  </div>
</template>

<style scoped>
.result-list {
  padding: 16px;
  background: #f5f7fa;
  border-radius: 8px;
}

.no-results {
  text-align: center;
  padding: 40px;
  color: #909399;
}

.results-header {
  margin-bottom: 12px;
  font-size: 14px;
  color: #606266;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.filter-info {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
  color: #909399;
}

.choice-cell {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.choice-cell.fire {
  background: #fef0f0;
  color: #f56c6c;
}
.choice-cell.water {
  background: #ecf5ff;
  color: #409eff;
}
.choice-cell.earth {
  background: #fdf6ec;
  color: #e6a23c;
}
.choice-cell.wind {
  background: #f0f9eb;
  color: #67c23a;
}
.choice-cell.thunder {
  background: #f3e5f5;
  color: #9c27b0;
}
.choice-cell.light {
  background: #fffde7;
  color: #f9a825;
}
.choice-cell.dark {
  background: #f5f5f5;
  color: #303133;
}

.triggered-skills {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.no-skills {
  color: #c0c4cc;
}

.expand-content {
  padding: 16px;
}

.expand-content .label {
  font-weight: bold;
  margin-right: 8px;
}

.final-counter {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.counter-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.counter-value {
  font-weight: bold;
}

.element-mini {
  display: inline-block;
  width: 18px;
  height: 18px;
  line-height: 18px;
  text-align: center;
  border-radius: 3px;
  font-size: 10px;
  color: white;
}

.element-mini.fire {
  background: #f56c6c;
}
.element-mini.water {
  background: #409eff;
}
.element-mini.earth {
  background: #e6a23c;
}
.element-mini.wind {
  background: #67c23a;
}
.element-mini.thunder {
  background: #9c27b0;
}
.element-mini.light {
  background: #ffd700;
  color: #333;
}
.element-mini.dark {
  background: #303133;
}

.triggered-skills-detail {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
</style>
