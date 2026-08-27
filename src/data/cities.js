/**
 * 대시보드 기본 표시 도시 목록.
 * id 는 라우터 동적 경로(/weather/:cityId)에 사용된다.
 */
export const SEED_CITIES = [
  { id: 'seoul', name: '서울', query: 'Seoul,KR', lat: 37.5665, lon: 126.978 },
  { id: 'suwon', name: '수원', query: 'Suwon,KR', lat: 37.2636, lon: 127.0286 },
  { id: 'busan', name: '부산', query: 'Busan,KR', lat: 35.1796, lon: 129.0756 },
  { id: 'incheon', name: '인천', query: 'Incheon,KR', lat: 37.4563, lon: 126.7052 },
  { id: 'daegu', name: '대구', query: 'Daegu,KR', lat: 35.8714, lon: 128.6014 },
  { id: 'jeju', name: '제주', query: 'Jeju,KR', lat: 33.4996, lon: 126.5312 },
]

export function findSeedCity(id) {
  return SEED_CITIES.find((city) => city.id === id) ?? null
}
