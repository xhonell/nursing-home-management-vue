import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/health/list',
    method: 'get',
    params: { params:query }
  })
}

export function fetchArticle(id) {
  return request({
    url: '/vue-element-admin/article/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/vue-element-admin/article/pv',
    method: 'get',
    params: { pv }
  })
}

export function createArticle(data) {
  return request({
    url: '/health/create',
    method: 'post',
    data
  })
}
export function getOlderName(){
  return request({
    url: '/health/getOlderName',
    method: 'get',
  })
}
export function deleteArticle(id) {
    return request({
      url: '/health/delete',
      method: 'post',
      params: { "healthId" : id }
    })
  }

export function updateArticle(data) {
  return request({
    url: '/health/update',
    method: 'post',
    data
  })
}
