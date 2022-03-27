import { ElMessage, ElMessageBox } from 'element-plus'
import { UpdateUserStatus } from '@/apis/users'
import { formatDateClock } from '@/utils/index'

export function useHandleUser() {
  function formatStatus(status: 0 | 1 | -1): string {
    const map = {
      0: '停用',
      1: '正常',
      '-1': '-',
    }
    return map[status]
  }
  function formatTime(time: number): string {
    if (time === 0) {
      return '-'
    }
    return formatDateClock(time)
  }
  function formatLastLoginTime(time: number): string {
    if (time === 0) {
      return '-'
    }
    return formatDateClock(time)
  }
  function changeStatus(_id: string, status: 0 | 1) {
    return new Promise((resolve) => {
      ElMessageBox.confirm(
        `此操作将${status === 0 ? '启用' : '停用'}该用户, 是否继续?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).then(() => {
        UpdateUserStatus({
          _id,
          status: status === 0 ? 1 : 0,
        }).then(() => {
          ElMessage.success('操作成功')
          resolve(true)
        })
      })
    })
  }
  return { formatStatus, formatTime, formatLastLoginTime, changeStatus }
}
