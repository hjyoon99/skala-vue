<script setup>
import { computed } from 'vue'
import { useConfigStore } from '@/stores/configStore'

const props = defineProps({
  city: { type: Object, required: true },
  selected: { type: Boolean, default: false },
})
const emit = defineEmits(['select-card', 'click-detail'])
const configStore = useConfigStore()
const displayTemp = computed(() => {
  return configStore.isFahrenheit ? Math.round((props.city.temp * 9) / 5 + 32) : props.city.temp
})
</script>

<template>
  <article class="weather-card" :class="{ selected }" @click="emit('select-card', city)">
    <div>
      <h3>{{ city.name }} ({{ city.status }})</h3>
      <p>현재 기온: {{ displayTemp }}{{ configStore.unitSymbol }}</p>
      <span :class="['badge', city.temp >= 25 ? 'hot' : 'cool']">
        {{ city.temp >= 25 ? '🔥 더움' : '❄️ 선선함' }}
      </span>
    </div>
    <button type="button" @click.stop="emit('click-detail', city.id)">상세보기</button>
  </article>
</template>

<style scoped>
.weather-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 12px 0;
  padding: 16px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  cursor: pointer;
}
.weather-card.selected {
  border-color: #409eff;
  background: #ecf5ff;
}
h3,
p {
  margin: 0 0 8px;
}
.badge {
  display: inline-block;
  padding: 5px 10px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: bold;
}
.hot {
  color: #c45656;
  border: 1px solid #fab6b6;
  background: #fef0f0;
}
.cool {
  color: #337ecc;
  border: 1px solid #a0cfff;
  background: #ecf5ff;
}
button {
  padding: 6px 12px;
  cursor: pointer;
}
</style>
