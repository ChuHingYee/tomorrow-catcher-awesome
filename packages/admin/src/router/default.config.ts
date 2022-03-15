import type { RouteRecordRaw } from 'vue-router'
import LoginLayout from '@/layouts/login/login.vue'
import BaseLayout from '@/layouts/base/base.vue'

/**
 * 公共路由
 */
export const constantRouterMap: Array<RouteRecordRaw> = [
  {
    path: '/login',
    meta: {
      name: 'Login',
      label: '登陆',
      isHiddenChild: false,
      hidden: false,
    },
    component: LoginLayout,
    children: [
      {
        path: '',
        name: 'Login',
        component: () =>
          import(/* webpackChunkName: "login" */ '@/views/Login/login.vue'),
      },
    ],
  },
]

/**
 * 错误处理路由
 */
export const exceptionRouter: RouteRecordRaw = {
  path: '/:pathMatch(.*)*',
  name: '403',
  redirect: '403',
  component: BaseLayout,
  meta: {
    label: '工作台',
    isHiddenChild: false,
    hidden: false,
  },
  children: [
    {
      path: '403',
      component: () =>
        import(
          /* webpackChunkName: "home" */ '@/views/Exception/403/index.vue'
        ),
      name: '403Page',
      meta: {
        label: '403Page',
        isHiddenChild: false,
        hidden: false,
      },
    },
  ],
}
