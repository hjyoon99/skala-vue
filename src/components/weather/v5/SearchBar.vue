<script setup>
import { ref } from 'vue'

defineProps({
  query: { type: String, required: true },
  loading: { type: Boolean, default: false },
})
const emit = defineEmits(['update-query', 'submit'])

const draft = ref('')

function onSubmit() {
  const value = draft.value.trim()
  if (!value) return
  emit('submit', value)
  draft.value = ''
}
</script>

<template>
  <div class="search-bar">
    <h2>🔍 도시 검색</h2>

    <label class="field">
      <span>목록 필터</span>
      <input
        type="search"
        :value="query"
        placeholder="표시 중인 카드에서 이름으로 필터"
        @input="emit('update-query', $event.target.value)"
      />
    </label>

    <form class="field" @submit.prevent="onSubmit">
      <span>새 도시 추가</span>
      <div class="row">
        <input v-model="draft" type="text" placeholder="예: 강릉, London, Tokyo — Enter 로 조회" />
        <button type="submit" :disabled="loading">
          {{ loading ? '조회 중…' : '실시간 조회' }}
        </button>
      </div>
    </form>

    <p class="hint">
      검색 중인 도시: <strong>{{ query || '(전체)' }}</strong>
    </p>
  </div>
</template>

<style scoped>
.search-bar h2 {
  margin: 0 0 12px;
}
.field {
  display: block;
  margin-bottom: 10px;
}
.field > span {
  display: block;
  margin-bottom: 4px;
  font-size: 13px;
  color: #909399;
}
.row {
  display: flex;
  gap: 8px;
}
input {
  flex: 1;
  width: 100%;
  padding: 10px;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
}
button {
  padding: 10px 14px;
  border: 0;
  border-radius: 6px;
  color: #fff;
  background: #168ef4;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
}
button:disabled {
  background: #a0cfff;
  cursor: progress;
}
.hint {
  margin: 6px 0 0;
  font-size: 13px;
  color: #909399;
}
</style>
