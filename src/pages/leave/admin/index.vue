<template>
  <el-col :span="24" :xs="24">
    <el-card class="full-height">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="员工审批" name="handleDoctor">
          <handleDoctor />
        </el-tab-pane>
        <el-tab-pane label="家属审批" name="handleOlder">
          <handleOlder />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </el-col>
</template>
    
  <script>
import handleDoctor from "./components/handleDoctor.vue";
import handleOlder from "./components/handleOlder.vue";
export default {
  components: {
    handleDoctor,
    handleOlder
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
    