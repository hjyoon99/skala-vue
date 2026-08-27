<script setup>
import { computed } from 'vue'
import { useConfigStore } from '@/stores/configStore'
import { toDisplayTemp, iconUrl } from '@/utils/weatherFormat'

const props = defineProps({
  forecast: { type: Array, default: () => [] },
})
const configStore = useConfigStore()

const days = computed(() =>
  props.forecast.map((d) => ({
    ...d,
    label: new Date(d.day).toLocaleDateString('ko-KR', {
      month: 'numeric',
      day: 'numeric',
      weekday: 'short',
    }),
    min: toDisplayTemp(d.tempMin, configStore.isFahrenheit),
    max: toDisplayTemp(d.tempMax, configStore.isFahrenheit),
  })),
)
</script>

<template>
  <el-row v-if="days.length" :gutter="8">
    <el-col v-for="d in days" :key="d.day" :span="24 / days.length" :xs="8">
      <el-card class="day" shadow="never" body-style="padding: 10px 4px; text-align: center;">
        <p class="label">{{ d.label }}</p>
        <img :src="iconUrl(d.icon)" :alt="d.status" width="48" height="48" />
        <el-text size="small" type="info" class="status">{{ d.status }}</el-text>
        <p class="range">
          <span class="max">{{ d.max }}{{ configStore.unitSymbol }}</span>
          <span class="min">{{ d.min }}{{ configStore.unitSymbol }}</span>
        </p>
      </el-card>
    </el-col>
  </el-row>
</template>

<style scoped>
.day {
  border-radius: 8px;
}
.label {
  margin: 0 0 4px;
  font-weight: 700;
  font-size: 13px;
}
.status {
  display: block;
  margin-bottom: 6px;
}
.range {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin: 0;
  font-size: 13px;
}
.max {
  font-weight: 700;
  color: var(--el-color-danger);
}
.min {
  color: var(--el-color-primary);
}
</style>
