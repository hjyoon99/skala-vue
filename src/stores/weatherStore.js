import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { hasApiKey } from '@/api/http'
import {
  getCurrentWeatherByCoord,
  getForecastByCoord,
  getAirPollutionByCoord,
  geocodeCity,
} from '@/api/weatherApi'
import { SEED_CITIES, findSeedCity } from '@/data/cities'
import { normalizeCurrent, normalizeForecast } from '@/utils/weatherFormat'

const FAV_KEY = 'skala-weather:favorites'

function loadFavorites() {
  try {
    return JSON.parse(localStorage.getItem(FAV_KEY) || '[]')
  } catch {
    return []
  }
}

/* ------------------------------------------------------------------ *
 *  API 키가 없을 때 쓰는 데모(가짜) 데이터 생성기
 *  - 심사자가 키 없이도 화면 흐름을 확인할 수 있게 한다.
 * ------------------------------------------------------------------ */
const DEMO_STATUS = ['맑음', '구름 조금', '흐림', '비', '소나기']
const DEMO_ICONS = ['01d', '02d', '03d', '04d', '10d']

function demoSeed(str) {
  let h = 0
  for (const ch of str) h = (h * 31 + ch.charCodeAt(0)) >>> 0
  return h
}

function demoCurrent(city) {
  const s = demoSeed(city.id || city.name)
  const idx = s % DEMO_STATUS.length
  return {
    name: city.name,
    country: 'KR',
    temp: 12 + (s % 20),
    feelsLike: 11 + (s % 20),
    humidity: 40 + (s % 50),
    wind: 1 + (s % 6),
    pressure: 1005 + (s % 20),
    status: DEMO_STATUS[idx],
    icon: DEMO_ICONS[idx],
    lat: city.lat ?? 37.5,
    lon: city.lon ?? 127,
  }
}

function demoForecast(city) {
  const base = demoSeed(city.id || city.name)
  const today = new Date()
  return Array.from({ length: 5 }, (_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    const s = (base + i * 7) >>> 0
    const idx = s % DEMO_STATUS.length
    return {
      day: d.toISOString().slice(0, 10),
      hour: 12,
      temp: 10 + (s % 18),
      tempMin: 8 + (s % 12),
      tempMax: 16 + (s % 18),
      status: DEMO_STATUS[idx],
      icon: DEMO_ICONS[idx],
    }
  })
}

function demoAir(city) {
  return { aqi: 1 + (demoSeed(city.id || city.name) % 5), components: {} }
}

/* ------------------------------------------------------------------ */

export const useWeatherStore = defineStore('weather', () => {
  /* --- state --- */
  const cities = ref(
    SEED_CITIES.map((c) => ({ ...c, temp: null, status: '', icon: '', loaded: false })),
  )
  const loading = ref(false)
  const error = ref('')
  const lastUpdated = ref(null)
  const favorites = ref(loadFavorites())

  /* --- getters --- */
  const isDemo = computed(() => !hasApiKey)
  const favoriteCities = computed(() => cities.value.filter((c) => favorites.value.includes(c.id)))
  const isFavorite = (id) => favorites.value.includes(id)

  function findCity(id) {
    return cities.value.find((c) => c.id === id) ?? null
  }

  /* --- actions --- */

  /** 대시보드: 기본 도시들의 현재 날씨를 병렬로 불러온다. */
  async function loadDashboard() {
    loading.value = true
    error.value = ''
    try {
      const results = await Promise.all(
        cities.value.map(async (city) => {
          try {
            const raw = isDemo.value
              ? demoCurrent(city)
              : normalizeCurrent(await getCurrentWeatherByCoord(city.lat, city.lon))
            return { id: city.id, data: raw, error: '' }
          } catch (e) {
            return { id: city.id, data: null, error: e.message }
          }
        }),
      )

      cities.value = cities.value.map((city) => {
        const hit = results.find((r) => r.id === city.id)
        if (!hit?.data) return { ...city, loaded: false, error: hit?.error ?? '' }
        return { ...city, ...hit.data, loaded: true, error: '' }
      })

      lastUpdated.value = new Date()
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  /** 검색: 도시 이름을 지오코딩해서 카드 목록에 추가한다. */
  async function searchAndAddCity(name) {
    const q = name.trim()
    if (!q) return null

    loading.value = true
    error.value = ''
    try {
      let coord
      if (isDemo.value) {
        coord = {
          name: q,
          lat: 37.5 + (demoSeed(q) % 100) / 50,
          lon: 127 + (demoSeed(q) % 100) / 50,
        }
      } else {
        const [first] = await geocodeCity(q, 1)
        if (!first) throw new Error(`'${q}' 에 해당하는 도시를 찾지 못했습니다.`)
        coord = { name: first.local_names?.ko || first.name, lat: first.lat, lon: first.lon }
      }

      const id = `search-${slugify(q)}`
      const stub = { id, name: coord.name, query: q, lat: coord.lat, lon: coord.lon }
      const data = isDemo.value
        ? demoCurrent(stub)
        : normalizeCurrent(await getCurrentWeatherByCoord(coord.lat, coord.lon))

      const card = { ...stub, ...data, name: data.name || coord.name, loaded: true, error: '' }
      const existingIdx = cities.value.findIndex((c) => c.id === id)
      if (existingIdx >= 0) cities.value.splice(existingIdx, 1, card)
      else cities.value.push(card)

      lastUpdated.value = new Date()
      return card
    } catch (e) {
      error.value = e.message
      return null
    } finally {
      loading.value = false
    }
  }

  /** 상세 페이지: 현재 날씨 + 5일 예보 + 대기질을 한 번에 불러온다. */
  async function loadDetail(id) {
    const seed = findCity(id) || findSeedCity(id)
    if (!seed || seed.lat == null) {
      return { error: '해당 도시 정보를 찾을 수 없습니다.', current: null, forecast: [], air: null }
    }

    try {
      if (isDemo.value) {
        return {
          error: '',
          current: demoCurrent(seed),
          forecast: demoForecast(seed),
          air: demoAir(seed),
        }
      }

      const [currentRaw, forecastRaw, airRaw] = await Promise.all([
        getCurrentWeatherByCoord(seed.lat, seed.lon),
        getForecastByCoord(seed.lat, seed.lon),
        getAirPollutionByCoord(seed.lat, seed.lon),
      ])

      return {
        error: '',
        current: normalizeCurrent(currentRaw),
        forecast: normalizeForecast(forecastRaw),
        air: {
          aqi: airRaw.list?.[0]?.main?.aqi ?? 0,
          components: airRaw.list?.[0]?.components ?? {},
        },
      }
    } catch (e) {
      return { error: e.message, current: null, forecast: [], air: null }
    }
  }

  /** 관심 지역 토글 (localStorage 영속) */
  function toggleFavorite(id) {
    const set = new Set(favorites.value)
    if (set.has(id)) set.delete(id)
    else set.add(id)
    favorites.value = [...set]
    localStorage.setItem(FAV_KEY, JSON.stringify(favorites.value))
  }

  return {
    cities,
    loading,
    error,
    lastUpdated,
    favorites,
    isDemo,
    favoriteCities,
    isFavorite,
    findCity,
    loadDashboard,
    searchAndAddCity,
    loadDetail,
    toggleFavorite,
  }
})

function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9가-힣-]/g, '')
}
