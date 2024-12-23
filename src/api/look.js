import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/look/list',
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

export function createLook(data) {
  return request({
    url: '/look/create',
    method: 'post',
    data
  })
}
export function deleteLook(id) {
  return request({
    url: '/look/delete',
    method: 'post',
    params: { 'lookId': id }
  })
}

export function updateLook(data) {
  return request({
    url: '/look/update',
    method: 'post',
    data
  })
}
