import request from '@/utils/request'

export function findAllDepartmentList(query) {
  return request({
    url: '/department/findAllDepartmentList',
    method: 'get',
    params: query // 表单数据
  })
}
