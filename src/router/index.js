import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'weather-home',
      component: () => import('@/views/weather/v6/WeatherHomeView.vue'),
    },
    {
      path: '/about',
      name: 'weather-about',
      component: () => import('@/views/weather/v6/WeatherAboutView.vue'),
    },
    {
      path: '/weather/:cityId',
      name: 'weather-detail',
      component: () => import('@/views/weather/v6/WeatherDetailView.vue'),
    },
    {
      path: '/favorites',
      name: 'weather-favorites',
      component: () => import('@/views/weather/v6/WeatherFavoritesView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/weather/v6/NotFoundView.vue'),
    },
  ],
})

export default router
