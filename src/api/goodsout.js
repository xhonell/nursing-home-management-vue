import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/goodsout/list',
    method: 'get',
    params: query
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
    url: '/goodsout/create',
    method: 'post',
    data
  })
}
export function deleteArticle(id) {
    return request({
      url: '/goodsout/delete',
      method: 'post',
      params: { "goodsOutId" : id }
    })
  }

export function updateArticle(data) {
  return request({
    url: '/goodsout/update',
    method: 'post',
    data
  })
}
