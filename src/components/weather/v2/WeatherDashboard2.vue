<script setup>
import { computed, ref, watch, watchEffect } from 'vue'

const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
])

const searchQuery = ref('')
const selectedCityInfo = ref(null)

// 본인만의 반응형 상태 변수: 섭씨/화씨 선택
const isFahrenheit = ref(false)

const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim()

  if (!query) return weatherList.value

  return weatherList.value.filter((item) => item.name.includes(query))
})

// 본인만의 computed: 선택한 온도 단위 표시
const temperatureUnit = computed(() => {
  return isFahrenheit.value ? '℉' : '℃'
})

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

// 본인만의 watcher: 온도 단위 변경 감시
watch(isFahrenheit, (newValue) => {
  const unit = newValue ? '화씨' : '섭씨'
  console.log(`[watch] 온도 단위 변경: ${unit}`)
})

function selectCity(cityInfo) {
  // 같은 도시를 다시 선택해도 watch가 실행되도록 새 객체로 저장합니다.
  selectedCityInfo.value = { ...cityInfo }
}

function showDetail(cityName, status) {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}

function onChange(event) {
  console.log('onChange started')
  searchQuery.value = event.target.value
  console.log('onChange completed')
}

function displayTemperature(celsius) {
  if (isFahrenheit.value) {
    return Math.round((celsius * 9) / 5 + 32)
  }

  return celsius
}
</script>

<template>
  <div class="dashboard-wrapper">
    <section class="search-box">
      <h2>🔍 도시 검색</h2>
      <input
        type="text"
        :value="searchQuery"
        placeholder="검색할 도시 이름 입력"
        @input="onChange"
      />
      <p>
        검색 중인 도시: <strong>{{ searchQuery }}</strong>
      </p>
    </section>

    <section class="list-box">
      <div class="list-header">
        <h2>🏙️ 지역별 날씨 현황</h2>
        <label>
          <input v-model="isFahrenheit" type="checkbox" />
          화씨로 보기
        </label>
      </div>

      <article
        v-for="item in filteredWeatherList"
        :key="item.id"
        class="weather-card"
        :class="{ selected: selectedCityInfo?.id === item.id }"
        @click="selectCity(item)"
      >
        <div>
          <h3>{{ item.name }} ({{ item.status }})</h3>
          <p>현재 기온: {{ displayTemperature(item.temp) }}{{ temperatureUnit }}</p>
          <span v-if="item.temp >= 25" class="temperature-badge hot"> 🔥 더움 (25도 이상) </span>
          <span v-else class="temperature-badge cool"> ❄️ 선선함 (25도 미만) </span>
        </div>

        <button @click.stop="showDetail(item.name, item.status)">상세보기</button>
      </article>

      <p v-if="filteredWeatherList.length === 0">검색 결과가 일치하는 도시가 없습니다.</p>
    </section>

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
