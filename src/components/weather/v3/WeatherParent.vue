<script setup>
import { computed, ref, watch, watchEffect } from 'vue'
import BaseDashboardCard from './BaseDashboardCard.vue'
import SearchBar from './SearchBar.vue'
import WeatherCard from './WeatherCard.vue'

const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
])

const searchQuery = ref('')
const selectedCityInfo = ref(null)
const isFahrenheit = ref(false)

const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim()
  if (!query) return weatherList.value

  return weatherList.value.filter((item) => item.name.includes(query))
})

const temperatureUnit = computed(() => (isFahrenheit.value ? '℉' : '℃'))

watch(selectedCityInfo, (newInfo) => {
  if (newInfo) {
    console.log(
      `👁️ [watch 감지] 상태 바 문구가 업데이트되었습니다. -> "${newInfo.name}이 선택되었습니다."`,
    )
  }
})

watchEffect(() => {
  const cityNames = filteredWeatherList.value.map((item) => item.name).join(', ')
  console.log(
    `🤖 [watchEffect 자동 호출] 현재 검색어 '${searchQuery.value}'에 매칭되는 데이터를 필터링합니다. -> ${cityNames || '없음'}`,
  )
})

watch(isFahrenheit, (newValue) => {
  console.log(`[watch] 온도 단위 변경: ${newValue ? '화씨' : '섭씨'}`)
})

function updateQuery(query) {
  searchQuery.value = query
}

function selectCity(cityInfo) {
  selectedCityInfo.value = { ...cityInfo }
}

function showDetail(cityInfo) {
  window.alert(`${cityInfo.name}의 현재 날씨는 [${cityInfo.status}] 상태입니다.`)
}

function displayTemperature(celsius) {
  return isFahrenheit.value ? Math.round((celsius * 9) / 5 + 32) : celsius
}
</script>

<template>
  <div class="dashboard-wrapper">
    <BaseDashboardCard>
      <SearchBar :query="searchQuery" @update-query="updateQuery" />
    </BaseDashboardCard>

    <BaseDashboardCard>
      <div class="list-header">
        <h2>🏙️ 지역별 날씨 현황</h2>
        <label>
          <input v-model="isFahrenheit" type="checkbox" />
          화씨로 보기
        </label>
      </div>

      <WeatherCard
        v-for="item in filteredWeatherList"
        :key="item.id"
        :city="item"
        :is-selected="selectedCityInfo?.id === item.id"
        :temperature="displayTemperature(item.temp)"
        :temperature-unit="temperatureUnit"
        @select-card="selectCity"
        @click-detail="showDetail"
      />

      <p v-if="filteredWeatherList.length === 0">검색 결과가 일치하는 도시가 없습니다.</p>
    </BaseDashboardCard>

    <div v-if="selectedCityInfo" class="status-bar">
      <strong>{{ selectedCityInfo.name }}이 선택되었습니다.</strong>
      <p>
        {{ selectedCityInfo.status }} · {{ displayTemperature(selectedCityInfo.temp)
        }}{{ temperatureUnit }}
      </p>
    </div>
    <p v-else class="status-bar">도시를 선택해 주세요.</p>
  </div>
</template>

<style scoped>
.list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.list-header input {
  width: auto;
}

.status-bar {
  margin-bottom: 8px;
  padding: 12px;
  border-radius: 8px;
  background: #f0f9eb;
  text-align: center;
}

.status-bar p {
  margin: 6px 0 0;
}
</style>
