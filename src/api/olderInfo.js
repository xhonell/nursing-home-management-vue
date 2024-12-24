import request from '@/utils/request'

export function getInfo(relationId) {
  return request({
    url: '/olderInfo/getInfo',
    method: 'get',
    params: { relationId: relationId }
  })
}

export function updateInfo(data) {
  return request({
    url: '/olderInfo/updateInfo',
    method: 'post',
    data
  })
}
