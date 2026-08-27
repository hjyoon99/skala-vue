<script setup>
defineProps({
  city: {
    type: Object,
    required: true,
  },
  isSelected: {
    type: Boolean,
    default: false,
  },
  temperature: {
    type: Number,
    required: true,
  },
  temperatureUnit: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['select-card', 'click-detail'])
</script>

<template>
  <article
    class="weather-card"
    :class="{ selected: isSelected }"
    @click="emit('select-card', city)"
  >
    <div>
      <h3>{{ city.name }} ({{ city.status }})</h3>
      <p>현재 기온: {{ temperature }}{{ temperatureUnit }}</p>
      <span v-if="city.temp >= 25" class="temperature-badge hot"> 🔥 더움 (25도 이상) </span>
      <span v-else class="temperature-badge cool">❄️ 선선함 (25도 미만)</span>
    </div>

    <button type="button" @click.stop="emit('click-detail', city)">상세보기</button>
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

.weather-card h3,
.weather-card p {
  margin: 0 0 8px;
}

.temperature-badge {
  display: inline-block;
  padding: 5px 10px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: bold;
}

.temperature-badge.hot {
  color: #c45656;
  border: 1px solid #fab6b6;
  background: #fef0f0;
}

.temperature-badge.cool {
  color: #337ecc;
  border: 1px solid #a0cfff;
  background: #ecf5ff;
}

.weather-card button {
  padding: 6px 12px;
  cursor: pointer;
}
</style>
