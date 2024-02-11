import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/components/BaseLayout.vue'),
      children: [
        {
          path: '/orders',
          name: 'Orders',
          component: () => import('@/components/OrderList.vue')
        },
        {
          path: '/cities',
          name: 'Cities',
          component: () => import('@/components/CityList.vue')
        },
        {
          path: '/routes',
          name: 'Routes',
          component: () => import('@/components/RouteList.vue')
        },
        {
          path: '/vehicles',
          name: 'Vehicles',
          component: () => import('@/components/VehicleList.vue')
        }
      ]
    }
  ]
})

export default router
