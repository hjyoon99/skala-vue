<template>
  <section class="about-card">
    <h2>ℹ️ 서비스 소개</h2>
    <div class="description">
      <p>OpenWeatherMap REST API 를 Axios 로 연동한 실시간 기상 관측 대시보드입니다.</p>
      <ul>
        <li>Axios 인스턴스 + 요청/응답 인터셉터 (공통 파라미터 주입, 에러 메시지 정규화)</li>
        <li>Current Weather · 5 Day Forecast · Air Pollution · Geocoding API 활용</li>
        <li>Pinia 스토어에서 <code>Promise.all</code> 병렬 호출 및 상태(로딩/에러) 관리</li>
        <li>단위 전환(℃/℉), URL 쿼리 검색 동기화, localStorage 기반 관심 지역</li>
        <li>API 키 미설정 시 데모 데이터로 자동 폴백</li>
      </ul>
    </div>
    <RouterLink class="home-link" to="/">대시보드 홈으로 이동</RouterLink>
  </section>
</template>

<style scoped>
.about-card {
  padding: 20px;
  border: 1px solid #e4e7ed;
  border-radius: 10px;
  background: #fff;
}
.description {
  margin: 18px 0;
  padding: 16px;
  border-radius: 6px;
  background: #f8f9fa;
}
.description code {
  padding: 1px 4px;
  border-radius: 3px;
  background: #ecf5ff;
}
.home-link {
  display: block;
  padding: 10px;
  border-radius: 4px;
  color: #fff;
  background: #0aa5df;
  text-align: center;
  text-decoration: none;
}
</style>
