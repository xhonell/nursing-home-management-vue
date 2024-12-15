<template>
  <el-col :span="24" :xs="24">
    <el-card class="full-height">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="个人信息" name="activity">
          <personal />
        </el-tab-pane>
        <el-tab-pane label="修改密码" name="password">
          <password />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </el-col>
</template>

<script>
import { mapGetters } from 'vuex'
import personal from './components/personal.vue'
import password from './components/password.vue'

export default {
  components: {
    personal,
    password
  },
  data() {
    return {
      activeTab: 'activity'
    }
  },
  computed: {
    ...mapGetters(['token']),
    user() {
      // 假设 user 对象存储在 Vuex store 中
      return this.$store.state.user
    }
  }
}
</script>
<style>
body{
  font-family: "楷体";
}
</style>
