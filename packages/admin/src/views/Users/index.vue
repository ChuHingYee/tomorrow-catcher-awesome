<template>
  <container title="用户管理" :has-arror="false">
    <div class="page">
      <adv-table
        ref="table"
        :headers="headers"
        :has-refresh-btn="true"
        :source="getList"
      >
        <template #header-left>
          <el-button type="primary" @click="addDialogVisible = true"
            >添加用户</el-button
          >
        </template>
        <template #name>
          <el-table-column prop="name" label="姓名">
            <template #default="{ row }">
              <router-link
                :to="{ path: '/users/detail', query: { id: row._id } }"
                class="link"
                >{{ row.name }}</router-link
              >
            </template>
          </el-table-column>
        </template>
        <template #createAt>
          <el-table-column label="创建时间">
            <template #default="{ row }">
              {{ formatTime(row.createdAt) }}
            </template>
          </el-table-column>
        </template>
        <template #lastLogin>
          <el-table-column label="上次登陆时间">
            <template #default="{ row }">
              {{ formatLastLoginTime(row.lastLoginTime) }}
            </template>
          </el-table-column>
        </template>
        <template #status>
          <el-table-column label="状态">
            <template #default="{ row }">{{
              formatStatus(row.status)
            }}</template>
          </el-table-column>
        </template>
        <template #btns></template>
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button
              type="text"
              @click="handleChangeStatus(row._id, row.status)"
              >{{ row.status === 1 ? '停用' : '启用' }}</el-button
            >
          </template>
        </el-table-column>
      </adv-table>
      <add-user-dialog
        v-model:visible="addDialogVisible"
        @success="refreshData"
      />
    </div>
  </container>
</template>

<script lang="ts" setup>
import { nextTick, ref } from 'vue'
import { AdvTable } from '@advanced-elements/table'
import AddUserDialog from './components/addUserDialog.vue'
import { useHandleUser } from './hook/userHandle'
import Container from '@/components/Container/index.vue'
import { GetUsersList } from '@/apis/users'
import 'element-plus/es/components/icon/style/css'
import 'element-plus/es/components/button/style/css'
import 'element-plus/es/components/popover/style/css'
import 'element-plus/es/components/checkbox/style/css'
import 'element-plus/es/components/tooltip/style/css'
import 'element-plus/es/components/table/style/css'
import 'element-plus/es/components/pagination/style/css'
import 'element-plus/es/components/loading/style/css'
const { formatStatus, formatTime, formatLastLoginTime, changeStatus } =
  useHandleUser()
const table = ref<any>(null)
const addDialogVisible = ref(false)
const headers = [
  {
    prop: 'name',
    label: '姓名',
  },
  {
    prop: 'createAt',
    label: '创建时间',
  },
  {
    prop: 'lastLogin',
    label: '上次登陆时间',
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
function getList(params: API.UsersListPageQuery) {
  return new Promise((resolve) => {
    GetUsersList({
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
function handleChangeStatus(_id: string, status: 0 | 1) {
  changeStatus(_id, status).then(() => {
    refreshData()
  })
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
