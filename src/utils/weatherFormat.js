/** OpenWeatherMap 응답을 화면에서 쓰기 좋은 형태로 다듬는 헬퍼 모음. */

/** 섭씨(metric 기준) → 화면 표시 온도. isFahrenheit 이면 화씨로 변환. */
export function toDisplayTemp(celsius, isFahrenheit) {
  if (celsius === null || celsius === undefined || Number.isNaN(celsius)) return '--'
  return isFahrenheit ? Math.round((celsius * 9) / 5 + 32) : Math.round(celsius)
}

/** OWM 날씨 아이콘 코드 → 아이콘 이미지 URL */
export function iconUrl(code) {
  return code ? `https://openweathermap.org/img/wn/${code}@2x.png` : ''
}

/** 25℃ 이상이면 "더움", 미만이면 "선선함" 라벨/클래스 */
export function heatLabel(celsius) {
  return celsius >= 25
    ? { text: '🔥 더움 (25도 이상)', className: 'hot' }
    : { text: '❄️ 선선함 (25도 미만)', className: 'cool' }
}

/** 대기질 지수(1~5) → 한글 등급 */
export function aqiLabel(aqi) {
  return ['정보 없음', '좋음', '보통', '나쁨', '매우 나쁨', '위험'][aqi] ?? '정보 없음'
}

/** current weather API 원본 응답 → 대시보드 카드용 요약 객체 */
export function normalizeCurrent(raw) {
  return {
    name: raw.name,
    country: raw.sys?.country ?? '',
    temp: raw.main?.temp ?? null,
    feelsLike: raw.main?.feels_like ?? null,
    humidity: raw.main?.humidity ?? null,
    wind: raw.wind?.speed ?? null,
    pressure: raw.main?.pressure ?? null,
    status: raw.weather?.[0]?.description ?? '정보 없음',
    icon: raw.weather?.[0]?.icon ?? '',
    lat: raw.coord?.lat ?? null,
    lon: raw.coord?.lon ?? null,
  }
}

/** forecast API 원본 응답 → 날짜별 대표값(정오 근처) 최대 5일 */
export function normalizeForecast(raw) {
  const list = raw.list ?? []
  const byDay = new Map()

  for (const item of list) {
    const day = item.dt_txt.slice(0, 10)
    const hour = Number(item.dt_txt.slice(11, 13))
    const prev = byDay.get(day)
    // 각 날짜에서 12시에 가장 가까운 항목을 대표값으로 사용
    if (!prev || Math.abs(hour - 12) < Math.abs(prev.hour - 12)) {
      byDay.set(day, {
        day,
        hour,
        temp: item.main.temp,
        tempMin: item.main.temp_min,
        tempMax: item.main.temp_max,
        status: item.weather?.[0]?.description ?? '',
        icon: item.weather?.[0]?.icon ?? '',
      })
    }
  }

  return [...byDay.values()].slice(0, 5)
}
