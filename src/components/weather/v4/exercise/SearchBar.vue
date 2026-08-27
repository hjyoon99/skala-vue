<script setup>
defineProps({ query: { type: String, required: true } })
const emit = defineEmits(['update-query'])
</script>

<template>
  <div class="search-bar">
    <h2>🔍 도시 검색</h2>
    <input
      type="search"
      :value="query"
      placeholder="검색할 도시 이름 입력"
      @input="emit('update-query', $event.target.value)"
    />
    <p>
      검색 중인 도시: <strong>{{ query }}</strong>
    </p>
  </div>
</template>

<style scoped>
input {
  width: 100%;
  padding: 10px;
}
</style>
