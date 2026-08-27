import http from './http'

/** 좌표로 현재 날씨 조회 */
export function getCurrentWeatherByCoord(lat, lon) {
  return http.get('/data/2.5/weather', { params: { lat, lon } })
}

/** 도시 이름으로 현재 날씨 조회 */
export function getCurrentWeatherByCity(cityName) {
  return http.get('/data/2.5/weather', { params: { q: cityName } })
}

/** 좌표로 5일 / 3시간 예보 조회 */
export function getForecastByCoord(lat, lon) {
  return http.get('/data/2.5/forecast', { params: { lat, lon } })
}

/** 좌표로 대기질 조회 */
export function getAirPollutionByCoord(lat, lon) {
  return http.get('/data/2.5/air_pollution', { params: { lat, lon } })
}

/** 도시 이름 → 좌표 후보 목록  */
export function geocodeCity(cityName, limit = 5) {
  return http.get('/geo/1.0/direct', { params: { q: cityName, limit } })
}
