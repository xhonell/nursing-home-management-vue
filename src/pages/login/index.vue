<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      autocomplete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">{{ systemTitle }}</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="请输入用户手机号"
          name="username"
          type="text"
          tabindex="1"
          autocomplete="on"
        />
      </el-form-item>

      <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
        <el-form-item prop="password" style="margin-bottom:5px">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="请输入用户密码"
            name="password"
            tabindex="2"
            autocomplete="on"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
      </el-tooltip>
      <router-link to="/forget">
        <span>忘记密码</span>
      </router-link>

      <el-button
        :loading="loading"
        type="primary"
        style="width:100%;margin-bottom:30px; margin-top:5px"
        @click.native.prevent="handleLogin"
      >{{ $t('login.logIn') }}</el-button>
    </el-form>
  </div>
</template>

<script>
import { validUsername } from "@/utils/validate";

export default {
  name: "Login",
  data() {
    const validateUsername = (rule, value, callback) => {
      // 检查是否为空
      if (!value) {
        callback(new Error("用户名不能为空"));
        return;
      }

      // 判断是否为手机号格式（假设是中国手机号）
      const phoneRegExp = /^1[3-9]\d{9}$/;
      if (!validUsername(value) && !phoneRegExp.test(value)) {
        callback(new Error("请输入正确的用户名或手机号"));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("密码长度必须大于6位"));
      } else {
        callback();
      }
    };
    return {
      systemTitle: "养老院管理系统",
      loginForm: {
        username: "18996459789",
        password: "123456"
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", validator: validateUsername }
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword }
        ]
      },
      passwordType: "password",
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {}
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query;
        if (query) {
          this.redirect = query.redirect;
          this.otherQuery = this.getOtherQuery(query);
        }
      },
      immediate: true
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    if (this.loginForm.username === "") {
      this.$refs.username.focus();
    } else if (this.loginForm.password === "") {
      this.$refs.password.focus();
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    checkCapslock(e) {
      const { key } = e;
      this.capsTooltip = key && key.length === 1 && key >= "A" && key <= "Z";
    },
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("user/login", this.loginForm)
            .then(() => {
              this.$router.push({
                path: this.redirect || "/",
                query: this.otherQuery
              });
              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== "redirect") {
          acc[cur] = query[cur];
        }
        return acc;
      }, {});
    }
  }
};
</script>

<style lang="scss">
$bg: #f1f8f6; // 背景色为浅绿或温馨的蓝绿色
$light_gray: #333; // 文字颜色
$primary-color: #61b5b0; // 主题色：柔和蓝绿色
$dark_gray: #5c6d74; // 输入框图标颜色
$button-color: #7ec8c2; // 按钮背景色，柔和的绿色
$button-hover-color: #61b5b0; // 按钮悬停颜色
$input-border: #d2e1e0; // 输入框边框颜色，温和的浅色

body {
  font-family: "KaiTi", "楷体", "SimKai", "Georgia", serif;
}

/* reset element-ui css */
.login-container {
  .el-input {
    font-family: "KaiTi", "楷体", "SimKai", "Georgia", serif;
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      font-family: "KaiTi", "楷体", "SimKai", "Georgia", serif;
      background: transparent;
      border: 1px solid $input-border; // 温和的边框色
      -webkit-appearance: none;
      border-radius: 4px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $button-color;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $button-color !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.05); // 使用淡色背景，营造温馨氛围
    border-radius: 4px;
    color: #454545;
  }
}

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg; // 使用温和的浅绿色背景
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .el-button {
    font-family: "KaiTi", "楷体", "SimKai", "Georgia", serif;
    background-color: $button-color; // 按钮背景色为柔和绿色
    border-color: $button-color;
    color: $light_gray;
    font-size: 16px;
    cursor: pointer;
    border-radius: 4px; // 按钮角落圆润
    &:hover {
      background-color: $button-hover-color;
      border-color: $button-hover-color;
    }
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
