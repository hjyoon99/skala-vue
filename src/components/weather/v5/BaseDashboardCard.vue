<template>
  <section class="dashboard-card">
    <header v-if="$slots.title" class="card-title">
      <slot name="title" />
    </header>
    <slot />
  </section>
</template>

<style scoped>
.dashboard-card {
  margin-bottom: 16px;
  padding: 20px;
  border: 1px solid #dcdfe6;
  border-radius: 10px;
  background: #fff;
}
.card-title {
  margin-bottom: 12px;
  font-size: 18px;
  font-weight: 700;
}
</style>
