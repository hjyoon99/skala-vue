<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'
import { useWeatherStore } from '@/stores/weatherStore'
import BaseDashboardCard from '@/components/weather/v6/BaseDashboardCard.vue'
import SearchBar from '@/components/weather/v6/SearchBar.vue'
import WeatherCard from '@/components/weather/v6/WeatherCard.vue'

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

function onToggleFavorite(id) {
  const wasFav = store.isFavorite(id)
  store.toggleFavorite(id)
  ElMessage.success(wasFav ? '관심 지역에서 제거했습니다.' : '관심 지역으로 등록했습니다.')
}

async function addCity(name) {
  const card = await store.searchAndAddCity(name)
  if (card) {
    filterQuery.value = ''
    selectedCity.value = { ...card }
    ElMessage.success(`${card.name} 날씨를 불러왔습니다.`)
  } else if (error.value) {
    ElMessage.error(error.value)
  }
}

onMounted(() => {
  if (!lastUpdated.value) store.loadDashboard()
})
</script>

<template>
  <div>
    <el-alert
      v-if="isDemo"
      class="demo-alert"
      type="info"
      show-icon
      :closable="false"
      title="데모 데이터로 동작 중"
      description=".env 에 VITE_OWM_API_KEY 를 넣고 dev 서버를 재시작하면 실시간 데이터로 전환됩니다."
    />

    <BaseDashboardCard>
      <template #title>🔍 도시 검색</template>
      <SearchBar
        :query="filterQuery"
        :loading="loading"
        @update-query="filterQuery = $event"
        @submit="addCity"
      />
    </BaseDashboardCard>

    <BaseDashboardCard>
      <template #title>
        <div class="list-header">
          <span>🏙️ 지역별 날씨 현황</span>
          <el-button size="small" :loading="loading" @click="store.loadDashboard()">
            <el-icon><Refresh /></el-icon>&nbsp;새로고침
          </el-button>
        </div>
      </template>

      <el-text size="small" type="info">마지막 갱신: {{ updatedText }}</el-text>

      <el-alert
        v-if="error"
        type="error"
        :title="error"
        show-icon
        :closable="false"
        class="row-alert"
      />

      <div
        v-loading="loading && !cities.some((c) => c.loaded)"
        element-loading-text="실시간 날씨 불러오는 중…"
      >
        <WeatherCard
          v-for="city in visibleCities"
          :key="city.id"
          :city="city"
          :selected="selectedCity?.id === city.id"
          :favorite="favorites.includes(city.id)"
          @select-card="selectCity"
          @click-detail="showDetail"
          @toggle-favorite="onToggleFavorite"
        />
        <el-empty
          v-if="visibleCities.length === 0"
          description="검색 결과가 일치하는 도시가 없습니다."
        />
      </div>
    </BaseDashboardCard>

    <el-alert
      :type="selectedCity ? 'success' : 'info'"
      :closable="false"
      center
      show-icon
      :title="
        selectedCity
          ? `${selectedCity.name} 이(가) 선택되었습니다.`
          : '카드를 클릭하거나 도시를 검색해 보세요.'
      "
    />
  </div>
</template>

<style scoped>
.demo-alert {
  margin-bottom: 16px;
}
.list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.row-alert {
  margin: 10px 0;
}
</style>
