import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/care/list',
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
    url: '/care/create',
    method: 'post',
    data
  })
}
export function deleteArticle(id) {
    return request({
      url: '/care/delete',
      method: 'get',
      params: { "careId" : id }
    })
  }

export function updateArticle(data) {
  return request({
    url: '/care/update',
    method: 'post',
    data
  })
}
