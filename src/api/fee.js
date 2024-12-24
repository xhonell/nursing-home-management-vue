import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/fee/list',
    method: 'get',
    params: { params: query }
  })
}

export function fetchArticle(id) {
  return request({
    url: '/vue-element-admin/fee/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/vue-element-admin/fee/pv',
    method: 'get',
    params: { pv }
  })
}

export function createArticle(data) {
  return request({
    url: '/fee/create',
    method: 'post',
    data
  })
}

export function deleteArticle(feeId) {
  return request({
    url: '/fee/delete',
    method: 'delete',
    params: { feeId }
  })
}

export function updateArticle(data) {
  return request({
    url: '/fee/update',
    method: 'post',
    data
  })
}
