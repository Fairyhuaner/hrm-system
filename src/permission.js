import router from '@/router'
import NProgress from 'nprogress'
import store from '@/store'
import 'nprogress/nprogress.css'

// 白名单
const whiteList = ['/login', '/404']
// 前置路由守卫
router.beforeEach(async (to, from, next) => {
  // 开启进度效果
  NProgress.start()
  // 权限控制
  const token = store.state.user.token
  if (token) {
    if (to.path === '/login') {
      NProgress.done()
      next('/')
    } else {
      // 优化 让ajax只发送一次
      if (!store.state.user.userInfo.id) {
        // 当用户手里面有token并且访问的不是登录页面，那就应该请求个人资料
        //! 当前账号能访问到的权限点
        const { roles } = await store.dispatch('user/getInfo')
        console.log('动态权限', roles.menus)
        const newRoutes = await store.dispatch('permission/filter', roles.menus)
        console.log('动态路由', newRoutes)
        router.addRoutes([...newRoutes, { path: '*', redirect: '/404', hidden: true }])
        // to.path 就是指当前路径
        next(to.path)
      }
      next() // 放行
    }
  } else {
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/login')
    }
  }
})

// 后置路由守卫
router.afterEach(() => {
  // 结束进度效果
  NProgress.done()
})
