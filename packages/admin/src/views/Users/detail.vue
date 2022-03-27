<template>
  <container title="用户详情" @back="go2Back">
    <el-tabs tab-position="left" class="detail">
      <el-tab-pane label="基本设置">
        <div class="detail-wrap">
          <h2 class="detail-wrap__title">基本设置</h2>
          <el-form
            ref="form"
            class="detail-wrap__form"
            label-position="top"
            label-width="80px"
            :model="formData"
            :rules="rules"
            :disabled="!isAdmin"
          >
            <el-form-item label="姓名" prop="name">
              <el-input v-model="formData.name" />
            </el-form-item>
            <el-form-item label="状态">{{
              formatStatus(formData.status)
            }}</el-form-item>
            <el-form-item label="创建时间">{{
              formatTime(formData.createdAt)
            }}</el-form-item>
            <el-form-item label="上次登陆时间">{{
              formatLastLoginTime(formData.lastLoginTime)
            }}</el-form-item>
            <el-form-item v-if="isAdmin">
              <el-button type="primary" @click="submitForm">提交</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
      <el-tab-pane label="安全设置">
        <div class="detail-wrap">
          <h2 class="detail-wrap__title">安全设置</h2>
          <div class="detail-wrap__list">
            <div class="list-item">
              <span class="list-item__label">账号密码</span>
              <el-button
                v-if="userId === userInfo.id"
                type="text"
                @click="passwordDialogVisible = true"
                >修改</el-button
              >
              <el-button v-else-if="isAdmin" type="text" @click="resetPassword"
                >重置密码</el-button
              >
            </div>
          </div>
        </div>
      </el-tab-pane>
      <update-password-dialog
        v-model:visible="passwordDialogVisible"
        :user-id="userId"
        @success="handleChangeSuccess"
      />
    </el-tabs>
  </container>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import UpdatePasswordDialog from './components/updatePasswordDialog.vue'
import { useHandleUser } from './hook/userHandle'
import { useUserStore } from '@/store/user'
import Container from '@/components/Container/index.vue'
import {
  GetUserInfo,
  UpdateUserInfo,
  UpdateUserPasswordByAdmin,
} from '@/apis/users'

const { formatStatus, formatTime, formatLastLoginTime } = useHandleUser()
const form = ref<any>()
const userStore = useUserStore()
const route = useRoute()
const router = useRouter()
const userInfo = computed(() => {
  return userStore.userInfo
})
const isAdmin = computed(() => {
  return userInfo.value.roles.includes('admin')
})
const formData = ref({
  name: '',
  createdAt: 0,
  lastLoginTime: 0,
  status: -1 as -1 | 0 | 1,
})
const rules = ref({
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
})
const userId = ref('')
const passwordDialogVisible = ref(false)
function resetPassword() {
  ElMessageBox.confirm(`此操作将重置该用户密码, 是否继续?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    UpdateUserPasswordByAdmin({
      _id: userId.value,
    }).then((res) => {
      ElMessageBox.alert(`新密码为：${res}`, '提示', {
        confirmButtonText: 'OK',
      })
    })
  })
}
function getDetail() {
  GetUserInfo({ id: userId.value }).then((res) => {
    formData.value.name = res.name
    formData.value.createdAt = res.createdAt
    formData.value.status = res.status
  })
}
function submitForm() {
  form.value.validate((valid: boolean) => {
    if (valid) {
      UpdateUserInfo({
        _id: userId.value,
        name: formData.value.name,
      }).then(() => {
        ElMessage.success('保存成功')
        getDetail()
      })
    } else {
      return false
    }
  })
}
function go2Back() {
  router.back()
}
function handleChangeSuccess() {
  ElMessage.success('更改成功,请重新登录')
  userStore.logout().then(() => {
    router.push('/login')
  })
}
watch(
  () => route.query.id as string,
  (val: string) => {
    if (val) {
      userId.value = val
      getDetail()
    }
  },
  {
    immediate: true,
  }
)
</script>

<style lang="scss" scoped>
.detail {
  height: 500px;
  background: #fff;
  &-wrap {
    padding: 24px;
    &__title {
      font-size: 24px;
      margin-bottom: 12px;
    }
    &__form {
      width: 500px;
    }
    &__list {
      .list {
        &-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 40px;
          padding: 12px 0;
          border-bottom: var(--el-border-base);
        }
      }
    }
  }
}
</style>
