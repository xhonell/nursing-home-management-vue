import request from '@/utils/request'

/**
 * 获取设备列表
 *
 * 该函数通过发送GET请求到/equip/list端点，获取设备的列表根据提供的查询参数
 * 主要用于设备管理界面或其他需要展示设备列表的地方
 *
 * @param {Object} query - 查询参数对象，包含需要查询的条件如页码、每页条数、搜索关键词等
 * @returns {Promise} - 返回一个Promise对象，包含请求结果需要通过then/catch处理
 */
export function fetchList(query) {
  return request({
    url: '/equip/list',
    method: 'get',
    params: query
  })
}

/**
 * 根据文章ID获取文章详情
 * @param {number} id - 文章的唯一标识符
 * @returns {Promise} - 包含文章详情的Promise对象
 */
export function fetchArticle(id) {
  return request({
    url: '/article/detail',
    method: 'get',
    params: { id }
  })
}

/**
 * 获取指定ID的文章浏览量
 * @param {number} pv - 文章的唯一标识符，用于获取浏览量
 * @returns {Promise} - 包含文章浏览量的Promise对象
 */
export function fetchPv(pv) {
  return request({
    url: '/vue-element-admin/article/pv',
    method: 'get',
    params: { pv }
  })
}

/**
 * 创建新文章
 * @param {Object} data - 新文章的数据，包括标题、内容等
 * @returns {Promise} - 表示文章创建操作的Promise对象
 */
export function createArticle(data) {
  return request({
    url: '/equip/create',
    method: 'post',
    data
  })
}

/**
 * 更新文章
 * @param {Object} data - 更新后的文章数据，包括标题、内容等
 * @returns {Promise} - 表示文章更新操作的Promise对象
 */
export function updateArticle(data) {
  return request({
    url: '/equip/update',
    method: 'post',
    data
  })
}
export function deleteArticle(id) {
  return request({
    url: '/equip/delete',
    method: 'post',
    params: { 'equipId': id }
  })
}

