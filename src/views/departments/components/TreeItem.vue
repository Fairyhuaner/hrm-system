<template>
  <div style="width: 100%">
    <el-row
      type="flex"
      justify="end"
      align="middle"
      style="height: 40px; padding: 30px 140px; font-size: 14px; width: 100%"
    >
      <!-- 两个内容 -->
      <el-col>
        <span>{{ node.data ? node.data.name : node.name }}</span>
      </el-col>
      <el-col :span="4">
        <el-row type="flex" justify="end">
          <!-- 两个内容 -->
          <el-col>{{ node.data ? node.data.manager : "负责人" }}</el-col>
          <el-col>
            <!-- 下拉菜单 element -->
            <el-dropdown @command="onCommand">
              <span> 操作<i class="el-icon-arrow-down" /> </span>
              <!-- 下拉菜单 -->
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="a">添加子部门</el-dropdown-item>
                <template v-if="node.data">
                  <el-dropdown-item command="b">编辑部门</el-dropdown-item>
                  <el-dropdown-item command="c">删除部门</el-dropdown-item>
                </template>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-dialog
      :title="title"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="handleAddClose"
    >
      <el-form
        ref="addFormRef"
        label-width="80px"
        :model="addDepartmentForm"
        :rules="rules"
      >
        <el-form-item label="部门名称" prop="name">
          <el-input
            v-model="addDepartmentForm.name"
            placeholder="1-50个字符"
          ></el-input>
        </el-form-item>
        <el-form-item label="部门编码" prop="code">
          <el-input
            v-model="addDepartmentForm.code"
            placeholder="1-50个字符"
          ></el-input>
        </el-form-item>
        <el-form-item label="部门负责人" prop="manager">
          <el-select
            v-model="addDepartmentForm.manager"
            placeholder="请选择"
            style="width: 100%"
            filterable
          >
            <el-option
              v-for="item in users"
              :key="item.id"
              :label="item.username"
              :value="item.username"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门介绍" prop="introduce">
          <el-input
            v-model="addDepartmentForm.introduce"
            type="textarea"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit"> 确 定 </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getSimpleUserList } from '@/api/user'
import { delDepartment, addDepartment, getDepartmentsList, editDepartment } from '@/api/departments'
export default {
  filters: {},
  components: {},
  props: {
    node: {
      type: Object,
      required: true
    }
  },
  data () {
    // element ui 自定义校验规则函数
    // rule 代表当前校验规则
    // value 要校验的数据
    // callback 不加小括号 就会出现不管数据是什么都会失败的情况
    const vaildateName = async (rule, value, callback) => {
      //  拿到所有的部门数据
      const res = await getDepartmentsList()
      if (this.isEdit) {
        // 标题不存在编辑
        const pid = this.node.data.pid // 把当前要编辑的部门父级的id找到了 然后根据这个pid去找所有的兄弟元素
        res.depts.filter(item => item.pid === pid && item.id !== this.node.data.id).some(item => item.name === value) ? callback(new Error('部门名称重复')) : callback()
      } else {
        // 待筛选的所有的子部门的pid值
        const id = this.node.data ? this.node.data.id : ''
        // filter 筛选
        // some 看看有没有符合条件
        res.depts.filter(item => item.pid === id).some(item => item.name === value) ? callback(new Error('部门名称重复')) : callback()
      }
    }
    return {
      addDialogVisible: false,
      addDepartmentForm: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门负责人
        introduce: '' // 部门介绍
      },
      rules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门名称必须1到50字符之间', trigger: 'blur' },
          { validator: vaildateName, trigger: 'change' }
        ]
      },
      users: [], // 用户列表
      isEdit: false // 用来判断当前是在做添加还是在做编辑
    }
  },
  computed: {
    title () {
      return this.isEdit ? '编辑部门' : '新增部门'
    }
  },
  watch: {},
  created () { },
  methods: {
    async onCommand (key) {
      if (this.users.length === 0) {
        this.getSimpleUserList()
      }
      if (key === 'a') {
        this.isEdit = false
        this.addDialogVisible = true
        this.getSimpleUserList()
      } else if (key === 'b') {
        this.isEdit = true
        this.addDialogVisible = true
        this.addDepartmentForm = { ...this.node.data }
        console.log('编辑')
      } else {
        try {
          await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          await delDepartment(this.node.data.id)
          this.$emit('delDepartment')
        } catch (err) {
          console.log(err)
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        }
      }
    },
    async getSimpleUserList () {
      const res = await getSimpleUserList()
      // console.log(res)
      this.users = res
    },
    handleAddClose () {
      this.$refs.addFormRef.resetFields() // 表单重置
    },
    async onSubmit () {
      if (this.isEdit) {
        delete this.addDepartmentForm.children // 把对象的children属性移除
        await editDepartment(this.addDepartmentForm)
      } else {
        // 在哪一项上面新增部门，这一项的id就是pid
        this.addDepartmentForm.pid = this.node.data ? this.node.data.id : ''
        // console.log(this.node)
        await addDepartment(this.addDepartmentForm)
      }
      this.$emit('delDepartment') // 子向父传值，数据更新要刷新tree
      this.addDialogVisible = false
    }
  }
}
</script>

<style scoped lang='scss'>
::v-deep .el-tree-node {
  padding: 10px !important;
  span,
  div {
    font-size: 20px;
  }
}
::v-deep .el-tree-node__content {
  padding: 20px 0 !important;
}
</style>
