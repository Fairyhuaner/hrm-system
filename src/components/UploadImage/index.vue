<template>
  <div>
    <el-upload
      action="#"
      list-type="picture-card"
      accept="image/jpg,image/png,image/jpeg,image/gif"
      :limit="limit"
      :class="{ hidden: filesList.length === limit }"
      :on-change="handleChange"
      :file-list="filesList"
      :http-request="handleRequest"
    >
      <i slot="default" class="el-icon-plus"></i>
      <div slot="file" slot-scope="{ file }">
        <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
        <span class="el-upload-list__item-actions">
          <span
            class="el-upload-list__item-preview"
            @click="handlePictureCardPreview(file)"
          >
            <i class="el-icon-zoom-in"></i>
          </span>
          <span
            v-if="!disabled"
            class="el-upload-list__item-delete"
            @click="handleDownload(file)"
          >
            <i class="el-icon-download"></i>
          </span>
          <span
            v-if="!disabled"
            class="el-upload-list__item-delete"
            @click="handleRemove(file)"
          >
            <i class="el-icon-delete"></i>
          </span>
        </span>
      </div>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
    <!-- <input type="file" accept="image/jpg,image/png,image/jpeg,image/gif" /> -->
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5'
// SECRETID 和 SECRETKEY请登录 https://console.cloud.tencent.com/cam/capi 进行查看和管理
var cos = new COS({
  SecretId: 'AKIDiFZfW7TaR2OnxrWv5ze3D8oGVXKsBE2a',
  SecretKey: 'MSItEKAk49yXqxqUs2xd3EArIUQ6XieK'
})
console.log(cos)
export default {
  filters: {},
  components: {},
  props: {
    limit: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      filesList: []
    }
  },
  watch: {},
  created () { },
  methods: {
    handleRemove (file) {
      this.filesList = this.filesList.filter(item => item.uid !== file.uid)
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleDownload (file) {
      console.log(file)
    },
    handleChange (file, fileList) {
      console.log(fileList)
      this.filesList = fileList
    },
    handleRequest (obj) {
      var that = this
      // 用腾讯云cos上传
      // console.log(123)
      cos.putObject({
        Bucket: 'huaner-1312846793', /* 写存储桶名字 */
        Region: 'ap-shanghai', /* 存储桶所在地域，必须ap-shanghai */
        Key: obj.file.name + Date.now(), /* 必须 */
        StorageClass: 'STANDARD',
        Body: obj.file, // 上传文件对象
        onProgress: function (progressData) {
          // console.log(JSON.stringify(progressData))
          // 进度条
          that.percent = Math.ceil(progressData.loaded / progressData.total * 100)
        }
      }, function (err, data) {
        console.log(err || data)
      })
    }
  }
}
</script>

<style scoped lang='scss'>
// 原理：hidden类名是动态绑定
.hidden ::v-deep .el-upload--picture-card {
  display: none;
}
</style>
