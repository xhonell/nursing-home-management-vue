import request from '@/utils/request'

export function findService(query) {
  return request({
    url: '/service/findService',
    method: 'get',
    params: query // 表单数据
  })
}

export function updateService(data) {
  return request({
    url: '/service/updateService',
    method: 'post',
    data // JSON数据
  })
}

export function findQuestion(query) {
  return request({
    url: '/service/findQuestion',
    method: 'get',
    params: query // 表单数据
  })
}

export function addQuestion(data) {
  return request({
    url: '/service/addQuestion',
    method: 'post',
    data // JSON数据
  })
}

export function updateQuestion(data) {
  return request({
    url: '/service/updateQuestion',
    method: 'post',
    data // JSON数据
  })
}
