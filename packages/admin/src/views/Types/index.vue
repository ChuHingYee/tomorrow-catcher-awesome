<template>
  <container title="应用管理" :has-arror="false">
    <div class="page">
      <adv-table
        ref="table"
        :headers="headers"
        :has-refresh-btn="true"
        :source="getList"
      >
        <template #header-left>
          <el-button type="primary" @click="handleUpdate(null)"
            >添加应用</el-button
          >
        </template>
        <template #name>
          <el-table-column prop="name" label="应用名称">
            <template #default="{ row }">
              <router-link
                :to="{ path: '/types/detail', query: { id: row._id } }"
                class="link"
                >{{ row.name }}</router-link
              >
            </template>
          </el-table-column>
        </template>
        <template #appKey>
          <el-table-column prop="_id" label="应用key" />
        </template>
        <template #createAt>
          <el-table-column label="创建时间">
            <template #default="{ row }">
              {{ formatDateClock(row.createdAt) }}
            </template>
          </el-table-column>
        </template>
        <template #status>
          <el-table-column label="状态">
            <template #default="{ row }">
              {{ formatStatus(row.status) }}
            </template>
          </el-table-column>
        </template>
        <template #btns>
          <el-table-column label="操作">
            <template #default="{ row }">
              <el-button
                type="text"
                @click="handleChangeStatus(row._id, row.status)"
                >{{ row.status === 1 ? '停用' : '启用' }}</el-button
              >
              <el-button type="text" @click="handleUpdate(row)">修改</el-button>
            </template>
          </el-table-column>
        </template>
      </adv-table>
      <update-type-dialog
        v-model:visible="updateDialogVisible"
        :current="currentRow"
        @success="refreshData"
      />
    </div>
  </container>
</template>

<script lang="ts" setup>
import { nextTick, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { AdvTable } from '@advanced-elements/table'
import UpdateTypeDialog from './components/updateTypeDialog.vue'
import Container from '@/components/Container/index.vue'
import { GetTypesList, UpdateType } from '@/apis/types'
import { formatDateClock } from '@/utils/index'
import 'element-plus/es/components/icon/style/css'
import 'element-plus/es/components/button/style/css'
import 'element-plus/es/components/popover/style/css'
import 'element-plus/es/components/checkbox/style/css'
import 'element-plus/es/components/tooltip/style/css'
import 'element-plus/es/components/table/style/css'
import 'element-plus/es/components/pagination/style/css'
import 'element-plus/es/components/loading/style/css'
import 'element-plus/es/components/message/style/css'
import 'element-plus/es/components/message-box/style/css'

interface TableQuery {
  page: number
  size: number
}

const table = ref<any>(null)
const updateDialogVisible = ref(false)
const currentRow = ref<API.TypeInfo | null>(null)

const headers = [
  {
    prop: 'name',
    label: '应用名称',
  },
  {
    prop: 'appKey',
    label: '应用key',
  },
  {
    prop: 'createAt',
    label: '创建时间',
  },
  {
    prop: 'status',
    label: '状态',
  },
  {
    prop: 'btns',
    label: '操作',
  },
]

function getList(params: TableQuery) {
  return new Promise((resolve) => {
    GetTypesList({
      ...params,
    }).then((res) => {
      resolve(res)
    })
  })
}
function refreshData(): void {
  nextTick(() => {
    table.value.refresh()
  })
}
function formatStatus(status: 0 | 1): string {
  const map = {
    0: '停用',
    1: '正常',
  }
  return map[status]
}
function handleChangeStatus(_id: string, status: 0 | 1): void {
  ElMessageBox.confirm(
    `此操作将${status === 0 ? '启用' : '停用'}该应用, 是否继续?`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    UpdateType({
      _id,
      status: status === 0 ? 1 : 0,
    }).then(() => {
      ElMessage.success('操作成功')
      refreshData()
    })
  })
}
function handleUpdate(row: API.TypeInfo | null) {
  currentRow.value = row
  updateDialogVisible.value = true
}
</script>

<style lang="scss" scoped>
.page {
  &-header {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-bottom: 24px;
  }
}
</style>
