import { acceptHMRUpdate, defineStore } from 'pinia'
import clonedeep from 'lodash.clonedeep'
import type { RouteRecordRaw } from 'vue-router'
import { routes } from '../router/admin.config'

interface FilterParams {
  roles: string[]
}

type RoleRoutes = RouteRecordRaw[]

type RoutesMap = Record<string, RouteRecordRaw[]>

export interface StoreState {
  roleRoutes: RoleRoutes
}

interface StoreActions {
  filterRoleRouters: (params: FilterParams) => void
  resetRoleRouters: () => void
}

export const useRoutesStore = defineStore<
  'routes',
  StoreState,
  any,
  StoreActions
>({
  id: 'routes',
  state: () => ({
    roleRoutes: [] as RoleRoutes,
  }),
  actions: {
    filterRoleRouters(params: FilterParams) {
      const { roles } = params
      const roleList: RouteRecordRaw[] = []
      const map: RoutesMap = {
        admin: clonedeep(routes),
      }
      roles.forEach((role) => {
        if (map[role]) {
          roleList.push(...map[role])
        }
      })
      this.roleRoutes = roleList
    },
    resetRoleRouters() {
      this.roleRoutes = []
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useRoutesStore, import.meta.hot))
}
