<script setup>
import { computed, reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useConfigStore } from '@/stores/configStore'
import { useWeatherStore } from '@/stores/weatherStore'
import { toDisplayTemp, iconUrl } from '@/utils/weatherFormat'
import ForecastStrip from '@/components/weather/v6/ForecastStrip.vue'
import AirQualityPanel from '@/components/weather/v6/AirQualityPanel.vue'

const route = useRoute()
const router = useRouter()
const configStore = useConfigStore()
const store = useWeatherStore()

const state = reactive({
  loading: false,
  error: '',
  current: null,
  forecast: [],
  air: null,
})

const cityId = computed(() => String(route.params.cityId))
const isFavorite = computed(() => store.isFavorite(cityId.value))
const displayTemp = computed(() =>
  state.current ? toDisplayTemp(state.current.temp, configStore.isFahrenheit) : '--',
)
const feelsLike = computed(() =>
  state.current ? toDisplayTemp(state.current.feelsLike, configStore.isFahrenheit) : '--',
)

async function load(id) {
  state.loading = true
  state.error = ''
  const result = await store.loadDetail(id)
  state.error = result.error
  state.current = result.current
  state.forecast = result.forecast
  state.air = result.air
  state.loading = false
}

async function toggleFavorite() {
  if (isFavorite.value) {
    try {
      await ElMessageBox.confirm('관심 지역에서 제거하시겠습니까?', '확인', {
        confirmButtonText: '제거',
        cancelButtonText: '취소',
        type: 'warning',
      })
    } catch {
      return
    }
    store.toggleFavorite(cityId.value)
    ElMessage.info('관심 지역에서 제거했습니다.')
  } else {
    store.toggleFavorite(cityId.value)
    ElMessage.success('관심 지역으로 등록했습니다.')
  }
}

watch(cityId, (id) => load(id), { immediate: true })
</script>

<template>
  <el-card v-loading="state.loading" element-loading-text="상세 기상 정보 불러오는 중…">
    <el-page-header @back="router.push('/')">
      <template #content>
        <span class="title">
          {{ state.current ? `${state.current.name} 상세 기상 관측` : '지역별 상세 기상 관측' }}
        </span>
      </template>
      <template v-if="state.current" #extra>
        <el-button :type="isFavorite ? 'warning' : 'default'" plain @click="toggleFavorite">
          <el-icon><StarFilled v-if="isFavorite" /><Star v-else /></el-icon>&nbsp;
          {{ isFavorite ? '관심 지역' : '관심 지역 등록' }}
        </el-button>
      </template>
    </el-page-header>

    <el-alert
      v-if="state.error"
      type="error"
      :title="state.error"
      show-icon
      :closable="false"
      class="mt"
    />

    <template v-else-if="state.current">
      <div class="observation mt">
        <img
          v-if="state.current.icon"
          :src="iconUrl(state.current.icon)"
          :alt="state.current.status"
          width="80"
          height="80"
        />
        <el-descriptions :column="2" border>
          <el-descriptions-item label="현재 기온">
            {{ displayTemp }}{{ configStore.unitSymbol }}
          </el-descriptions-item>
          <el-descriptions-item label="체감 온도">
            {{ feelsLike }}{{ configStore.unitSymbol }}
          </el-descriptions-item>
          <el-descriptions-item label="날씨">{{ state.current.status }}</el-descriptions-item>
          <el-descriptions-item label="습도">{{ state.current.humidity }}%</el-descriptions-item>
          <el-descriptions-item label="풍속">{{ state.current.wind }} m/s</el-descriptions-item>
          <el-descriptions-item label="기압">{{ state.current.pressure }} hPa</el-descriptions-item>
        </el-descriptions>
      </div>

      <el-divider content-position="left">🗓️ 5일 예보</el-divider>
      <ForecastStrip :forecast="state.forecast" />

      <el-divider content-position="left">🌫️ 대기질</el-divider>
      <AirQualityPanel :air="state.air" />
    </template>
  </el-card>
</template>

<style scoped>
.title {
  font-size: 18px;
  font-weight: 700;
}
.mt {
  margin-top: 16px;
}
.observation {
  display: flex;
  align-items: center;
  gap: 16px;
}
.observation .el-descriptions {
  flex: 1;
}
</style>
