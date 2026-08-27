<template>
  <el-card class="dashboard-card" shadow="hover">
    <template v-if="$slots.title" #header>
      <span class="card-title"><slot name="title" /></span>
    </template>
    <slot />
  </el-card>
</template>

<style scoped>
.dashboard-card {
  margin-bottom: 16px;
  border-radius: 10px;
}
.card-title {
  font-size: 16px;
  font-weight: 700;
}
</style>
