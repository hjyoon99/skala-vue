<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useWeatherStore } from '@/stores/weatherStore'
import BaseDashboardCard from '@/components/weather/v5/BaseDashboardCard.vue'
import SearchBar from '@/components/weather/v5/SearchBar.vue'
import WeatherCard from '@/components/weather/v5/WeatherCard.vue'
import StateNotice from '@/components/weather/v5/StateNotice.vue'

const route = useRoute()
const router = useRouter()
const store = useWeatherStore()
const { cities, loading, error, lastUpdated, isDemo, favorites } = storeToRefs(store)

const filterQuery = ref(typeof route.query.q === 'string' ? route.query.q : '')
const selectedCity = ref(null)

const visibleCities = computed(() => {
  const q = filterQuery.value.trim()
  return q ? cities.value.filter((c) => c.name.includes(q)) : cities.value
})

const updatedText = computed(() =>
  lastUpdated.value ? lastUpdated.value.toLocaleTimeString('ko-KR') : '아직 없음',
)

watch(filterQuery, (q) => {
  router.replace({ query: q ? { q } : {} })
})

function selectCity(city) {
  selectedCity.value = { ...city }
}

function showDetail(cityId) {
  router.push({ name: 'weather-detail', params: { cityId } })
}

async function addCity(name) {
  const card = await store.searchAndAddCity(name)
  if (card) {
    filterQuery.value = ''
    selectedCity.value = { ...card }
  }
}

onMounted(() => {
  if (!lastUpdated.value) store.loadDashboard()
})
</script>

<template>
  <div>
    <StateNotice
      v-if="isDemo"
      type="info"
      message="데모 데이터로 동작 중입니다. .env 에 VITE_OWM_API_KEY 를 넣으면 실시간 데이터로 전환됩니다."
    />

    <BaseDashboardCard>
      <SearchBar
        :query="filterQuery"
        :loading="loading"
        @update-query="filterQuery = $event"
        @submit="addCity"
      />
    </BaseDashboardCard>

    <BaseDashboardCard>
      <div class="list-header">
        <h2>🏙️ 지역별 날씨 현황</h2>
        <button type="button" class="refresh" :disabled="loading" @click="store.loadDashboard()">
          🔄 새로고침
        </button>
      </div>
      <p class="updated">마지막 갱신: {{ updatedText }}</p>

      <StateNotice
        v-if="loading && !cities.some((c) => c.loaded)"
        type="loading"
        message="실시간 날씨를 불러오는 중…"
      />
      <StateNotice v-else-if="error" type="error" :message="error" />

      <WeatherCard
        v-for="city in visibleCities"
        :key="city.id"
        :city="city"
        :selected="selectedCity?.id === city.id"
        :favorite="favorites.includes(city.id)"
        @select-card="selectCity"
        @click-detail="showDetail"
        @toggle-favorite="store.toggleFavorite"
      />
      <p v-if="visibleCities.length === 0" class="empty">검색 결과가 일치하는 도시가 없습니다.</p>
    </BaseDashboardCard>

    <div class="status-bar">
      <strong>
        {{
          selectedCity
            ? `${selectedCity.name} 이(가) 선택되었습니다.`
            : '카드를 클릭하거나 도시를 검색해 보세요.'
        }}
      </strong>
    </div>
  </div>
</template>

<style scoped>
.list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.list-header h2 {
  margin: 0;
}
.refresh {
  padding: 6px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
}
.refresh:disabled {
  color: #c0c4cc;
  cursor: progress;
}
.updated {
  margin: 6px 0 4px;
  font-size: 13px;
  color: #909399;
}
.empty {
  color: #909399;
}
.status-bar {
  padding: 12px;
  border-radius: 8px;
  color: #279244;
  background: #f0f9eb;
  text-align: center;
}
</style>
