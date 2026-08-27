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
  <div v-if="days.length" class="forecast-strip">
    <div v-for="d in days" :key="d.day" class="day">
      <p class="label">{{ d.label }}</p>
      <img :src="iconUrl(d.icon)" :alt="d.status" width="48" height="48" />
      <p class="status">{{ d.status }}</p>
      <p class="range">
        <span class="max">{{ d.max }}{{ configStore.unitSymbol }}</span>
        <span class="min">{{ d.min }}{{ configStore.unitSymbol }}</span>
      </p>
    </div>
  </div>
</template>

<style scoped>
.forecast-strip {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
}
.day {
  padding: 10px 4px;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  text-align: center;
}
.label {
  margin: 0 0 4px;
  font-weight: 700;
  font-size: 13px;
}
.status {
  margin: 0 0 6px;
  font-size: 12px;
  color: #909399;
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
  color: #c45656;
}
.min {
  color: #337ecc;
}
@media (max-width: 640px) {
  .forecast-strip {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
