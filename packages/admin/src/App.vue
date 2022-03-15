<template>
  <el-config-provider :locale="locale">
    <router-view />
  </el-config-provider>
</template>

<script setup lang="ts">
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import { useRoutesStore } from '@/store/routes'
const userStore = useUserStore()
const routerStore = useRoutesStore()
const router = useRouter()
const locale = zhCn
const userInfo = computed(() => {
  return userStore.userInfo
})
watch(
  () => userInfo.value,
  (val) => {
    if (!val.id) {
      routerStore.resetRoleRouters()
      router.push({
        path: '/login',
      })
    }
  }
)
</script>
