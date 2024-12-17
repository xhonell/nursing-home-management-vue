import request from '@/utils/request'

export function sendCode(email) {
  return request({
    url: '/login/sendCode',
    method: 'get',
    params: { "email":email }
  })
}

export function resetPass(data) {
  return request({
    url: '/login/reset',
    method: 'post',
    data
  })
}