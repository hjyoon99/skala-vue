<template>
  <section class="about-card">
    <h2>ℹ️ 서비스 소개</h2>
    <div class="description">
      <p>본 앱은 Vue 3 및 Vue Router 기반으로 제작된 실습용 기상 관측 대시보드입니다.</p>
      <ul>
        <li>독립 부품 컴포넌트 연동</li>
        <li>새로고침 없는 클라이언트 사이드 화면 전환</li>
        <li>URL 쿼리 스트링을 활용한 검색 상태 동기화</li>
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
