<script setup>
defineProps({
  query: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['update-query'])

function onInput(event) {
  emit('update-query', event.target.value)
}
</script>

<template>
  <div class="search-bar">
    <h2>🔍 도시 검색</h2>
    <input type="text" :value="query" placeholder="검색할 도시 이름 입력" @input="onInput" />
    <p>
      검색 중인 도시: <strong>{{ query }}</strong>
    </p>
  </div>
</template>

<style scoped>
.search-bar input {
  width: 100%;
  padding: 10px;
}
</style>
