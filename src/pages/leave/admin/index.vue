<template>
  <el-col :span="24" :xs="24">
    <el-card class="full-height">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="处理员工审批" name="handleDoctor">
          <handleDoctor />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </el-col>
</template>
    
  <script>
import handleDoctor from "./components/handleDoctor.vue";
export default {
  components: {
    handleDoctor
  },
  data() {
    return {
      activeTab: "handleDoctor"
    };
  }
};
</script>
    <style>
body {
  font-family: "楷体";
}
</style>
    