<template>
  <el-header :class="$style.header">
    <div :class="$style.headerLeft">
      <el-icon :size="20" @click="trggleSiderType">
        <expand v-if="isCollapsed" is-collapsed></expand>
        <fold v-else></fold>
      </el-icon>
    </div>
    <div :class="$style.headerRight">
      <el-dropdown trigger="click" @command="handleCommand">
        <div :class="$style.headerRightInfo">
          <svg class="icon" :class="$style.infoAva" aria-hidden="true">
            <use xlink:href="#icon-yonghu2" />
          </svg>
          <span :class="$style.infoName">{{
            userInfo.name ? userInfo.name : userInfo.account
          }}</span>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="info">
              <user-filled :class="$style.infoIcon"></user-filled>
              <span>个人信息</span>
            </el-dropdown-item>
            <el-dropdown-item command="logout">
              <timer :class="$style.infoIcon"></timer>
              <span>退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </el-header>
</template>

<script lang="ts" setup>
import { Expand, Fold, Timer, UserFilled } from '@element-plus/icons-vue'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
type commandKey = 'logout' | 'info'

const props = defineProps<{ isCollapsed: boolean }>()
const emits = defineEmits<{
  (e: 'trggle-aside', data: boolean): void
}>()

const userStore = useUserStore()
const router = useRouter()

const userInfo = computed(() => {
  return userStore.userInfo
})
function trggleSiderType() {
  emits('trggle-aside', !props.isCollapsed)
}
function handleCommand(key: commandKey) {
  if (key === 'info') {
    router.push({
      path: '/users/detail',
      query: {
        id: userInfo.value.id,
      },
    })
  } else if (key === 'logout') {
    userStore.logout().then(() => {
      router.push('/login')
    })
  }
}
</script>

<style lang="scss" module>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0 0 24px;
  border-bottom: 1px solid var(--el-border-color);
  background: #fff;
  height: 60px;
  &Left {
    display: flex;
    align-items: center;
    height: 100%;
    &Icon {
      font-size: 20px;
      margin-right: 16px;
      cursor: pointer;
      color: var(--el-text-color-primary);
      &:hover {
        color: val(--el-color-primary);
      }
    }
    &Logo {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      margin-right: 16px;
    }
    &Company {
      font-size: 20px;
      font-weight: 500;
    }
  }
  &Right {
    &Info {
      padding: 0 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      cursor: pointer;
      .infoAva {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        margin-right: 5px;
        font-size: 30px;
      }
      .infoName {
        display: inline-block;
        max-width: 100px;
      }
    }
  }
}
.infoIcon {
  font-size: 16px;
  margin-right: 3px;
}
</style>
