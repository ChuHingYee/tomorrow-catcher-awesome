<template>
  <el-dialog v-model="localVisilbe" :title="title" width="480px">
    <div class="import">
      <el-form ref="form" label-width="100px" :model="formData" :rules="rules">
        <el-form-item label="应用名称" prop="name">
          <el-input v-model="formData.name" placeholder="应用名称" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio :label="0">停用</el-radio>
            <el-radio :label="1">正常</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <el-button plain @click="localVisilbe = false">取消</el-button>
      <el-button type="primary" plain @click="handleConfirm">确定</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { computed, nextTick, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useVModel } from '@vueuse/core'
import type { PropType } from 'vue'
import { AddType, UpdateType } from '@/apis/types'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  current: {
    type: [Object, null] as PropType<API.TypeInfo | null>,
    default: null,
  },
})
const emits = defineEmits<{
  (e: 'success'): void
}>()
const localVisilbe = useVModel(props, 'visible')
const form = ref<any>('')
const formData = ref({
  name: '',
  status: 1 as 0 | 1,
})
const rules = ref({
  name: [
    {
      message: '请输入应用名称',
      required: true,
      trigger: 'blur',
    },
  ],
})

const title = computed(() => {
  return props.current?._id ? '修改应用' : '添加应用'
})
watch(
  () => props.visible,
  (val: boolean) => {
    if (val) {
      nextTick(() => {
        form.value.resetFields()
        if (props.current?._id) {
          formData.value.name = props.current.name
          formData.value.status = props.current.status
        }
      })
    }
  }
)
function handleConfirm() {
  form.value.validate((valid: boolean) => {
    if (valid) {
      let params = {
        name: formData.value.name,
        status: formData.value.status,
      }
      if (props.current) {
        ;(params as API.UpdateTypeParams) = {
          ...params,
          _id: props.current._id,
        }
        UpdateType(params as API.UpdateTypeParams).then(() => {
          ElMessage.success('修改成功')
          emits('success')
          localVisilbe.value = false
        })
      } else {
        ;(params as API.AddTypeParams) = {
          ...params,
        }
        AddType(params as API.AddTypeParams).then(() => {
          ElMessage.success('新增成功')
          emits('success')
          localVisilbe.value = false
        })
      }
    } else {
      return false
    }
  })
}
</script>

<style lang="scss" scoped></style>
