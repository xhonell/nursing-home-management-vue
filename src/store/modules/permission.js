import { constantRoutes } from '@/router'
import { router } from '@/api/user'
import Layout from '@/layout'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

function concatRouter(router) {
  const routers = []
  if (!router || router.length === 0) {
    return routers
  } else {
    router.forEach(item => {
      if (item.pageHidden === 'false') {
        item.pageHidden = false
      } else {
        item.pageHidden = true
      }
      const itemRouter = {}
      itemRouter.path = item.pagePath
      itemRouter.component = Layout
      itemRouter.hidden = item.pageHidden
      itemRouter.name = item.pageName
      itemRouter.meta = {}
      itemRouter.meta.title = item.pageTitle
      itemRouter.meta.icon = item.pageIcon
      const children = []
      item.pageChildren.forEach(child => {
        if (child.pageHidden === 'false') {
          child.pageHidden = false
        } else {
          child.pageHidden = true
        }
        const childRouter = {}
        childRouter.path = child.pagePath
        childRouter.component = (resolve) => require([`@/pages${child.pageComponent}`], resolve)
        childRouter.hidden = child.pageHidden
        childRouter.name = child.pageName
        childRouter.meta = {}
        childRouter.meta.title = child.pageTitle
        childRouter.meta.icon = child.pageIcon
        children.push(childRouter)
      })
      if (children.length > 0) {
        itemRouter.children = children
      }
      routers.push(itemRouter)
    })
  }
  return routers
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise((resolve, reject) => {
      // 这里留接口(/user/getRouter)，用作后期登录权限，需要创建一个组装权限的方法
      (async() => {
        try {
          let accessedRoutes = []
          const response = await router(roles)
          const { data } = response
          accessedRoutes = concatRouter(data)
          commit('SET_ROUTES', accessedRoutes)
          resolve(accessedRoutes)
        } catch (err) {
          reject(err)
        }
      })()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
