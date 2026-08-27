<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'
import { useWeatherStore } from '@/stores/weatherStore'
import BaseDashboardCard from '@/components/weather/v6/BaseDashboardCard.vue'
import WeatherCard from '@/components/weather/v6/WeatherCard.vue'

const router = useRouter()
const store = useWeatherStore()
const { favoriteCities, favorites, lastUpdated } = storeToRefs(store)

function showDetail(cityId) {
  router.push({ name: 'weather-detail', params: { cityId } })
}

function onToggleFavorite(id) {
  store.toggleFavorite(id)
  ElMessage.info('관심 지역에서 제거했습니다.')
}

onMounted(() => {
  if (!lastUpdated.value) store.loadDashboard()
})
</script>

<template>
  <BaseDashboardCard>
    <template #title>⭐ 관심 지역</template>

    <el-empty
      v-if="favoriteCities.length === 0"
      description="아직 등록한 관심 지역이 없습니다. 대시보드에서 카드의 ☆ 를 눌러 추가하세요."
    />

    <template v-else>
      <WeatherCard
        v-for="city in favoriteCities"
        :key="city.id"
        :city="city"
        :favorite="favorites.includes(city.id)"
        @click-detail="showDetail"
        @toggle-favorite="onToggleFavorite"
      />
    </template>

    <el-button link type="primary" @click="router.push('/')">← 날씨 대시보드로 돌아가기</el-button>
  </BaseDashboardCard>
</template>
