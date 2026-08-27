<script setup>
import { computed } from 'vue'
import { useConfigStore } from '@/stores/configStore'
import { toDisplayTemp, iconUrl, heatLabel } from '@/utils/weatherFormat'

const props = defineProps({
  city: { type: Object, required: true },
  selected: { type: Boolean, default: false },
  favorite: { type: Boolean, default: false },
})
const emit = defineEmits(['select-card', 'click-detail', 'toggle-favorite'])

const configStore = useConfigStore()

const displayTemp = computed(() => toDisplayTemp(props.city.temp, configStore.isFahrenheit))
const badge = computed(() => heatLabel(props.city.temp ?? 0))
const hasData = computed(() => props.city.loaded && props.city.temp !== null)
</script>

<template>
  <article class="weather-card" :class="{ selected }" @click="emit('select-card', city)">
    <div class="left">
      <img
        v-if="hasData && city.icon"
        class="icon"
        :src="iconUrl(city.icon)"
        :alt="city.status"
        width="56"
        height="56"
      />
      <div class="info">
        <h3>
          {{ city.name }}
          <button
            type="button"
            class="star"
            :class="{ on: favorite }"
            :aria-label="favorite ? '관심 지역 해제' : '관심 지역 등록'"
            @click.stop="emit('toggle-favorite', city.id)"
          >
            {{ favorite ? '★' : '☆' }}
          </button>
        </h3>

        <template v-if="hasData">
          <p class="status">{{ city.status }}</p>
          <p class="temp">
            현재 기온: <strong>{{ displayTemp }}{{ configStore.unitSymbol }}</strong>
          </p>
          <span class="badge" :class="badge.className">{{ badge.text }}</span>
        </template>
        <p v-else-if="city.error" class="err">⚠️ {{ city.error }}</p>
        <p v-else class="loading">불러오는 중…</p>
      </div>
    </div>

    <button type="button" class="detail-btn" @click.stop="emit('click-detail', city.id)">
      상세보기
    </button>
  </article>
</template>

<style scoped>
.weather-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin: 12px 0;
  padding: 14px 16px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  cursor: pointer;
  transition: border-color 0.15s;
}
.weather-card:hover {
  border-color: #c0c4cc;
}
.weather-card.selected {
  border-color: #168ef4;
  background: #ecf5ff;
}
.left {
  display: flex;
  align-items: center;
  gap: 12px;
}
.icon {
  flex-shrink: 0;
}
.info h3 {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0 0 4px;
  font-size: 16px;
}
.status {
  margin: 0 0 4px;
  color: #606266;
}
.temp {
  margin: 0 0 8px;
}
.badge {
  display: inline-block;
  padding: 4px 9px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
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
.err {
  margin: 0;
  color: #c45656;
  font-size: 13px;
}
.loading {
  margin: 0;
  color: #909399;
  font-size: 13px;
}
.star {
  padding: 0;
  border: 0;
  background: none;
  color: #dcdfe6;
  font-size: 16px;
  cursor: pointer;
}
.star.on {
  color: #f7ba2a;
}
.detail-btn {
  flex-shrink: 0;
  padding: 6px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
}
</style>
