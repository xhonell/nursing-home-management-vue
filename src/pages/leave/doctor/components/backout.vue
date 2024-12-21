<template>
  <div class="app-container">
    <el-card v-for="(item, index) in myLeaves" :key="index" shadow="hover" class="leave-card">
      <div >
        <span class="nameTitle">请假人员姓名：</span>
        <span style="color:blue">{{ item.doctorName }}</span>
      </div>
      <div class="card-content">
        <div class="info-item">
          <i class="el-icon-location-outline icon"></i>
          {{ item.departmentName }}
        </div>
        <div class="info-item">
          <i class="el-icon-chat-line-round"></i>
          {{ item.leaveReason }}
        </div>
        <div class="info-item">
          <i class="el-icon-time"></i>
          {{ item.leaveStartTime | parseTime('{y}-{m}-{d} {h}:{i}') }} - {{ item.leaveEndTime |parseTime('{y}-{m}-{d} {h}:{i}') }}
        </div>
        <div >
          <i class="el-icon-s-check icon"></i>
          <el-tag :type="getTagType(item.leaveState)" size="small">{{ item.leaveState }}</el-tag>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getRequestInformation } from "@/api/leave";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      myLeaves:[],
      dialogVisible: false,
      selectedLeaveItem: null
    };
  },
  computed: {
    ...mapGetters(["doctorId"])
  },
  created() {
    this.getList(this.doctorId);
  },
  methods: {
    getList(doctorId) {
      getRequestInformation(doctorId).then(response => {
        this.myLeaves = response.data;
      });
    },
    getTagType(state) {
      switch (state) {
        case '同意申请':
          return 'success';
        case '驳回申请':
          return 'danger';
        default:
          return ''; 
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
.leave-card{
  margin-bottom: 5px;
}
.info-item{
  color:#8f8f8f
}
i{
  color:black
}
</style>