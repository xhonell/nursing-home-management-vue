import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/visitor/list',
    method: 'get',
    params: { params: query }
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
    url: '/visitor/create',
    method: 'post',
    data
  })
}
export function deleteArticle(id) {
  return request({
    url: '/visitor/delete',
    method: 'post',
    params: { 'visitorId': id }
  })
}

export function updateArticle(data) {
  return request({
    url: '/visitor/update',
    method: 'post',
    data
  })
}
