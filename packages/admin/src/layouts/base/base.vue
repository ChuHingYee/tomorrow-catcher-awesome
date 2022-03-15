<template>
  <el-container :class="$style.layout">
    <custom-aside :is-collapsed="isCollapsed" />
    <el-container :class="$style.layoutMain">
      <custom-header
        :class="$style.layoutMainHeader"
        :style="absoluteStyle"
        :is-collapsed="isCollapsed"
        @trggle-aside="handleTrggleAside"
      />
      <el-main :class="$style.layoutMainWrap">
        <el-scrollbar
          :wrap-class="$style.wrapContainer"
          :view-class="$style.wrapContainerView"
        >
          <router-view />
        </el-scrollbar>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import CustomHeader from './components/header.vue'
import CustomAside from './components/aside.vue'
const isCollapsed = ref(false)
const absoluteStyle = computed(() => {
  return {
    left: isCollapsed.value ? '64px' : '200px',
  }
})

const handleTrggleAside = (flag: boolean) => {
  isCollapsed.value = flag
}
</script>

<style lang="scss" module>
.layout {
  min-width: 980px;
  height: 100vh;
  min-height: 500px;
  background: #ebebeb;
  &Main {
    display: flex;
    flex-direction: column !important;
    height: 100%;

    &Header {
      z-index: 2;
      width: 100%;
    }

    &Wrap {
      position: relative;
      flex: auto;
      flex: 1;
      height: 0;
      padding: 0 !important;

      .wrap {
        &Container {
          padding: 0 !important;

          &View {
            height: 100%;
          }
        }
      }
    }
  }
}
</style>
