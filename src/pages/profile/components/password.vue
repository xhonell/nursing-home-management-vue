<template>
  <div class="container" style="font-family: '楷体; height: 78vh;">
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      status-icon
      :rules="rules"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="原来密码" prop="rolePassword">
        <el-col :span="12">
          <el-input v-model="ruleForm.rolePassword" :type="passwordType" />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-col>
      </el-form-item>
      <el-form-item label="新密码" prop="newRolePassword">
        <el-col :span="12">
          <el-input v-model="ruleForm.newRolePassword" type="password" autocomplete="off" />
        </el-col>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPassword">
        <el-col :span="12">
          <el-input v-model="ruleForm.checkPassword" type="password" autocomplete="off" />
        </el-col>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">更改</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { resetPassword } from '@/api/user'
export default {
  data() {
    var checkPassword = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('原密码不能为空'))
      } else {
        callback()
      }
    }
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'))
      } else if (value.length < 6) {
        callback(new Error('密码长度必须大于6位'))
      }
      if (this.ruleForm.checkPassword !== '') {
        this.$refs.ruleForm.validateField('checkPass')
      }
      callback()
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.newRolePassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      passwordType: 'password',
      ruleForm: {
        newRolePassword: '',
        checkPassword: '',
        rolePassword: '',
        roleId: ''
      },
      rules: {
        newRolePassword: [{ validator: validatePass, trigger: 'blur' }],
        checkPassword: [{ validator: validatePass2, trigger: 'blur' }],
        rolePassword: [{ validator: checkPassword, trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapGetters(['id'])
  },
  mounted() {
    this.ruleForm.roleId = this.id
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          resetPassword(this.ruleForm).then(response => {
            this.$message({
              message: response.msg,
              type: 'success'
            })
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
    }
  }
}
</script>
<style>
.show-pwd {
  position: absolute;
  left: 680px;
  cursor: pointer;
}
</style>
