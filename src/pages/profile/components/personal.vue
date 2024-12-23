<template>
  <div style="font-family: '楷体'; height: 78vh;">
    <el-form ref="form" :model="form" :rules="rules" label-width="100px" label-position="left">
      <el-form-item label="用户头像">
        <!-- 显示现有头像 -->
        <div v-if="hasAvatar" class="avatar-container">
          <el-image style="width: 100px; height: 100px" :src="avatar" fit="cover" />
          <el-button type="text" @click="removeAvatar">更换头像</el-button>
        </div>
        <!-- 上传头像框 -->
        <el-upload
          v-else
          action="/api/user/uploadAvatar"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :before-upload="beforeUpload"
          :limit="1"
          :on-exceed="handleExceed"
          :disabled="hasAvatar"
          :file-list="fileList"
        >
          <i class="el-icon-plus" />
        </el-upload>
      </el-form-item>
      <el-form-item label="用户姓名" prop="roleName">
        <el-col :span="12">
          <el-input v-model="form.roleName" placeholder="请输入用户名称" />
        </el-col>
      </el-form-item>
      <el-form-item label="用户性别" prop="roleSex">
        <el-select v-model="form.roleSex" placeholder="请选择用户性别">
          <el-option label="男" value="男" />
          <el-option label="女" value="女" />
        </el-select>
      </el-form-item>
      <el-form-item label="用户年龄" prop="roleAge">
        <el-col :span="6">
          <el-input v-model="form.roleAge" placeholder="请输入用户年龄" />
        </el-col>
      </el-form-item>
      <el-form-item label="用户手机号" prop="rolePhone">
        <el-col :span="12">
          <el-input v-model="form.rolePhone" placeholder="请输入用户手机号" />
        </el-col>
      </el-form-item>
      <el-form-item label="用户邮箱" prop="roleEmail">
        <el-col :span="12">
          <el-input v-model="form.roleEmail" placeholder="请输入用户邮箱" />
        </el-col>
      </el-form-item>
      <el-form-item style="margin-top: 50px;">
        <el-button type="primary" @click="onSubmit">修改</el-button>
        <el-button style="margin-left: 140px;" @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getInfo } from '@/api/user'

export default {
  name: 'Personal',
  data() {
    return {
      person: '个人中心',
      dialogImageUrl: '',
      dialogVisible: false,
      hasAvatar: false, // 新增状态变量
      form: {
        roleName: '',
        roleSex: '',
        roleAge: '',
        rolePhone: '',
        roleEmail: ''
      },
      fileList: [],
      reset: {},
      rules: {
        roleName: [
          { required: true, message: '请输入用户名称', trigger: 'blur' }
        ],
        roleSex: [
          { required: true, message: '请选择用户性别', trigger: 'change' }
        ],
        roleAge: [
          { required: true, message: '请输入用户年龄', trigger: 'blur' },
          { pattern: /^\d+$/, message: '年龄必须为数字', trigger: 'blur' }
        ],
        rolePhone: [
          { required: true, message: '请输入用户手机号', trigger: 'blur' },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: '手机号格式不正确',
            trigger: 'blur'
          }
        ],
        roleEmail: [
          { required: true, message: '请输入用户邮箱', trigger: 'blur' },
          { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['token', 'avatar'])
  },
  mounted() {
    getInfo(this.token).then(response => {
      this.form = response.data
      this.reset = response.data
      if (this.avatar) {
        this.fileList = [
          {
            url: this.avatar
          }
        ]
        this.hasAvatar = true
      }
    })
  },
  methods: {
    handleRemove(file, fileList) {
      this.dialogImageUrl = ''
      this.dialogVisible = false
      this.fileList = []
      this.hasAvatar = false // 重置 hasAvatar 状态
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    beforeUpload(file) {
      const isImage = file.type.startsWith('image/')
      if (!isImage) {
        this.$message.error('只能上传图片文件!')
      }
      return isImage
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件`)
    },
    onSubmit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          await this.$store
            .dispatch('user/resetUser', this.form)
            .then(response => {
              const { data } = response
              this.$message({
                message: response.msg,
                type: 'success'
              })
              this.form = data
              this.reset = data
            })
        } else {
          return false
        }
      })
    },
    removeAvatar() {
      this.fileList = []
      this.hasAvatar = false
    },
    resetForm() {
      this.form = { ...this.reset }
    }
  }
}
</script>

<style scoped>
.avatar-container {
  display: flex;
  align-items: center;
}
.avatar-container .el-button {
  margin-left: 10px;
}
</style>
