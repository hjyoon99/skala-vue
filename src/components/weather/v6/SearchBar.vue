<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

defineProps({
  query: { type: String, required: true },
  loading: { type: Boolean, default: false },
})
const emit = defineEmits(['update-query', 'submit'])

const draft = ref('')

function onSubmit() {
  const value = draft.value.trim()
  if (!value) {
    ElMessage.warning('도시 이름을 입력하세요.')
    return
  }
  emit('submit', value)
  draft.value = ''
}
</script>

<template>
  <div class="search-bar">
    <el-form label-position="top">
      <el-form-item label="목록 필터">
        <el-input
          :model-value="query"
          placeholder="표시 중인 카드에서 이름으로 필터"
          clearable
          @update:model-value="emit('update-query', $event)"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item label="새 도시 실시간 조회">
        <el-input
          v-model="draft"
          placeholder="예: 강릉, London, Tokyo"
          clearable
          @keyup.enter="onSubmit"
        >
          <template #append>
            <el-button type="primary" :loading="loading" @click="onSubmit">조회</el-button>
          </template>
        </el-input>
      </el-form-item>
    </el-form>

    <el-text size="small" type="info">
      검색 중인 도시: <strong>{{ query || '(전체)' }}</strong>
    </el-text>
  </div>
</template>
