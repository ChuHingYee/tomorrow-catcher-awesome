import type { RouteRecordRaw } from 'vue-router'

export const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Dashborad',
    meta: {
      label: '工作台',
      icon: '#icon-gongzuotai',
      isHiddenChild: true,
      hidden: false,
    },
    component: () =>
      import(/* webpackChunkName: "Dashborad" */ '@/layouts/base/base.vue'),
    redirect: '/dashborad',
    children: [
      {
        path: 'dashborad',
        name: 'DashboradIndex',
        component: () =>
          import(
            /* webpackChunkName: "Dashborad" */ '@/views/Dashborad/index.vue'
          ),
        meta: {
          label: '工作台首页',
          auth: ['admin'],
          isHiddenChild: false,
          hidden: false,
        },
      },
    ],
  },
  {
    path: '/list',
    name: 'Bugs',
    meta: {
      label: '日志统计',
      icon: '#icon-bug1',
      auth: [],
      isHiddenChild: false,
      hidden: false,
    },
    component: () =>
      import(/* webpackChunkName: "Dashborad" */ '@/layouts/base/base.vue'),
    redirect: '/list/index',
    children: [
      {
        path: 'index',
        name: 'BugsIndex',
        component: () =>
          import(/* webpackChunkName: "Logs" */ '@/views/Logs/index.vue'),
        meta: {
          label: '日志列表',
          auth: ['admin'],
          isHiddenChild: false,
          hidden: false,
        },
      },
      {
        path: 'detail',
        name: 'BugsDetail',
        component: () =>
          import(/* webpackChunkName: "Logs" */ '@/views/Logs/detail.vue'),
        meta: {
          label: '错误详情',
          auth: ['admin'],
          hidden: true,
          isHiddenChild: false,
        },
      },
    ],
  },
  {
    path: '/types',
    name: 'Types',
    meta: {
      label: '应用管理',
      icon: '#icon-yingyong',
      hidden: false,
      isHiddenChild: false,
    },
    component: () =>
      import(/* webpackChunkName: "Dashborad" */ '@/layouts/base/base.vue'),
    redirect: '/types/index',
    children: [
      {
        path: 'index',
        name: 'TypesIndex',
        component: () =>
          import(/* webpackChunkName: "Types" */ '@/views/Types/index.vue'),
        meta: {
          label: '应用列表',
          auth: ['admin'],
          hidden: false,
          isHiddenChild: false,
        },
      },
      {
        path: 'detail',
        name: 'TypesDetail',
        component: () =>
          import(/* webpackChunkName: "Types" */ '@/views/Types/detail.vue'),
        meta: {
          label: '应用详情',
          auth: ['admin'],
          hidden: true,
          isHiddenChild: false,
        },
      },
    ],
  },
  {
    path: '/users',
    name: 'Users',
    meta: {
      label: '用户管理',
      icon: '#icon-yonghuguanli',
      hidden: false,
      isHiddenChild: false,
    },
    component: () =>
      import(/* webpackChunkName: "Dashborad" */ '@/layouts/base/base.vue'),
    redirect: '/users/index',
    children: [
      {
        path: 'index',
        name: 'UsersIndex',
        component: () =>
          import(/* webpackChunkName: "Users" */ '@/views/Users/index.vue'),
        meta: {
          label: '用户列表',
          auth: ['admin'],
          hidden: false,
          isHiddenChild: false,
        },
      },
      {
        path: 'detail',
        name: 'UsersDetail',
        component: () =>
          import(/* webpackChunkName: "Users" */ '@/views/Users/detail.vue'),
        meta: {
          label: '用户详情',
          auth: ['admin'],
          hidden: true,
          isHiddenChild: false,
        },
      },
    ],
  },
]
