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
  <el-card
    class="weather-card"
    :class="{ selected }"
    shadow="never"
    body-style="padding: 14px 16px;"
    @click="emit('select-card', city)"
  >
    <div class="row">
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
          <div class="name-line">
            <span class="name">{{ city.name }}</span>
            <el-button
              text
              circle
              size="small"
              :aria-label="favorite ? '관심 지역 해제' : '관심 지역 등록'"
              @click.stop="emit('toggle-favorite', city.id)"
            >
              <el-icon :color="favorite ? '#f7ba2a' : '#c0c4cc'">
                <StarFilled v-if="favorite" />
                <Star v-else />
              </el-icon>
            </el-button>
          </div>

          <template v-if="hasData">
            <el-text type="info" size="small">{{ city.status }}</el-text>
            <p class="temp">
              현재 기온 <strong>{{ displayTemp }}{{ configStore.unitSymbol }}</strong>
            </p>
            <el-tag
              :type="badge.className === 'hot' ? 'danger' : 'primary'"
              size="small"
              effect="light"
            >
              {{ badge.text }}
            </el-tag>
          </template>
          <el-text v-else-if="city.error" type="danger" size="small">⚠️ {{ city.error }}</el-text>
          <el-text v-else type="info" size="small">불러오는 중…</el-text>
        </div>
      </div>

      <el-button plain size="small" @click.stop="emit('click-detail', city.id)">상세보기</el-button>
    </div>
  </el-card>
</template>

<style scoped>
.weather-card {
  margin: 10px 0;
  border-radius: 8px;
  cursor: pointer;
}
.weather-card.selected {
  border-color: var(--el-color-primary);
  background: var(--el-color-primary-light-9);
}
.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.left {
  display: flex;
  align-items: center;
  gap: 12px;
}
.icon {
  flex-shrink: 0;
}
.name-line {
  display: flex;
  align-items: center;
  gap: 4px;
}
.name {
  font-size: 16px;
  font-weight: 700;
}
.temp {
  margin: 4px 0 8px;
}
</style>
