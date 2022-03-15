import { request } from '../utils/request'

/**
 * 获取应用列表
 * @param params
 * @returns
 */
export const GetTypesList = (params: API.CustomPageQuery) => {
  return request<API.CustomPageResponse<API.TypeInfo>>({
    url: '/api/type/page',
    method: 'get',
    params,
  })
}

/**
 * 添加应用
 * @param params
 * @returns
 */
export const AddType = (data: API.AddTypeParams) => {
  return request({
    url: '/api/type',
    method: 'post',
    data,
    loading: true,
  })
}

/**
 * 修改应用
 * @param params
 * @returns
 */
export const UpdateType = (data: API.UpdateTypeParams) => {
  return request({
    url: '/api/type',
    method: 'put',
    data,
    loading: true,
  })
}

/**
 * 获取应用详情
 * @param params
 * @returns
 */
export const GetTypeDetail = (params: API.TypeDetailParams) => {
  return request<API.TypeDetailResponse>({
    url: `/api/type/${params.id}`,
    method: 'get',
  })
}

/**
 * 删除文件
 * @param params
 * @returns
 */
export const DelFile = (data: API.DelFileParams) => {
  return request({
    url: '/api/type/file',
    method: 'delete',
    data,
    loading: true,
  })
}

/**
 * 获取应用统计
 * @param params
 * @returns
 */
export const GetTypesReport = () => {
  return request<API.TypesReportResponse>({
    url: 'api/type/report',
    method: 'get',
  })
}
