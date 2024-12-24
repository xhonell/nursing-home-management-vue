import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/room/list',
    method: 'get',
    params: query
  })
}

export function deleteArticle(id) {
  return request({
    url: '/room/delete',
    method: 'get',
    params: { 'roomId': id }
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
    url: '/room/insert',
    method: 'get',
    params: data
  })
}

export function updateArticle(data) {
  return request({
    url: '/room/update',
    method: 'get',
    params: data
  })
}
