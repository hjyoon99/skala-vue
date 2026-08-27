<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseDashboardCard from '@/components/weather/v4/exercise/BaseDashboardCard.vue'
import SearchBar from '@/components/weather/v4/exercise/SearchBar.vue'
import WeatherCard from '@/components/weather/v4/exercise/WeatherCard.vue'

const route = useRoute()
const router = useRouter()
const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
])
const searchQuery = ref(typeof route.query.q === 'string' ? route.query.q : '')
const selectedCity = ref(null)
const filteredCities = computed(() => {
  const query = searchQuery.value.trim()
  return query ? weatherList.value.filter((city) => city.name.includes(query)) : weatherList.value
})

watch(searchQuery, (query) => {
  router.replace({ query: query ? { q: query } : {} })
})

function selectCity(city) {
  selectedCity.value = { ...city }
}

function showDetail(cityId) {
  router.push(`/weather/${cityId}`)
}
</script>

<template>
  <div>
    <BaseDashboardCard>
      <SearchBar :query="searchQuery" @update-query="searchQuery = $event" />
    </BaseDashboardCard>
    <BaseDashboardCard>
      <h2>🏙️ 지역별 날씨 현황</h2>
      <WeatherCard
        v-for="city in filteredCities"
        :key="city.id"
        :city="city"
        :selected="selectedCity?.id === city.id"
        @select-card="selectCity"
        @click-detail="showDetail"
      />
      <p v-if="filteredCities.length === 0">검색 결과가 일치하는 도시가 없습니다.</p>
    </BaseDashboardCard>
    <div class="status-bar">
      <strong>{{
        selectedCity ? `${selectedCity.name}이 선택되었습니다.` : '카드를 클릭하거나 검색해 보세요.'
      }}</strong>
    </div>
  </div>
</template>

<style scoped>
.status-bar {
  padding: 12px;
  border-radius: 8px;
  color: #279244;
  background: #f0f9eb;
  text-align: center;
}
</style>
