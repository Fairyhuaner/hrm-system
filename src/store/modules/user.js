import { login, getInfo, getUserDetailById } from '@/api/user'
import { setToken, getToken, removeToken, setTime } from '@/utils/auth'
import { resetRouter } from '@/router'
const state = () => ({
  token: getToken(),
  userInfo: {}
})
const mutations = {
  setToken (state, payload) {
    state.token = payload
  },
  setUserInfo (state, payload) {
    state.userInfo = payload
  },
  removeToken (state) {
    state.token = null
    removeToken()
  },
  removeUserInfo (state) {
    state.userInfo = {}
  }
}
// 登录
const actions = {
  async login (context, data) {
    const res = await login(data)
    context.commit('setToken', res)
    setToken(res)
    setTime(Date.now())
  },
  // 获取用户个人信息
  async getInfo (context) {
    const res = await getInfo()
    const res1 = await getUserDetailById(res.userId)
    context.commit('setUserInfo', { ...res, ...res1 })
    return res //! 把个人权限return出去
  },
  logout (context) {
    context.commit('removeToken')
    context.commit('removeUserInfo')
    resetRouter() // 重置路由表
    context.commit('permission/setRoutes', [], { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
