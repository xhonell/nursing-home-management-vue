import request from '@/utils/request'

export function getDoctorInformation(id) {
  return request({
    url: '/doctorLeave/information',
    method: 'get',
    params: { "doctorId":id }
  })
}

export function sendDoctorRequest(data) {
  return request({
    url: '/doctorLeave/request',
    method: 'post',
    data
  })
}

export function sendOlderRequest(data) {
  return request({
    url: '/olderLeave/request',
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

export function getOlderRequestInformation(id){
  return request({
    url: '/olderLeave/requestInformation',
    method: 'get',
    params: { "relationId":id }
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

export function updateOlderLeave(leaveId,leaveState){
  return request({
    url: '/adminHandle/updateOlderLeave',
    method: 'get',
    params: { "leaveId":leaveId,"leaveState":leaveState }
  })
}

export function getOlderInformation(id){
  return request({
    url: '/olderLeave/olderInformation',
    method: 'get',
    params: { "relationId":id }
  })
}