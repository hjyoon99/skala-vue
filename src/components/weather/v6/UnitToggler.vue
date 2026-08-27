<script setup>
import { computed } from 'vue'
import { useConfigStore } from '@/stores/configStore'

const configStore = useConfigStore()

// el-switch 는 boolean 을 다루므로 configStore.unit 과 양방향 매핑
const fahrenheit = computed({
  get: () => configStore.isFahrenheit,
  set: () => configStore.toggleUnit(),
})
</script>

<template>
  <div class="unit-toggler">
    <el-text size="small" type="info">날씨 단위</el-text>
    <el-switch
      v-model="fahrenheit"
      inline-prompt
      active-text="℉"
      inactive-text="℃"
      style="--el-switch-on-color: #466985; --el-switch-off-color: #168ef4"
    />
  </div>
</template>

<style scoped>
.unit-toggler {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
  white-space: nowrap;
}
</style>
