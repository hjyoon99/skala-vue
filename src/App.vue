<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import UnitToggler from '@/components/weather/v6/UnitToggler.vue'

const route = useRoute()
const router = useRouter()

const activeIndex = computed(() => route.path)

function onSelect(index) {
  if (index !== route.path) router.push(index)
}
</script>

<template>
  <el-container class="app-container">
    <el-header height="auto">
      <h1>🌤️ 종합실습 7: Element Plus UI</h1>
      <div class="nav-row">
        <el-menu
          :default-active="activeIndex"
          mode="horizontal"
          :ellipsis="false"
          @select="onSelect"
        >
          <el-menu-item index="/">🌦️ 날씨 대시보드</el-menu-item>
          <el-menu-item index="/favorites">⭐ 관심 지역</el-menu-item>
          <el-menu-item index="/about">ℹ️ 서비스 소개</el-menu-item>
        </el-menu>
        <UnitToggler />
      </div>
    </el-header>

    <el-main>
      <RouterView />
    </el-main>
  </el-container>
</template>

<style scoped>
.app-container {
  max-width: 900px;
  margin: 0 auto;
}
h1 {
  padding-bottom: 12px;
  border-bottom: 1px solid var(--el-border-color);
}
.nav-row {
  display: flex;
  align-items: center;
  gap: 14px;
  margin: 12px 0;
}
.nav-row .el-menu {
  flex: 1;
  border-bottom: 0;
}
@media (max-width: 760px) {
  .nav-row {
    flex-wrap: wrap;
  }
}
</style>
