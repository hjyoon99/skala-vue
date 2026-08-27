<script setup>
import { useConfigStore } from '@/stores/configStore'

const configStore = useConfigStore()
</script>

<template>
  <div class="unit-toggler">
    <span>날씨단위: {{ configStore.unitName }}({{ configStore.unitSymbol }})</span>
    <button type="button" @click="configStore.toggleUnit">단위변경</button>
  </div>
</template>

<style scoped>
.unit-toggler {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: auto;
  white-space: nowrap;
}

.unit-toggler span {
  color: #606266;
}

button {
  padding: 7px 10px;
  border: 0;
  border-radius: 5px;
  color: white;
  background: #466985;
  font-weight: bold;
  cursor: pointer;
}
</style>
