<script setup lang="ts">
import { useGameStore } from '@/stores/game'
import InitialCounterInput from '@/components/InitialCounterInput.vue'
import CharacterSelector from '@/components/CharacterSelector.vue'
import ResultList from '@/components/ResultList.vue'

const store = useGameStore()
</script>

<template>
  <div class="app-container">
    <header class="app-header">
      <h1>残留斗技计算器</h1>
      <p class="subtitle">选择角色法术，计算最优残留斗技触发方案</p>
    </header>

    <main class="app-main">
      <section class="input-section">
        <InitialCounterInput />
      </section>

      <section class="selector-section">
        <CharacterSelector />
      </section>

      <section class="action-section">
        <el-button type="primary" size="large" @click="store.runCalculation">
          开始计算
        </el-button>
        <el-button size="large" @click="store.resetAll">
          重置全部
        </el-button>
      </section>

      <section class="result-section">
        <h2>计算结果</h2>
        <ResultList />
      </section>
    </main>
  </div>
</template>

<style scoped>
.app-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.app-header {
  text-align: center;
  margin-bottom: 24px;
}

.app-header h1 {
  margin: 0 0 8px 0;
  font-size: 28px;
  color: #303133;
}

.subtitle {
  margin: 0;
  color: #909399;
  font-size: 14px;
}

.app-main {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-section,
.selector-section,
.result-section {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.action-section {
  display: flex;
  justify-content: center;
  gap: 12px;
  padding: 16px 0;
}

.result-section h2 {
  margin: 0;
  padding: 16px 16px 0;
  font-size: 18px;
  color: #303133;
}
</style>

<style>
body {
  margin: 0;
  background: #f0f2f5;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
    sans-serif;
}
</style>
