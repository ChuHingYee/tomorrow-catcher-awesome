<template>
  <el-dialog v-model="localVisilbe" title="添加用户" width="480px">
    <div class="import">
      <el-form ref="form" label-width="100px" :model="formData" :rules="rules">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="formData.name" placeholder="姓名" />
        </el-form-item>
        <el-form-item label="账号" prop="account">
          <el-input v-model="formData.account" placeholder="账号" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-checkbox-group v-model="formData.type">
            <el-checkbox :label="0"> 管理员 </el-checkbox>
            <el-checkbox :label="1" :disabled="true"> 用户 </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <ElButton plain @click="localVisilbe = false"> 取消 </ElButton>
      <ElButton type="primary" plain @click="handleConfirm"> 确定 </ElButton>
    </template>
    <el-dialog
      v-model="innerVisible"
      width="360px"
      title="账号密码"
      append-to-body
      center
      :before-close="handleClose"
    >
      <div>{{ userPassword }}</div>
    </el-dialog>
  </el-dialog>
</template>

<script lang="ts" setup>
import { nextTick, ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useVModel } from '@vueuse/core'
import { AddUser } from '@/apis/users'
import 'element-plus/es/components/message-box/style/css'
import 'element-plus/es/components/message/style/css'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  id: {
    type: String,
    default: '',
  },
})
const emits = defineEmits<{
  (e: 'success'): void
}>()
const localVisilbe = useVModel(props, 'visible')
const form = ref<any>()
const formData = ref({
  name: '',
  account: '',
  type: [1],
})
const rules = ref({
  account: [
    {
      message: '请输入账号',
      required: true,
      trigger: 'blur',
    },
  ],
  name: [
    {
      message: '请输入名称',
      required: true,
      trigger: 'blur',
    },
  ],
})
const userPassword = ref('')
const innerVisible = ref(false)

watch(
  () => props.visible,
  (val: boolean) => {
    if (val) {
      nextTick(() => {
        form.value.resetFields()
        userPassword.value = ''
      })
    }
  }
)
function handleConfirm() {
  form.value.validate((valid: boolean) => {
    if (valid) {
      AddUser({
        account: formData.value.account,
        name: formData.value.name,
        type: formData.value.type,
      }).then((res) => {
        userPassword.value = res
        ElMessage.success('添加成功')
        emits('success')
        innerVisible.value = true
      })
    } else {
      return false
    }
  })
}
function handleClose() {
  ElMessageBox.alert('确认关闭？请保存好账户密码', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    innerVisible.value = false
    localVisilbe.value = false
  })
}
</script>

<style lang="scss" scoped></style>
