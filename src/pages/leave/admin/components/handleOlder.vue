<template>
  <div class="app-container">
    <el-card v-for="(item, index) in myLeaves" :key="index" shadow="hover" class="leave-card">
      <div>
        <span class="nameTitle">请假老人姓名：</span>
        <span style="color:blue">{{ item.olderName }}</span>
        <el-button
          v-if="item.leaveState !== '同意申请' && item.leaveState !== '驳回申请'"
          type="text"
          @click="openActionDialog(item)"
          style="float: right; font-family:'楷体', Courier, monospace"
        >操作</el-button>
      </div>
      <div>
        <span style="font-size:medium">代请家属姓名：</span>
        <span style="color:red; font-size:small">{{ item.relationName }}</span>
      </div>
      <div class="card-content">
        <div class="info-item">
          <i class="el-icon-user-solid icon"></i>
          {{ item.relationship }}
        </div>
        <div class="info-item">
          <i class="el-icon-chat-line-round"></i>
          {{ item.leaveReason }}
        </div>
        <div class="info-item">
          <i class="el-icon-time"></i>
          {{ item.leaveStartTime | parseTime('{y}-{m}-{d} {h}:{i}') }} - {{ item.leaveEndTime |parseTime('{y}-{m}-{d} {h}:{i}') }}
        </div>
        <div>
          <i class="el-icon-s-check icon"></i>
          <el-tag :type="getTagType(item.leaveState)" size="small">{{ item.leaveState }}</el-tag>
        </div>
      </div>
    </el-card>
    <el-dialog title="操作选择" :visible.sync="dialogVisible" width="40%">
      <span>请选择您的操作：</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="approveLeave">同意</el-button>
        <el-button @click="rejectLeave">驳回</el-button>
        <el-button @click="cancelAction">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getOlderRequestInformation, updateOlderLeave } from "@/api/leave";

export default {
  data() {
    return {
      myLeaves: [],
      dialogVisible: false,
      selectedLeaveItem: null
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      getOlderRequestInformation().then(response => {
        this.myLeaves = response.data;
      });
    },
    openActionDialog(item) {
      this.selectedLeaveItem = item;
      this.dialogVisible = true;
    },
    approveLeave() {
      // 同意请假的逻辑
      updateOlderLeave(this.selectedLeaveItem.leaveId, "同意申请").then(
        response => {
          this.$message({
            message: response.msg,
            type: "success"
          });
          this.getList();
        }
      );
      this.dialogVisible = false;
    },
    rejectLeave() {
      // 驳回请假的逻辑
      updateOlderLeave(this.selectedLeaveItem.leaveId, "驳回申请").then(
        response => {
          this.$message({
            message: response.msg,
            type: "success"
          });
          this.getList();
        }
      );
      this.dialogVisible = false;
    },
    cancelAction() {
      // 取消操作的逻辑
      console.log("取消操作");
      this.dialogVisible = false;
    },
    getTagType(state) {
      switch (state) {
        case "同意申请":
          return "success";
        case "驳回申请":
          return "danger";
        default:
          return "";
      }
    },
    updateLeaveStatus(leaveId, status) {
      // 这里假设有一个 API 来更新请假状态
      // 示例：updateLeaveStatusApi(leaveId, status)
      console.log(`更新请假状态: ID=${leaveId}, 状态=${status}`);
      // 更新本地数据
      const leaveIndex = this.myLeaves.findIndex(leave => leave.id === leaveId);
      if (leaveIndex !== -1) {
        this.$set(this.myLeaves[leaveIndex], "leaveState", status);
      }
    }
  }
};
</script>

<style>
.app-container {
  min-height: 78vh;
}
.nameTitle {
  font-size: 20px;
}
.leave-card {
  margin-bottom: 5px;
}
.info-item {
  color: #8f8f8f;
}
i {
  color: black;
}
</style>