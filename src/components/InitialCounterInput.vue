<script setup lang="ts">
import { useGameStore } from '@/stores/game'
import { ALL_ELEMENTS, ELEMENT_NAMES } from '@/types/game'

const store = useGameStore()
</script>

<template>
  <div class="initial-counter-input">
    <div class="header">
      <h3>初始属性计数</h3>
      <el-button size="small" @click="store.resetInitialCounter">重置</el-button>
    </div>
    <div class="elements-grid">
      <div v-for="element in ALL_ELEMENTS" :key="element" class="element-item">
        <span class="element-label" :class="element">{{ ELEMENT_NAMES[element] }}</span>
        <el-input-number
          v-model="store.initialCounter[element]"
          :min="0"
          :max="99"
          size="small"
          controls-position="right"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.initial-counter-input {
  padding: 16px;
  background: #f5f7fa;
  border-radius: 8px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.header h3 {
  margin: 0;
  font-size: 16px;
}

.elements-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.element-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.element-label {
  display: inline-block;
  width: 24px;
  height: 24px;
  line-height: 24px;
  text-align: center;
  border-radius: 4px;
  color: white;
  font-size: 12px;
  font-weight: bold;
}

.element-label.fire {
  background: #f56c6c;
}
.element-label.water {
  background: #409eff;
}
.element-label.earth {
  background: #e6a23c;
}
.element-label.wind {
  background: #67c23a;
}
.element-label.thunder {
  background: #9c27b0;
}
.element-label.light {
  background: #ffd700;
  color: #333;
}
.element-label.dark {
  background: #303133;
}

.element-item :deep(.el-input-number) {
  width: 100px;
}
</style>
