import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/activity/list',
    method: 'get',
    params: query
  })
}

export function deleteArticle(id) {
  console.log(id)
  return request({
    url: '/activity/delete',
    method: 'get',
    params: { 'activityId': id }
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
    url: '/activity/insert',
    method: 'get',
    params: data
  })
}

export function updateArticle(data) {
  return request({
    url: '/activity/update',
    method: 'get',
    params: data
  })
}
