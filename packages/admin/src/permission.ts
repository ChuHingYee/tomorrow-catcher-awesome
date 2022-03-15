import NProgress from 'nprogress' // progress bar
import type { RouteRecordRaw } from 'vue-router'
import router from './router/index'
import { useUserStore } from './store/user'
import { useRoutesStore } from './store/routes'
import 'nprogress/nprogress.css' // progress bar style
import { exceptionRouter } from './router/default.config'
import { getStorage, removeStorage } from './utils/index'

// NProgress Configuration
NProgress.configure({
  showSpinner: false,
})

// no redirect whitelist
const whiteList = ['/login']

router.beforeEach(async (to, from, next) => {
  // 根据登录信息判断菜单显示，完成单点登录后去掉
  // start progress bar
  NProgress.start()
  const userStore = useUserStore()
  const routesStore = useRoutesStore()
  const userInfo = userStore.userInfo.id
    ? userStore.userInfo
    : getStorage('userInfo')
  /* has token */
  if (userInfo && userInfo.id) {
    if (!userStore.userInfo.id) {
      userStore.$patch({
        userInfo: {
          ...userInfo,
          isRemerber: true,
        },
      })
    }
    if (routesStore.roleRoutes.length === 0) {
      try {
        routesStore.filterRoleRouters({
          roles: userInfo.roles,
        })
        if (routesStore.roleRoutes.length > 0) {
          routesStore.roleRoutes.forEach((route: RouteRecordRaw) => {
            router.addRoute(route)
          })
          router.addRoute(exceptionRouter)
          if (to.path === '/' || to.path === '/403') {
            next('/')
          } else {
            next({
              ...to,
              replace: true,
            })
          }
        } else {
          userStore.logout().then(() => {
            next('/login') // 否则全部重定向到登录页
            NProgress.done()
          })
        }
      } catch (error) {
        routesStore.$patch({
          roleRoutes: [],
        })
        userStore.logout().then(() => {
          next('/login') // 否则全部重定向到登录页
          NProgress.done()
        })
      }
    } else {
      // 是否跳转登录页
      if (to.path === '/login') {
        next('/')
        NProgress.done()
      } else {
        next()
      }
    }
  } else {
    /* has no token */
    removeStorage('last-mousemove-time')
    if (whiteList.includes(to.path)) {
      // 在免登录白名单，直接进入
      next()
    } else {
      next('/login') // 否则全部重定向到登录页
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
