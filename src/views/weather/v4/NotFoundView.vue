<template>
  <section class="not-found">
    <div class="icon">☀️ ❓</div>
    <h2>페이지를 찾을 수 없습니다.</h2>
    <p>요청하신 주소가 존재하지 않거나,<br />아직 개발되지 않았습니다.</p>
    <RouterLink to="/">날씨 메인으로 이동</RouterLink>
  </section>
</template>

<style scoped>
.not-found {
  max-width: 520px;
  margin: 90px auto;
  padding: 64px 30px;
  border-radius: 16px;
  background: white;
  box-shadow: 0 4px 12px #0002;
  text-align: center;
}
.icon {
  font-size: 64px;
}
.not-found p {
  color: #7c8792;
}
.not-found a {
  display: inline-block;
  margin-top: 20px;
  padding: 10px 24px;
  border-radius: 24px;
  color: white;
  background: #168ef4;
  text-decoration: none;
}
</style>
