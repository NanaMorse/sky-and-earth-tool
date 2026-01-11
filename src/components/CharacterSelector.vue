<script setup lang="ts">
import { useGameStore } from '@/stores/game'
import { CHARACTERS_BY_AGILITY } from '@/data/characters'
import { ELEMENT_NAMES, type SkillFilterItem, type ResidueSkill } from '@/types/game'

const store = useGameStore()

function handleSkillToggle(characterId: string, skill: ResidueSkill) {
  const filterItem: SkillFilterItem = {
    characterId,
    skillName: skill.name,
    condition: skill.condition,
  }
  store.toggleTargetSkill(filterItem)
}
</script>

<template>
  <div class="character-selector">
    <div class="header">
      <h3>角色法术选择</h3>
      <el-button size="small" @click="store.resetUserChoices">全部自动</el-button>
    </div>
    <div class="characters-grid">
      <div v-for="character in CHARACTERS_BY_AGILITY" :key="character.id" class="character-card">
        <div class="character-info">
          <div class="character-name">{{ character.name }}</div>
          <div class="character-agility">敏捷: {{ character.agility }}</div>
        </div>

        <div class="character-elements">
          <span
            v-for="el in character.elements"
            :key="el"
            class="element-tag"
            :class="el"
          >
            {{ ELEMENT_NAMES[el] }}
          </span>
        </div>

        <el-select
          v-model="store.userChoices[character.id]"
          placeholder="选择"
          size="default"
          class="choice-select"
        >
          <el-option label="自动计算" value="auto" />
          <el-option label="跳过" value="skip" />
          <el-option
            v-for="el in character.elements"
            :key="el"
            :label="ELEMENT_NAMES[el]"
            :value="el"
          />
        </el-select>

        <div class="residue-skills">
          <div class="skills-header">
            <span class="skills-title">残留斗技:</span>
            <span class="skills-hint">(点击选择期望触发)</span>
          </div>
          <div
            v-for="skill in character.residueSkills"
            :key="skill.name"
            class="skill-item"
            :class="{
              selected: store.isSkillSelected(character.id, skill.name),
              disabled: store.isSkillDisabled(character.id, skill.name),
            }"
            @click="handleSkillToggle(character.id, skill)"
          >
            <el-checkbox
              :model-value="store.isSkillSelected(character.id, skill.name)"
              :disabled="store.isSkillDisabled(character.id, skill.name)"
              @click.stop
              @change="handleSkillToggle(character.id, skill)"
            />
            <span class="skill-name">{{ skill.name }}</span>
            <span class="skill-condition">
              <span class="element-mini" :class="skill.condition.higher">{{
                ELEMENT_NAMES[skill.condition.higher]
              }}</span>
              &gt;
              <span class="element-mini" :class="skill.condition.lower">{{
                ELEMENT_NAMES[skill.condition.lower]
              }}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.character-selector {
  padding: 16px;
  background: #f5f7fa;
  border-radius: 8px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.header h3 {
  margin: 0;
  font-size: 16px;
}

.characters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.character-card {
  background: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.character-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.character-name {
  font-weight: bold;
  font-size: 16px;
}

.character-agility {
  font-size: 12px;
  color: #909399;
}

.character-elements {
  display: flex;
  gap: 4px;
  margin-bottom: 12px;
}

.element-tag {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  color: white;
}

.element-tag.fire {
  background: #f56c6c;
}
.element-tag.water {
  background: #409eff;
}
.element-tag.earth {
  background: #e6a23c;
}
.element-tag.wind {
  background: #67c23a;
}
.element-tag.thunder {
  background: #9c27b0;
}
.element-tag.light {
  background: #ffd700;
  color: #333;
}
.element-tag.dark {
  background: #303133;
}

.choice-select {
  width: 100%;
  margin-bottom: 12px;
}

.residue-skills {
  font-size: 12px;
  color: #606266;
}

.skills-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.skills-title {
  font-weight: bold;
}

.skills-hint {
  font-size: 10px;
  color: #909399;
}

.skill-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  margin: 2px 0;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.skill-item:hover:not(.disabled) {
  background: #f5f7fa;
}

.skill-item.selected {
  background: #ecf5ff;
  border: 1px solid #b3d8ff;
}

.skill-item.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: #f5f5f5;
}

.skill-name {
  color: #303133;
  flex: 1;
}

.skill-condition {
  display: flex;
  align-items: center;
  gap: 4px;
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
</style>
