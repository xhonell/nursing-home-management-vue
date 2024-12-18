import request from '@/utils/request'

export function findAllGradeList(query){
  return request({
    url:'/grade/findAllGradeList',
    method:'get',
    params:query  //表单数据
  })
}
