import { request } from '../utils/request'

/**
 * 登录
 */
export const Login = (data: API.LoginParams) => {
  return request<API.LoginResponse>({
    url: 'api/user/login',
    method: 'post',
    data,
    loading: false,
    withoutToken: true,
  })
}

/**
 * 更新Token
 */
export const RefreshToken = (data: API.RefreshTokenParams) => {
  return request<API.RefreshTokenResponse>({
    url: 'api/user/refresh',
    method: 'post',
    data,
  })
}
