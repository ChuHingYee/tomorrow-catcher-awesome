import type { AxiosRequestConfig } from 'axios'
import axios from 'axios'
import { ElLoading, ElMessage } from 'element-plus'
import 'element-plus/es/components/message/style/css'
import 'element-plus/es/components/loading/style/css'
import type { LoadingInstance } from 'element-plus/lib/components/loading/src/loading'
import type { MessageHandle } from 'element-plus/lib/components/message'
import { useUserStore } from '@/store/user'
import { RefreshToken } from '@/apis/common'
import { getStorage, setStorage } from '@/utils/index'

export interface CustomAxiosConfig extends AxiosRequestConfig {
  isCancelLast?: boolean
  loading?: boolean
  withoutToken?: boolean
}

interface Pending {
  u: string
  f: () => void
}

let loadingInstance: LoadingInstance // 加载中提示实例
let messageInstance: MessageHandle // 消息提示实例
const pending: Pending[] = [] // 声明一个数组用于存储每个ajax请求的取消函数和ajax标识
let refreshTokenRequest = null as null | Promise<any>
const CancelToken = axios.CancelToken
/**
 * 更新token
 */
const refreshToken = async () => {
  const store = useUserStore()
  const currentUserInfo = store.userInfo
  if (!refreshTokenRequest) {
    refreshTokenRequest = RefreshToken({
      _id: currentUserInfo.id,
      token: currentUserInfo.refreshToken,
    })
  }
  const refreshResult = await refreshTokenRequest
  const { token, refreshToken } = refreshResult
  currentUserInfo.token = token
  currentUserInfo.refreshToken = refreshToken
  if (currentUserInfo.isRemerber) {
    setStorage('userInfo', currentUserInfo)
  }
  store.$patch({
    userInfo: currentUserInfo,
  })
  refreshTokenRequest = null
  Promise.resolve('refresh-success')
}

/**
 * 错误信息展示
 * @param code
 */
const showMessage = (code: number | string, message?: string) => {
  const httpCodes: Record<number | string, string> = {
    400: '错误请求',
    401: '未授权',
    403: '禁止访问',
    404: '请求错误',
    408: '请求超时',
    409: '服务器拒绝请求',
    413: '请求实体过长',
    414: '请求网址过长',
    422: '请求参数错误',
    500: '服务器错误',
    502: '网关错误',
    503: '服务不可用',
    504: '网关超时',
    timeout: '网络超时，请稍后重新尝试',
  }
  messageInstance = ElMessage({
    message: message || httpCodes[code] || '网络出错，请稍后重新尝试',
    type: code >= 500 ? 'error' : 'warning',
  })
}

/**
 * 删除请求队列
 * @param config
 */
const removePending = (config: AxiosRequestConfig) => {
  const _index = pending.findIndex((item) => {
    if (item.u === `${config.url}&${config.method}`) {
      // 当当前请求在数组中存在时执行函数体
      item.f() // 执行取消操作
      return true
    } else {
      return false
    }
  })
  if (_index !== -1) {
    pending.splice(_index, 1) // 把这条记录从数组中移除
  }
}

/**
 * 取消请求
 * @param rest
 */
export const cancelFetch = (rest: AxiosRequestConfig) => {
  removePending(rest) // 在一个ajax发送前执行一下取消操作
  rest.cancelToken = new CancelToken((c) => {
    pending.push({ u: `${rest.url}&${rest.method}`, f: c })
  })
}

const service = axios.create({
  timeout: 100000, // request timeout
  baseURL: import.meta.env.VITE_BASE_URL,
})

/**
 * 错误处理
 * @param error
 * @returns
 */
const handleErr = async (error: any) => {
  const store = useUserStore()
  const { response } = error
  if (response) {
    if (loadingInstance) {
      loadingInstance.close()
    }
    if (messageInstance) {
      messageInstance.close()
    }
    if (response.status === 401) {
      if (response.config.url !== 'api/user/refresh') {
        await refreshToken()
        return Promise.reject(new Error('refresh-success'))
      } else {
        showMessage(response.status, response.data.message)
        refreshTokenRequest = null
        store.logout()
      }
    } else {
      showMessage(response.status, response.data.message)
    }
  } else {
    const errorStr = `${error}`
    if (errorStr.includes('timeout')) {
      showMessage('timeout')
    } else {
      showMessage('')
    }
  }
  return Promise.reject(error)
}

service.interceptors.request.use(async (config) => {
  const store = useUserStore()
  const { isCancelLast, withoutToken, ...rest } = config as CustomAxiosConfig
  const userInfo = store.userInfo.id ? store.userInfo : getStorage('userInfo')
  if (refreshTokenRequest && config.url !== 'api/user/refresh') {
    // 登录、注册、验证码、刷新token接口不需要判断时间
    await refreshTokenRequest
  }
  rest.headers = {
    ...rest.headers,
    'Content-Type': 'application/json;charset=UTF-8',
  }

  // 取消请求
  if (isCancelLast) {
    cancelFetch(rest)
  }

  // 设置token
  if (!withoutToken) {
    rest.headers.Authorization = `Bearer ${userInfo.token}`
  }
  return rest
}, handleErr)

service.interceptors.response.use((response) => {
  removePending(response.config) // 在一个ajax响应后再执行一下取消操作，把已经完成的请求从pending中移除
  return response
}, handleErr)

export function request<T>({
  loading = false,
  isCancelLast = true,
  withoutToken = false,
  ...rest
}: CustomAxiosConfig) {
  return new Promise<T>((resolve, reject) => {
    if (loading) {
      loadingInstance = ElLoading.service({
        text: '加载中...',
      })
    }
    service({
      ...rest,
      isCancelLast,
      withoutToken,
    } as AxiosRequestConfig)
      .then(
        (res) => {
          if (res.status === 200 && res.data.success) {
            const { data } = res
            resolve(data.data ? data.data : data.message)
          } else {
            reject(res)
          }
        },
        async (error) => {
          if (error === 'refresh-success') {
            resolve(
              request({
                loading,
                isCancelLast,
                withoutToken,
                ...rest,
              })
            )
          } else {
            reject(error)
          }
          reject(error)
        }
      )
      .finally(() => {
        if (loading) {
          loadingInstance.close()
        }
      })
  })
}
