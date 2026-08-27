<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <el-result
    icon="warning"
    title="페이지를 찾을 수 없습니다."
    sub-title="요청하신 주소가 존재하지 않거나, 아직 개발되지 않았습니다."
  >
    <template #extra>
      <el-button type="primary" @click="router.push('/')">날씨 메인으로 이동</el-button>
    </template>
  </el-result>
</template>
