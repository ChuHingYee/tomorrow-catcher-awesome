import { createRouter, createWebHistory } from 'vue-router'
import { constantRouterMap } from './default.config'
const router = createRouter({
  history: createWebHistory(),
  routes: [...constantRouterMap],
})

export default router
