import { acceptHMRUpdate, defineStore } from 'pinia'
import { Login } from '@/apis/common'
import { removeStorage, setStorage } from '@/utils/index'

interface LoginParamsFromForm extends API.LoginParams {
  isRemerber: boolean
}

interface UserInfo {
  name: string
  account: string
  roles: string[]
  token: string
  refreshToken: string
  id: string
  lastLoginTime: number
  isRemerber: boolean
}

interface StoreState {
  userInfo: UserInfo
}

interface StoreActions {
  login: (data: LoginParamsFromForm) => Promise<UserInfo>
  logout: () => Promise<boolean>
}

export const useUserStore = defineStore<'user', StoreState, any, StoreActions>({
  id: 'user',
  state: () => ({
    userInfo: {
      name: '',
      account: '',
      roles: [],
      token: '',
      refreshToken: '',
      id: '',
      lastLoginTime: 0,
      isRemerber: true,
    },
  }),
  actions: {
    login(data: LoginParamsFromForm) {
      return new Promise((resolve, reject) => {
        const { isRemerber, ...rest } = data
        Login(rest)
          .then((res) => {
            this.userInfo = {
              isRemerber,
              ...res,
            }
            setStorage('userInfo', res)
            resolve(this.userInfo)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    async logout() {
      this.userInfo = {
        name: '',
        account: '',
        roles: [],
        token: '',
        refreshToken: '',
        id: '',
        lastLoginTime: 0,
        isRemerber: true,
      }
      await removeStorage('userInfo')
      return true
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
}
