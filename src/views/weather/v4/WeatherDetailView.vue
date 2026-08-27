<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useConfigStore } from '@/stores/configStore'

const route = useRoute()
const configStore = useConfigStore()
const weatherDetails = {
  city_01: { name: '대한민국 서울특별시', temp: 28, status: '맑음', humidity: 55, wind: '2.5m/s' },
  city_02: { name: '대한민국 경기도 수원시', temp: 24, status: '비', humidity: 78, wind: '3.1m/s' },
  city_03: { name: '대한민국 부산광역시', temp: 26, status: '구름', humidity: 68, wind: '4.2m/s' },
}
const city = computed(() => weatherDetails[route.params.cityId])
const displayTemp = computed(() => {
  if (!city.value) return null
  return configStore.isFahrenheit ? Math.round((city.value.temp * 9) / 5 + 32) : city.value.temp
})
</script>

<template>
  <section class="detail-card">
    <template v-if="city">
      <h2>📊 지역별 상세 기상 관측 정보</h2>
      <div class="observation">
        <p>📍 지정 지역: {{ city.name }}</p>
        <p>실시간 기온: {{ displayTemp }}{{ configStore.unitSymbol }}</p>
        <p>기상 현황: {{ city.status }}</p>
        <p>대기 습도: {{ city.humidity }}%</p>
        <p>현재 풍속: {{ city.wind }}</p>
      </div>
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
.observation {
  margin: 18px 0;
  padding: 16px;
  border-radius: 6px;
  background: #f5f7fa;
}
.observation p {
  margin: 3px 0;
}
.back-link {
  display: inline-block;
  padding: 8px 12px;
  border-radius: 4px;
  color: white;
  background: #30475e;
  text-decoration: none;
}
</style>
