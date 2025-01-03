import { login, logout, getInfo, resetUser } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import { getDoctorInformation, getOlderInformation } from '@/api/leave'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  id: '',
  doctorId: '',
  olderId: '',
  relationId: '',
  roles: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_ID: (state, id) => {
    state.id = id
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_DOCTORID: (state, doctorId) => {
    state.doctorId = doctorId
  },
  SET_OLDER: (state, olderId) => {
    state.olderId = olderId
  },
  SET_RELATION: (state, relationId) => {
    state.relationId = relationId
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          reject('登录过期，请重新登录！')
        }

        const { rolePrivileges, roleName, roleImage, roleId } = data

        // roles must be a non-empty array
        if (!rolePrivileges || rolePrivileges.length <= 0) {
          reject('没有登录权限，请联系管理员！')
        }

        commit('SET_ROLES', rolePrivileges)
        if (rolePrivileges.includes('医护人员')) {
          dispatch('getDoctorInfo', roleId)
        } else if (rolePrivileges.includes('家属')) {
          dispatch('getOlderInfo', roleId)
        }
        commit('SET_ID', roleId)
        commit('SET_NAME', roleName)
        commit('SET_AVATAR', roleImage)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        commit('SET_ID', '')
        commit('SET_DOCTORID', '')
        commit('SET_OLDER', '')
        commit('SET_RELATION', '')
        commit('SET_NAME', '')
        commit('SET_AVATAR', '')
        removeToken()
        resetRouter()

        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, { root: true })

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  resetUser({ commit }, User) {
    return new Promise((resolve, reject) => {
      resetUser(User).then(response => {
        const { data } = response
        commit('SET_NAME', data.roleName)
        commit('SET_AVATAR', data.roleImage)
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  getDoctorInfo({ commit }, roleId) {
    return new Promise(async(resolve, reject) => {
      await getDoctorInformation(roleId).then(response => {
        const { data } = response
        if (this.state.user.doctorId === '' || this.state.user.doctorId !== data.doctorId) {
          commit('SET_DOCTORID', data.doctorId)
        }
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getOlderInfo({ commit }, roleId) {
    return new Promise(async(resolve, reject) => {
      await getOlderInformation(roleId).then(response => {
        const { data } = response
        if (this.state.user.olderId === '' || this.state.user.olderId !== data.olderId) {
          commit('SET_OLDER', data.olderId)
        }
        if (this.state.user.relationId === '' || this.state.user.relationId !== data.relationId) {
          commit('SET_RELATION', data.relationId)
        }
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const { roles } = await dispatch('getInfo')

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true })
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
