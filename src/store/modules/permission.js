import { constantRoutes, asyncRoutes } from '@/router'
const state = () => ({
  routes: [] // 动态权限
})
const mutations = {
  setRoutes (state, payload) {
    state.routes = payload
  }
}
const actions = {
  filter (context, menus) {
    const newRoutes = asyncRoutes.filter(item => menus.includes(item.meta.name))
    context.commit('setRoutes', [...constantRoutes, ...newRoutes])
    return newRoutes
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
