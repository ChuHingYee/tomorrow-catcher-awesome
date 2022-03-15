import { request } from '../utils/request'

/**
 * 获取用户列表
 * @param params
 * @returns
 */
export const GetUsersList = (params: API.UsersListPageQuery) => {
  return request<API.CustomPageResponse<API.UserInfo>>({
    url: '/api/user/page',
    method: 'get',
    params,
  })
}

/**
 * 切换应用状态
 * @param params
 * @returns
 */
export const UpdateUserStatus = (data: API.UpdateUserStatusParams) => {
  return request<boolean>({
    url: '/api/user/status',
    method: 'put',
    data,
    loading: true,
  })
}

/**
 * 获取用户信息
 * @param params
 * @returns
 */
export const GetUserInfo = (params: API.GetUserInfoParams) => {
  return request<API.UserInfo>({
    url: '/api/user',
    method: 'get',
    params,
  })
}

/**
 * 更新用户信息
 * @param params
 * @returns
 */
export const UpdateUserInfo = (data: API.UpdateUserInfoParams) => {
  return request<API.UserInfo>({
    url: '/api/user/info',
    method: 'put',
    data,
    loading: true,
  })
}

/**
 * 管理员修改密码
 * @param params
 * @returns
 */
export const UpdateUserPasswordByAdmin = (
  data: API.UpdateUserPasswordByAdminParams
) => {
  return request({
    url: '/api/user/admin/password',
    method: 'put',
    data,
    loading: true,
  })
}

/**
 * 更新用户信息
 * @param params
 * @returns
 */
export const UpdateUserPassword = (data: API.UpdateUserPasswordParams) => {
  return request({
    url: '/api/user/password',
    method: 'put',
    data,
    loading: true,
  })
}

/**
 * 更新用户信息
 * @param params
 * @returns
 */
export const AddUser = (data: API.AddUserParams) => {
  return request<string>({
    url: '/api/user',
    method: 'post',
    data,
    loading: true,
  })
}
