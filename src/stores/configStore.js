import { defineStore } from 'pinia'

export const useConfigStore = defineStore('config', {
  state: () => ({
    unit: 'celsius',
    lastChangedAt: null,
  }),

  getters: {
    unitSymbol: (state) => (state.unit === 'celsius' ? '℃' : '℉'),
    unitName: (state) => (state.unit === 'celsius' ? '섭씨' : '화씨'),
    isFahrenheit: (state) => state.unit === 'fahrenheit',
  },

  actions: {
    toggleUnit() {
      this.unit = this.unit === 'celsius' ? 'fahrenheit' : 'celsius'
      this.lastChangedAt = new Date().toISOString()
    },
    resetUnit() {
      this.unit = 'celsius'
      this.lastChangedAt = new Date().toISOString()
    },
  },
})
