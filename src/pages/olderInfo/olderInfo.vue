<template>
  <div class="container">
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="100px"
      label-position="left"
    >
      <el-form-item label="老人名字" prop="olderName">
        <el-col :span="6">
          <el-input v-model="form.olderName" placeholder="请输入老人名字" />
        </el-col>
      </el-form-item>

      <el-form-item label="老人年龄" prop="olderAge">
        <el-col :span="6">
          <el-input v-model="form.olderAge" placeholder="请输入用户年龄" />
        </el-col>
      </el-form-item>

      <el-form-item label="老人手机号" prop="olderPhone">
        <el-col :span="12">
          <el-input v-model="form.olderPhone" placeholder="请输入老人手机号" />
        </el-col>
      </el-form-item>

      <el-form-item label="老人健康状况" prop="olderHealth">
        <el-col :span="12">
          <el-input v-model="form.olderHealth" placeholder="请输入健康状况" />
        </el-col>
      </el-form-item>

      <el-form-item label="老人病史" prop="olderHistory">
        <el-col :span="12">
          <el-input v-model="form.olderHistory" placeholder="请输入老人病史" />
        </el-col>
      </el-form-item>

      <el-form-item label="老人备注" prop="olderHistory">
        <el-col :span="12">
          <el-input v-model="form.olderRemark" placeholder="请输入老人备注" />
        </el-col>
      </el-form-item>

      <el-form-item style="margin-top: 50px">
        <el-button type="primary" @click="onSubmit">修改</el-button>
        <el-button
          style="margin-left: 140px"
          @click="resetForm"
        >重置</el-button>
      </el-form-item>
    </el-form>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getInfo, updateInfo } from '@/api/olderInfo'

export default {
  name: 'Personal',
  data() {
    return {
      person: '个人中心',
      dialogImageUrl: '',
      dialogVisible: false,
      hasAvatar: false, // 新增状态变量
      form: {
        relationId: '',
        olderName: '',
        olderAge: '',
        olderPhone: '',
        olderHealth: '',
        olderHistory: '',
        olderRemark: ''
      },
      fileList: [],
      reset: {
        olderHistory: '暂无',
        olderRemark: '暂无'
      }
    }
  },
  computed: {
    ...mapGetters(['relationId'])
  },
  mounted() {
    getInfo(this.relationId).then((response) => {
      this.form = response.data
      this.reset = response.data
    })
  },
  methods: {
    onSubmit() {
      this.$refs.form.validate(async(valid) => {
        if (valid) {
          updateInfo(this.form).then((response) => {
            this.$message({
              message: response.msg,
              type: 'success'
            })
            this.$router.push('/')
          })
        }
      })
    },
    resetForm() {
      this.form = { ...this.reset }
    }
  }
}
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  font-family: "楷体";
  height: 78vh;
  overflow: hidden;
  text-align: center;
}

.el-form {
  width: 500px; /* 设置表单宽度 */
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1); /* 添加阴影效果 */
  border-radius: 4px; /* 添加圆角 */
  background-color: #f0f9eb; /* 设置背景颜色 */
}
</style>
