import request from '@/utils/request'


export function findByPage(query) {
  return request({
    url: '/older/findByPage',
    method: 'get',
    params:query //表单数据
  })
}
export function deleteOlder(olderId) {
  return request({
    url: '/older/deleteOlder',
    method: 'get',
    params:{"olderId":olderId}  //表单数据
  })
}
export function addOlder(data) {
  return request({
    url: '/older/addOlder',
    method: 'post',
    data  //JSON数据
  })
}

export function updateOlder(data) {
  return request({
    url: '/older/updateOlder',
    method: 'post',
    data  //JSON数据
  })
}

export function findAllOlderHealthList(query){
  return request({
    url:'/older/findAllOlderHealthList',
    method:'get',
    params:query  //表单数据
  })
}
