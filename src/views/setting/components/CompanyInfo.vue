<template>
  <el-form label-width="80px" style="width: 600px">
    <el-form-item label="企业名称">
      <el-input disabled></el-input>
    </el-form-item>
    <el-form-item label="公司地址">
      <el-input disabled></el-input>
    </el-form-item>
    <el-form-item label="公司电话">
      <el-input disabled></el-input>
    </el-form-item>
    <el-form-item label="邮编">
      <el-input disabled></el-input>
    </el-form-item>
    <el-form-item label="备注">
      <el-input disabled></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
import { getCompanyInfo } from '@/api/setting'
import { mapGetters } from 'vuex'
export default {
  name: 'CompanyInfoPage',
  filters: {},
  components: {},
  data () {
    return {
      info: {}
    }
  },
  computed: {
    ...mapGetters(['companyId'])
  },
  watch: {},
  async created () {
    const res = await getCompanyInfo(this.companyId)
    console.log('res221', res)
    this.info = res
  },
  methods: {}
}
</script>

<style scoped lang='scss'>
</style>
