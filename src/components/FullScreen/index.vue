<template>
  <span @click="handleClick">
    <svg-icon icon-class="fullscreen" class="icon"></svg-icon>
  </span>
</template>

<script>
export default {
  filters: {},
  components: {},
  data () {
    return {}
  },
  computed: {},
  watch: {},
  created () { },
  methods: {
    // 全屏
    async handleClick () {
      if (document.fullscreenElement) {
        await document.exitFullscreen() // 退出全屏
      } else {
        await document.documentElement.requestFullscreen()
      }
    }
  }
}
</script>

<style scoped lang='scss'>
.icon {
  color: #fff;
  font-size: 20px;
  margin-right: 6px;
}
</style>
