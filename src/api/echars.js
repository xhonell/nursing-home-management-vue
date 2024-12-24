import request from '@/utils/request'

export function getEcharsAge() {
  return request({
    url: '/echars/getEcharsAge',
    method: 'get'
  })
}

export function getArrears(relationId) {
  return request({
    url: '/echars/getArrears',
    method: 'get',
    params: { relationId: relationId }
  })
}

export function setArrears(id) {
  return request({
    url: '/echars/setArrears',
    method: 'get',
    params: { relationId: id }
  })
}
