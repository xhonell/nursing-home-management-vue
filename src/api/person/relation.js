import request from '@/utils/request'

export function findByPage(query) {
  return request({
    url: '/relation/findByPage',
    method: 'get',
    params: query // 表单数据
  })
}

export function deleteRelation(relationId) {
  return request({
    url: '/relation/deleteRelation',
    method: 'get',
    params: { 'relationId': relationId } // 表单数据
  })
}
export function addRelation(data) {
  return request({
    url: '/relation/addRelation',
    method: 'post',
    data // JSON数据
  })
}

export function updateRelation(data) {
  return request({
    url: '/relation/updateRelation',
    method: 'post',
    data // JSON数据
  })
}

export function findAllRelationshipList() {
  return request({
    url: '/relation/findAllRelationship',
    method: 'get',
  })
}
