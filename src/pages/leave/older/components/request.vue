<template>
  <div class="app-container">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="140px"
      label-position="left"
      class="demo-ruleForm"
    >
      <el-form-item label="请假老人名称">
        <el-col :span="8">
          <el-input v-model="ruleForm.olderName" readonly></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="代请家属名称">
        <el-col :span="8">
          <el-input v-model="ruleForm.relationName" readonly></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="与老人关系">
        <el-col :span="8">
          <el-input v-model="ruleForm.relationship" readonly></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="家庭地址">
        <el-col :span="12">
          <el-input v-model="ruleForm.relationAddress" readonly></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="请假时间" prop="leaveStartTime">
        <el-col :span="5">
          <el-date-picker
            v-model="ruleForm.leaveStartTime"
            type="datetime"
            placeholder="请选择开始请假时间"
          />
        </el-col>
        <el-col :span="1">
          <span>-</span>
        </el-col>
        <el-col :span="8">
          <el-date-picker
            v-model="ruleForm.leaveEndTime"
            type="datetime"
            placeholder="请选择结束请假时间"
            prop="leaveEndTime"
          />
        </el-col>
      </el-form-item>
      <el-form-item label="请假原因" prop="leaveReason">
        <el-col :span="16">
          <el-input type="textarea" :rows="4" v-model="ruleForm.leaveReason" placeholder="请填写请假原因" />
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">发起审批</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
  
  <script>
import { mapGetters } from "vuex";
import { sendOlderRequest } from "@/api/leave";

export default {
  data() {
    return {
      ruleForm: {
        olderId: undefined,
        olderName: "",
        relationId: undefined,
        relationName: "",
        relationship: "",
        relationAddress: "",
        leaveStartTime:"",
        leaveEndTime: "",
        leaveReason: ""
      },
      rules: {
        leaveStartTime: [
          {
            type: "date",
            required: true,
            message: "请选择开始时间",
            trigger: "blur"
          },
          {
            validator: this.validateLeaveTime,
            trigger: ["blur", "change"]
          }
        ],
        leaveReason: [
          { required: true, message: "请填写请假原因", trigger: "blur" }
        ]
      }
    };
  },
  computed: {
    ...mapGetters(["id"])
  },
  created() {
    this.getPersonal();
  },
  methods: {
    validateLeaveTime(rule, value, callback) {
      if (!this.ruleForm.leaveEndTime || !value) {
        callback(new Error("请选择请假时间"));
      } else if (new Date(this.ruleForm.leaveEndTime) <= new Date(value)) {
        callback(new Error("开始时间不能大于或等于结束时间"));
      } else if (new Date(value) <= new Date()) {
        callback(new Error("开始时间不能小于当前时间"));
      } else {
        callback();
      }
    },
    getPersonal() {
      this.$store.dispatch("user/getOlderInfo", this.id).then(data => {
        this.ruleForm = { ...this.ruleForm, ...data };
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          sendOlderRequest(this.ruleForm).then(response => {
            this.$message({
              message: response.msg,
              type: "success"
            });
            this.$router.push("/");
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
  
  <style>
input {
  font-family: "楷体";
}
.app-container {
  min-height: 78vh;
}
</style>