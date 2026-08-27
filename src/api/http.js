import axios from 'axios'

const API_KEY = import.meta.env.VITE_OWM_API_KEY ?? ''
const UNITS = import.meta.env.VITE_OWM_UNITS ?? 'metric'
const LANG = import.meta.env.VITE_OWM_LANG ?? 'kr'

/** API 키가 세팅되어 있는지 (없으면 store 가 데모 데이터로 폴백) */
export const hasApiKey = API_KEY.trim().length > 0

const http = axios.create({
  baseURL: 'https://api.openweathermap.org',
  timeout: 10000,
})

// 요청 직전: 인증 키와 공통 옵션을 자동 탑승시킨다.
http.interceptors.request.use((config) => {
  config.params = {
    appid: API_KEY,
    units: UNITS,
    lang: LANG,
    ...config.params,
  }
  return config
})

// 응답 직후: 성공이면 data 만 넘기고, 실패면 공통 에러 메시지로 가공한다.
http.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status
    let message = error.response?.data?.message || error.message || '알 수 없는 통신 오류'

    if (status === 401)
      message = 'API 키가 유효하지 않습니다. .env 의 VITE_OWM_API_KEY 를 확인하세요.'
    else if (status === 404) message = '요청한 도시를 찾을 수 없습니다.'
    else if (status === 429) message = '무료 호출 한도를 초과했습니다. 잠시 후 다시 시도하세요.'

    return Promise.reject(new Error(message))
  },
)

export default http
