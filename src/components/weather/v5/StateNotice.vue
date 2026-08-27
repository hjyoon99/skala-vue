<script setup>
defineProps({
  type: { type: String, default: 'info' }, // info | loading | error
  message: { type: String, required: true },
})
</script>

<template>
  <p class="state-notice" :class="type" role="status">
    <span v-if="type === 'loading'" class="spinner" aria-hidden="true" />
    {{ message }}
  </p>
</template>

<style scoped>
.state-notice {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin: 8px 0;
  padding: 14px;
  border-radius: 8px;
  font-weight: 600;
}
.info {
  color: #606266;
  background: #f4f4f5;
}
.loading {
  color: #337ecc;
  background: #ecf5ff;
}
.error {
  color: #c45656;
  background: #fef0f0;
}
.spinner {
  width: 14px;
  height: 14px;
  border: 2px solid #a0cfff;
  border-top-color: #337ecc;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
