import request from '@/utils/request'

export function findByPage(query) {
  return request({
    url: '/doctor/findByPage',
    method: 'get',
    params: query // 表单数据
  })
}

export function deleteDoctors(doctorIds) {
  return request({
    url: '/doctor/deleteDoctors',
    method: 'get',
    params:doctorIds
  });
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

export function detailByPage(query) {
  return request({
    url: '/doctor/detailByPage',
    method: 'get',
    params: query // 表单数据
  })
}

export function updateDetail(data) {
  return request({
    url: '/doctor/updateDetail',
    method: 'post',
    data // JSON数据
  })
}
