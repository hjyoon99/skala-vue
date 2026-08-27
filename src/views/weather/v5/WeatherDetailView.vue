<script setup>
import { computed, reactive, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useConfigStore } from '@/stores/configStore'
import { useWeatherStore } from '@/stores/weatherStore'
import { toDisplayTemp, iconUrl } from '@/utils/weatherFormat'
import ForecastStrip from '@/components/weather/v5/ForecastStrip.vue'
import AirQualityPanel from '@/components/weather/v5/AirQualityPanel.vue'
import StateNotice from '@/components/weather/v5/StateNotice.vue'

const route = useRoute()
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

watch(cityId, (id) => load(id), { immediate: true })
</script>

<template>
  <section class="detail-card">
    <StateNotice v-if="state.loading" type="loading" message="상세 기상 정보를 불러오는 중…" />
    <StateNotice v-else-if="state.error" type="error" :message="state.error" />

    <template v-else-if="state.current">
      <header class="detail-head">
        <div>
          <h2>📊 {{ state.current.name }} 상세 기상 관측</h2>
          <p class="sub">{{ state.current.status }}</p>
        </div>
        <button
          type="button"
          class="fav"
          :class="{ on: isFavorite }"
          @click="store.toggleFavorite(cityId)"
        >
          {{ isFavorite ? '★ 관심 지역' : '☆ 관심 지역 등록' }}
        </button>
      </header>

      <div class="observation">
        <img
          v-if="state.current.icon"
          :src="iconUrl(state.current.icon)"
          :alt="state.current.status"
          width="72"
          height="72"
        />
        <div class="grid">
          <p>
            🌡️ 현재 기온<strong>{{ displayTemp }}{{ configStore.unitSymbol }}</strong>
          </p>
          <p>
            🤔 체감 온도<strong>{{ feelsLike }}{{ configStore.unitSymbol }}</strong>
          </p>
          <p>
            💧 습도<strong>{{ state.current.humidity }}%</strong>
          </p>
          <p>
            💨 풍속<strong>{{ state.current.wind }} m/s</strong>
          </p>
          <p>
            🔽 기압<strong>{{ state.current.pressure }} hPa</strong>
          </p>
        </div>
      </div>

      <h3>🗓️ 5일 예보</h3>
      <ForecastStrip :forecast="state.forecast" />

      <h3>🌫️ 대기질</h3>
      <AirQualityPanel :air="state.air" />
    </template>

    <template v-else>
      <h2>도시 정보를 찾을 수 없습니다.</h2>
      <p>올바른 도시 코드를 확인해 주세요.</p>
    </template>

    <RouterLink class="back-link" to="/">← 메인 대시보드로 돌아가기</RouterLink>
  </section>
</template>

<style scoped>
.detail-card {
  padding: 20px;
  border: 1px solid #e4e7ed;
  border-radius: 10px;
  background: #fff;
}
.detail-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}
.detail-head h2 {
  margin: 0;
}
.sub {
  margin: 4px 0 0;
  color: #909399;
}
.fav {
  flex-shrink: 0;
  padding: 7px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
}
.fav.on {
  color: #b7860b;
  border-color: #f7ba2a;
  background: #fdf6ec;
}
.observation {
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 16px 0;
  padding: 16px;
  border-radius: 8px;
  background: #f5f7fa;
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 8px 20px;
  flex: 1;
}
.grid p {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin: 0;
  padding: 4px 0;
}
h3 {
  margin: 20px 0 10px;
}
.back-link {
  display: inline-block;
  margin-top: 18px;
  padding: 8px 12px;
  border-radius: 4px;
  color: #fff;
  background: #30475e;
  text-decoration: none;
}
</style>
