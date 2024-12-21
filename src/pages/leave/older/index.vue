<template>
  <el-col :span="24" :xs="24">
    <el-card class="full-height">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="OA请假审批" name="activity">
          <request />
        </el-tab-pane>
        <el-tab-pane label="查看请假状态" name="backout">
          <backout />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </el-col>
</template>
  
<script>
import { mapGetters } from "vuex";
import request from "./components/request";
import backout from "./components/backout";

export default {
  components: {
    request,
    backout
  },
  data() {
    return {
      activeTab: "activity"
    };
  },
  computed: {
    ...mapGetters(["token"])
  }
};
</script>
  <style>
body {
  font-family: "楷体";
}
</style>
  