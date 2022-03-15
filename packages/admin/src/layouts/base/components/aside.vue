<template>
  <el-aside
    :width="asideWide"
    :class="[$style.aside, isCollapsed ? $style.asideCollapsed : '']"
  >
    <div :class="$style.asideLogo">
      <div v-if="!isCollapsed" :class="$style.asideLogoDesc">
        <h3 :class="$style.descTitle">Tomorrow</h3>
      </div>
      <h3 v-else :class="$style.asideLogoDesc">T</h3>
    </div>
    <el-scrollbar :class="$style.asideWrap">
      <el-menu
        v-if="roleRoutes.length > 0"
        background-color="#cf7217"
        text-color="#fff"
        active-text-color="#ffd04b"
        :collapse="isCollapsed"
        :router="true"
        :class="$style.asideWrapMenu"
      >
        <template v-for="route in roleRoutes">
          <template v-if="!route.meta?.isHiddenChild">
            <el-sub-menu :key="route.uid" :index="route.uid">
              <template #title>
                <svg :class="[$style.menuIcon, 'icon']" aria-hidden="true">
                  <use :xlink:href="route.meta?.icon" />
                </svg>
                <span>{{ route.meta?.label }}</span>
              </template>
              <template v-for="croute in route.children">
                <template v-if="!croute.meta?.hidden">
                  <template
                    v-if="croute.children && croute.children.length > 0"
                  >
                    <el-sub-menu :key="croute.uid" :index="route.uid">
                      <el-menu-item
                        v-for="sroute in croute.children"
                        :key="sroute.uid"
                        :index="sroute.uid"
                        :route="{ name: sroute.name }"
                        >{{ sroute.meta?.label }}</el-menu-item
                      >
                    </el-sub-menu>
                  </template>
                  <el-menu-item
                    v-else
                    :key="croute.uid"
                    :index="croute.uid"
                    :route="{ name: croute.name }"
                    >{{ croute.meta?.label }}</el-menu-item
                  >
                </template>
              </template>
            </el-sub-menu>
          </template>
          <el-menu-item
            v-else
            :key="route.uid"
            :index="route.uid"
            :route="{ name: route.name }"
          >
            <svg :class="[$style.menuIcon, 'icon']" aria-hidden="true">
              <use :xlink:href="route.meta?.icon" />
            </svg>
            <span>{{ route.meta?.label }}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </el-scrollbar>
  </el-aside>
</template>

<script lang="ts" setup>
import { computed, defineProps } from 'vue'
import uniqueid from 'lodash.uniqueid'
import type { RouteRecordRaw } from 'vue-router'
import { useRoutesStore } from '@/store/routes'
import type { StoreState } from '@/store/routes'
type CustomRouter = RouteRecordRaw & {
  uid: string
  children?: CustomRouter[]
}
const props = defineProps<{ isCollapsed: boolean }>()
const asideWide = computed(() => {
  return props.isCollapsed ? '64px' : '200px'
})
const routesStore = useRoutesStore()

const formatRoutes = (routes: StoreState['roleRoutes']): CustomRouter[] => {
  return (
    routes.map((route) => {
      const _route: CustomRouter = {
        ...route,
        uid: uniqueid('route-'),
        children: formatRoutes(route.children || []),
      }
      return _route
    }) || []
  )
}

const roleRoutes = computed<CustomRouter[]>(() => {
  return formatRoutes(routesStore.roleRoutes)
})
</script>

<style lang="scss" module>
.aside {
  height: 100vh;
  background: var(--el-color-primary);
  &Collapsed {
    width: 64px;
  }
  &Logo {
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: var(--el-color-primary);
    &Pic {
      font-size: 48px;
    }
    &Desc {
      color: #fff;
      margin-left: 10px;
      .desc {
        &Title {
          width: 100%;
          text-align: center;
          font-size: 20px;
        }
      }
    }
  }
  &Wrap {
    max-height: calc(100vh - 62px);
    .el-scrollbar__bar is-vertical {
      display: none !important;
    }
    &Menu {
      border-right: 0;
      .menu {
        &Icon {
          margin-right: 8px;
          color: #fff;
        }
      }
    }
  }
}
</style>
