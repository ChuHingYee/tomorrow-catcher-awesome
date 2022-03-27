<template>
  <container title="应用详情" @back="goBack">
    <div class="detail">
      <el-skeleton :rows="5" animated :loading="isLoading">
        <el-descriptions :border="true" :column="2" class="detail-wrap">
          <el-descriptions-item label="应用名称">{{
            detail.name
          }}</el-descriptions-item>
          <el-descriptions-item label="应用key">{{
            detail._id
          }}</el-descriptions-item>
          <el-descriptions-item label="应用状态">{{
            formatStatus(detail.status)
          }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{
            formatTimeClock(detail.createdAt)
          }}</el-descriptions-item>
          <el-descriptions-item label="更新时间">{{
            formatTimeClock(detail.updatedAt)
          }}</el-descriptions-item>
        </el-descriptions>
        <div class="detail-wrap">
          <div class="detail-wrap__upload">
            <el-upload
              class="upload-demo"
              action="http://localhost:7001/api/type/file"
              :data="{ appId: typeId }"
              name="files"
              :show-file-list="false"
              :on-success="getDetail"
              :headers="{
                Authorization: token,
              }"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <template #tip>
                <div class="el-upload__tip">只能上传 map 文件</div>
              </template>
            </el-upload>
          </div>
          <adv-table :data="detail.list" :total="detail.list.length">
            <el-table-column prop="name" label="文件名称" />
            <el-table-column label="操作" width="120">
              <template #default="{ row }">
                <el-button type="text" @click="handleDel(row._id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </adv-table>
        </div>
      </el-skeleton>
    </div>
  </container>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { AdvTable } from '@advanced-elements/table'
import Container from '@/components/Container/index.vue'
import { DelFile, GetTypeDetail } from '@/apis/types'
import { formatTimeClock } from '@/utils/index'
import { useUserStore } from '@/store/user'

type CustomStatus = -1 | API.TypeDetailResponse['status']
const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const token = computed(() => {
  return `Bearer ${userStore.userInfo.token}`
})
const detail = ref({
  list: [] as API.TypeDetailResponse['files'],
  name: '',
  status: -1 as CustomStatus,
  createdAt: '',
  updatedAt: '',
  _id: '',
})
const isLoading = ref(false)
const typeId = ref('')
function goBack() {
  router.back()
}
function getDetail() {
  isLoading.value = true
  GetTypeDetail({
    id: typeId.value,
  }).then((res) => {
    detail.value.list = res.files || []
    detail.value.name = res.name
    detail.value.status = res.status
    detail.value.createdAt = res.createdAt
    detail.value.updatedAt = res.updatedAt
    detail.value._id = res._id
    isLoading.value = false
  })
}
function formatStatus(status: CustomStatus): string {
  const map = {
    0: '停用',
    1: '正常',
    '-1': '-',
  }
  return map[status]
}
function handleDel(_id: string): void {
  ElMessageBox.confirm('此操作将删除该文件, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    DelFile({
      fileId: _id,
      typeId: typeId.value,
    }).then(() => {
      ElMessage.success('操作成功')
      getDetail()
    })
  })
}

onMounted(() => {
  if (route.query.id) {
    typeId.value = route.query.id as string
    getDetail()
  }
})
</script>

<style lang="scss" scoped>
.detail {
  &-wrap {
    background: #fff;
    margin-bottom: 24px;
    &__upload {
      padding: 24px;
    }
  }
}
</style>
