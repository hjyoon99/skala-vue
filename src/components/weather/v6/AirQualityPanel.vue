<script setup>
import { computed } from 'vue'
import { aqiLabel } from '@/utils/weatherFormat'

const props = defineProps({
  air: { type: Object, default: null },
})

const level = computed(() => props.air?.aqi ?? 0)
const grade = computed(() => aqiLabel(level.value))
const tagType = computed(
  () => ['info', 'success', 'warning', 'danger', 'danger', 'danger'][level.value] ?? 'info',
)
const percent = computed(() => Math.round((level.value / 5) * 100))

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
  <div v-if="air">
    <div class="headline">
      <el-tag :type="tagType" size="large" effect="dark">대기질: {{ grade }}</el-tag>
      <el-progress
        :percentage="percent"
        :stroke-width="14"
        :status="level >= 3 ? 'exception' : level === 2 ? 'warning' : 'success'"
        :show-text="false"
        style="flex: 1"
      />
    </div>

    <el-descriptions v-if="rows.length" :column="2" border size="small">
      <el-descriptions-item v-for="r in rows" :key="r.key" :label="r.key">
        {{ Math.round(r.value) }} ㎍/㎥
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<style scoped>
.headline {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}
</style>
