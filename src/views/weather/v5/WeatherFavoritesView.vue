<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useWeatherStore } from '@/stores/weatherStore'
import BaseDashboardCard from '@/components/weather/v5/BaseDashboardCard.vue'
import WeatherCard from '@/components/weather/v5/WeatherCard.vue'

const router = useRouter()
const store = useWeatherStore()
const { favoriteCities, favorites, lastUpdated } = storeToRefs(store)

function showDetail(cityId) {
  router.push({ name: 'weather-detail', params: { cityId } })
}

onMounted(() => {
  if (!lastUpdated.value) store.loadDashboard()
})
</script>

<template>
  <BaseDashboardCard>
    <template #title>⭐ 관심 지역</template>

    <p v-if="favoriteCities.length === 0" class="empty">
      아직 등록한 관심 지역이 없습니다. 대시보드에서 카드의 ☆ 를 눌러 추가하세요.
    </p>

    <template v-else>
      <WeatherCard
        v-for="city in favoriteCities"
        :key="city.id"
        :city="city"
        :favorite="favorites.includes(city.id)"
        @click-detail="showDetail"
        @toggle-favorite="store.toggleFavorite"
      />
    </template>

    <RouterLink class="home-link" to="/">날씨 대시보드로 돌아가기</RouterLink>
  </BaseDashboardCard>
</template>

<style scoped>
.empty {
  color: #909399;
}
.home-link {
  display: inline-block;
  margin-top: 12px;
  color: #168ef4;
}
</style>
