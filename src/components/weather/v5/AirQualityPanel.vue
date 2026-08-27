<script setup>
import { computed } from 'vue'
import { aqiLabel } from '@/utils/weatherFormat'

const props = defineProps({
  air: { type: Object, default: null },
})

const grade = computed(() => (props.air ? aqiLabel(props.air.aqi) : '정보 없음'))
const level = computed(() => props.air?.aqi ?? 0)
const rows = computed(() => {
  const c = props.air?.components ?? {}
  return [
    { key: '미세먼지 (PM10)', value: c.pm10 },
    { key: '초미세먼지 (PM2.5)', value: c.pm2_5 },
    { key: '오존 (O₃)', value: c.o3 },
    { key: '이산화질소 (NO₂)', value: c.no2 },
  ].filter((r) => r.value !== undefined)
})
</script>

<template>
  <div v-if="air" class="air-panel">
    <div class="headline" :class="`aqi-${level}`">
      <span class="dot" />
      <strong>대기질: {{ grade }}</strong>
    </div>
    <ul v-if="rows.length">
      <li v-for="r in rows" :key="r.key">
        <span>{{ r.key }}</span>
        <span>{{ Math.round(r.value) }} ㎍/㎥</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.air-panel {
  padding: 14px;
  border-radius: 8px;
  background: #f5f7fa;
}
.headline {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}
.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #909399;
}
.aqi-1 .dot {
  background: #67c23a;
}
.aqi-2 .dot {
  background: #e6a23c;
}
.aqi-3 .dot {
  background: #f56c6c;
}
.aqi-4 .dot,
.aqi-5 .dot {
  background: #9b3d3d;
}
ul {
  margin: 0;
  padding: 0;
  list-style: none;
}
li {
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
  border-top: 1px solid #ebeef5;
  font-size: 14px;
}
</style>
