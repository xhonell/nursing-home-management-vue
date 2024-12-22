import request from '@/utils/request'

export function getEcharsAge() {
  return request({
    url: '/echars/getEcharsAge',
    method: 'get'
  })
}
