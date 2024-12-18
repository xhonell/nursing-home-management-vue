import request from '@/utils/request'

export function findPositionByDepartmentIdList(query){
  return request({
    url:'/position/findPositionByDepartmentIdList',
    method:'get',
    params:query  //表单数据
  })
}

export function findPositionAllList(query){
  return request({
    url:'/position/findPositionAllList',
    method:'get',
    params:query  //表单数据
  })
}

