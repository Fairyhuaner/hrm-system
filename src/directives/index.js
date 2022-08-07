// 自定义指令
export const imgerror = {
  update (el, binding) {
    el.onerror = function () {
      this.src = 'http://ihrm.itheima.net/static/img/head.b6c3427d.jpg'
    }
  }
}

// // 自定义指令
// Vue.directive('imgerror', {
//   // 指令所在的标签插入到DOM中就会更新
//   // inserted (el, binding) {
//   //   // el.src = binding.value
//   //   el.src = 'http://ihrm.itheima.net/static/img/head.b6c3427d.jpg'
//   // },
//   // 数据更新时就会执行
//   update (el, binding) {
//     // el.src = binding.value
//     el.src = 'http://ihrm.itheima.net/static/img/head.b6c3427d.jpg'
//   }
// })
