<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const features = [
  { text: 'Axios 인스턴스 + 인터셉터로 OpenWeatherMap REST API 연동', type: 'primary' },
  { text: 'Current Weather · 5 Day Forecast · Air Pollution · Geocoding API', type: 'success' },
  { text: 'Pinia 스토어에서 Promise.all 병렬 호출 및 로딩/에러 상태 관리', type: 'warning' },
  { text: 'Element Plus UI 라이브러리 적용 (Card·Form·Tag·Alert·Descriptions 등)', type: 'danger' },
  { text: '단위 전환(℃/℉), URL 쿼리 검색 동기화, localStorage 관심 지역', type: 'info' },
]
</script>

<template>
  <el-card>
    <template #header><span class="title">ℹ️ 서비스 소개</span></template>
    <p>
      OpenWeatherMap API 를 Axios 로 연동하고 Element Plus 로 화면을 구성한 실시간 기상
      대시보드입니다.
    </p>
    <el-timeline class="mt">
      <el-timeline-item v-for="(f, i) in features" :key="i" :type="f.type" :hollow="true">
        {{ f.text }}
      </el-timeline-item>
    </el-timeline>
    <el-button type="primary" @click="router.push('/')">대시보드 홈으로 이동</el-button>
  </el-card>
</template>

<style scoped>
.title {
  font-size: 16px;
  font-weight: 700;
}
.mt {
  margin-top: 12px;
}
</style>
