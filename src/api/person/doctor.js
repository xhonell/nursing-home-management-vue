import request from '@/utils/request'

export function findByPage(query) {
  return request({
    url: '/doctor/findByPage',
    method: 'get',
    params: query // 表单数据
  })
}
export function deleteDoctor(doctorId) {
  return request({
    url: '/doctor/deleteDoctor',
    method: 'get',
    params: { 'doctorId': doctorId } // 表单数据
  })
}
export function addDoctor(data) {
  return request({
    url: '/doctor/addDoctor',
    method: 'post',
    data // JSON数据
  })
}

export function updateDoctor(data) {
  return request({
    url: '/doctor/updateDoctor',
    method: 'post',
    data // JSON数据
  })
}
