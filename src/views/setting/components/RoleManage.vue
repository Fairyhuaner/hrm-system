<template>
  <div>
    <el-button
      type="primary"
      size="mimi"
      @click="
        roleDialogVisible = true;
        isEdit = false;
        form = {};
      "
      >新增角色</el-button
    >
    <el-table :data="roleList" stripe style="width: 100%">
      <el-table-column type="index" label="序号" width="180"> </el-table-column>
      <el-table-column prop="name" label="角色名" width="180">
      </el-table-column>
      <el-table-column prop="description" label="描述"> </el-table-column>
      <el-table-column label="操作">
        <template v-slot="scope">
          <el-button type="text" @click="showRightDialog(scope.row.id)"
            >分配权限</el-button
          >
          <el-button type="text" @click="showRoleDialog(scope.row)"
            >修改</el-button
          >
          <el-button type="text" @click="del(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row type="flex" justify="end">
      <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        :current-page="paramsObj.page"
        :page-size="paramsObj.pagesize"
        :page-sizes="[2, 3, 4, 5, 6]"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </el-row>
    <!-- 分配权限 -->
    <el-dialog title="分配权限" :visible.sync="rightVisible">
      <el-tree
        v-if="rightVisible"
        ref="myTree"
        :data="permissions"
        :props="{ label: 'name' }"
        :default-checked-keys="selectedPermissions"
        node-key="id"
        default-expand-all
        show-checkbox
      >
      </el-tree>
      <template #footer>
        <el-button type="primary" @click="save">确认</el-button>
        <el-button @click="rightVisible = false">取消</el-button>
      </template>
    </el-dialog>
    <!-- 新增和编辑的对话框 -->
    <el-dialog
      :title="isEdit ? '修改' : '新增'"
      :visible.sync="roleDialogVisible"
      @close="reset"
    >
      <el-form ref="myForm" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input v-model="form.description"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="onClick">确认</el-button>
        <el-button @click="roleDialogVisible = false">取消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getPermissions, getPermissionsById, assignPermission, addRole } from '@/api/permission'
import { getRoleList, delRole, editRole } from '@/api/setting'
import { transferListToTree } from '@/utils'
export default {
  name: 'RoleManage',
  filters: {},
  components: {},
  data () {
    return {
      paramsObj: {
        page: 1, // 默认拿第一页数据
        pagesize: 4 // 每页数据
      },
      roleList: [],
      total: null,
      rightVisible: false,
      permissions: [],
      selectedPermissions: [],
      id: null,
      roleDialogVisible: false,
      form: {
        name: '',
        description: ''
      },
      rules: {
        name: [
          { required: true, message: '角色名不能为空', trigger: 'blur' }
        ]
      },
      isEdit: false
    }
  },
  computed: {},
  watch: {},
  created () {
    this.getRoleList()
  },
  methods: {
    async getRoleList () {
      const res = await getRoleList(this.paramsObj)
      console.log('res', res)
      this.roleList = res.rows
      this.total = res.total
      console.log(this.roleList)
    },
    handleCurrentChange (page) {
      this.paramsObj.page = page
      this.getRoleList()
    },
    handleSizeChange (pagesize) {
      this.paramsObj.pagesize = pagesize
      this.getRoleList()
    },
    del (id) {
      this.$confirm('确定要删除嘛?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await delRole(id)
        if (this.roleList.length === 1 && this.paramsObj.page > 1) {
          this.paramsObj.page--
        }
        this.getRoleList()
        // this.getRoleList()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    async showRightDialog (id) {
      this.id = id
      // 获取所有权限点
      const res = await getPermissions()
      this.permissions = transferListToTree(res, '0')
      // 获取当前的权限点
      const res1 = await getPermissionsById(id)
      this.selectedPermissions = res1.permIds
      console.log(res1)
      this.rightVisible = true
    },
    async save () {
      await assignPermission(this.id, this.$refs.myTree.getCheckedKeys())
      this.rightVisible = false
    },
    onClick () {
      // 二次校验
      this.$refs.myForm.validate(async bool => {
        if (!bool) return this.$message.error('表单数据非法!')
        if (this.isEdit) {
          await editRole(this.form)
        } else {
          await addRole(this.form)
        }
        this.getRoleList()
        this.roleDialogVisible = false
      })
    },
    reset () {
      this.$refs.myForm.resetFields()
    },
    showRoleDialog (row) {
      this.isEdit = true
      this.roleDialogVisible = true
      this.form = { ...row } // 浅拷贝
      // this.form = Object.assign({}, row) // 浅拷贝
    }
  }
}
</script>

<style scoped lang='scss'>
.el-table {
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>
