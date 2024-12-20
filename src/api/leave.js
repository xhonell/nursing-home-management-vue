import request from '@/utils/request'

export function getDoctorInformation(id) {
  return request({
    url: '/doctorLeave/information',
    method: 'get',
    params: { "doctorId":id }
  })
}

export function sendRequest(data) {
  return request({
    url: '/doctorLeave/request',
    method: 'post',
    data
  })
}

export function getRequestInformation(id){
  return request({
    url: '/doctorLeave/requestInformation',
    method: 'get',
    params: { "doctorId":id }
  })
}

export function handleDoctorLeave(){
  return request({
    url: '/adminHandle/handleDoctorLeave',
    method: 'get',
  })
}

export function updateDoctorLeave(leaveId,leaveState){
  return request({
    url: '/adminHandle/updateDoctorLeave',
    method: 'get',
    params: { "leaveId":leaveId,"leaveState":leaveState }
  })
}