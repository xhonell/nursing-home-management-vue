<template>
  <div class="app">
    <div class="title">
        <h3 class="title-text">{{ systemTitle }}</h3>
      </div>
    <div class="container">
        
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        label-position="left"
        class="demo-ruleForm"
      >
        <el-form-item label="用户邮箱" prop="roleEmail">
          <el-input v-model="ruleForm.roleEmail" placeholder="请输入用户邮箱"></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="vCode">
          <el-row>
            <el-col :span="13">
              <el-input v-model="ruleForm.vCode" placeholder="请输入验证码"></el-input>
            </el-col>
            <el-col :span="5" :offset="1">
              <el-button
                type="primary"
                @click="getCode('ruleForm')"
                :disabled="isSendingCode"
              >{{ isSendingCode ? `${countdown}秒后重新获取` : '获取邮箱验证码' }}</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="密码" prop="rolePassword">
          <el-input
            type="password"
            v-model="ruleForm.rolePassword"
            autocomplete="off"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input
            type="password"
            v-model="ruleForm.checkPass"
            autocomplete="off"
            placeholder="请再次输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="resetForm('ruleForm')" style="margin-left: 140px;">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { sendCode, resetPass } from "@/api/forget";
export default {
  data() {
    var checkAge = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("年龄不能为空"));
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error("请输入数字值"));
        } else {
          if (value < 18) {
            callback(new Error("必须年满18岁"));
          } else {
            callback();
          }
        }
      }, 1000);
    };
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.rolePassword !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.rolePassword) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      systemTitle: "养老院管理系统",
      isSendingCode: false, // 是否正在发送验证码
      countdown: 60, // 倒计时时间
      ruleForm: {
        roleEmail: "",
        vCode: "",
        rolePassword: "",
        checkPass: ""
      },
      rules: {
        rolePassword: [
          { required: true, validator: validatePass, trigger: "blur" }
        ],
        checkPass: [
          { required: true, validator: validatePass2, trigger: "blur" }
        ],
        roleEmail: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur"]
          }
        ],
        vCode: [{ required: true, message: "请输入验证码", trigger: "blur" }]
      }
    };
  },
  methods: {
    getCode(formName) {
      if (this.isSendingCode) {
        this.$message({
          message: "请勿频繁请求验证码",
          type: "warning"
        });
        return;
      }
      this.$refs[formName].validateField("roleEmail", error => {
        if (error) {
          return false;
        }
        sendCode(this.ruleForm.roleEmail).then(response => {
          this.$message({
            message: response.msg,
            type: "success"
          });
          this.isSendingCode = true;
          let timer = setInterval(() => {
            if (this.countdown > 0) {
              this.countdown--;
            } else {
              clearInterval(timer);
              this.isSendingCode = false;
              this.countdown = 60; // 重置倒计时
            }
          }, 1000);
        });
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          resetPass(this.ruleForm).then(response => {
            this.$message({
              message: response.msg,
              type: "success"
            });
            this.$router.push("/login");
          });
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style scoped>
.app {
  display: flex;
  flex-direction: column; /* 确保子元素垂直排列 */
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  height: 100vh; /* 使父容器高度占满整个视口 */
  background-color: #fff;
  font-family: "楷体";
}

.title {
  margin-bottom: 20px; /* 标题与表单之间的间距 */
}

.title-text {
  font-size: 24px; /* 设置字体大小 */
  color: #333; /* 设置文字颜色 */
  text-align: center; /* 文字居中对齐 */
}

.container {
  margin: 0 auto;
  width: 500px;
  border: 1px solid #ccc;
  padding: 30px;
  border-radius: 10px;
  background-color: #f5f5f5;
}

.demo-ruleForm {
  margin: 0 auto; /* 移除或调整 margin */
}

</style>