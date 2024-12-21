import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/goods/list',
    method: 'get',
    params: query
  })
}

export function fetchArticle(id) {
  return request({
    url: '/article/detail',
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
    url: '/goods/create',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: '/goods/update',
    method: 'post',
    data
  })
}
export function deleteArticle(id) {
    return request({
      url: '/goods/delete',
      method: 'post',
      params: { "goodsId" : id }
    })
  }
