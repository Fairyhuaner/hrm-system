import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

import component from '@/components'

// 打印
import Print from 'vue-print-nb'
// Global instruction
Vue.use(Print)
// import dayjs from 'dayjs'
// Vue.filter('dateformat', function (time) {
//   return dayjs(time).format('YYYY-MM-DD')
// })

// 注册全局mixin
import mixins from '@/mixins'
Vue.mixin(mixins)

import * as filters from '@/filters'
Object.keys(filters).forEach(item => {
  Vue.filter(item, filters[item])
})

Vue.use(component)

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

import i18n from '@/lang'
// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value)
})

// 控制台有一个生产提示
Vue.config.productionTip = false
// 导入自定义指令
import * as obj from '@/directives' // 得到一个对象
Object.keys(obj).forEach(item => {
  Vue.directive(item, obj[item])
})
// import './directives'

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
