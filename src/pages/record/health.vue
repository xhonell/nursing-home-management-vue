<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.olderName"
        placeholder="老人名称"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select v-model="listQuery.healthState" class="filter-item" placeholder="请选择">
        <el-option v-for="item in state" :key="item" :label="item" :value="item"></el-option>
      </el-select>
      <el-date-picker
        v-model="listQuery.healthTime"
        type="datetime"
        class="filter-item"
        placeholder="选择日期时间"
      ></el-date-picker>

      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >{{ $t('table.search') }}</el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >{{ $t('table.add') }}</el-button>
      <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >{{ $t('table.export') }}</el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="记录编号" prop="healthId" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.healthId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="健康状态" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.healthState }}</span>
        </template>
      </el-table-column>
      <el-table-column label="身高" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.healthHeight }}</span>
        </template>
      </el-table-column>
      <el-table-column label="体重" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.healthWeight }}</span>
        </template>
      </el-table-column>
      <el-table-column label="血压" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.healthBlood }}</span>
        </template>
      </el-table-column>
      <el-table-column label="心率" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.healthHeart}}</span>
        </template>
      </el-table-column>
      <el-table-column label="记录时间" min-width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.healthTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="老人名称" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.olderName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="负责医师" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.doctorName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.actions')"
        align="center"
        width="330"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">{{ $t('table.edit') }}</el-button>
          <el-button
            v-if="row.status!='deleted'"
            size="mini"
            type="danger"
            @click="handleDelete(row)"
          >{{ $t('table.delete') }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页下标 -->
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 40  0px; margin-left:50px;"
      >
        <el-form-item label="记录编号" hidden>
          <el-input v-model="temp.healthId" />
        </el-form-item>
        <el-form-item label="健康状态">
          <el-select v-model="temp.healthState" placeholder="请选择">
            <el-option v-for="item in state" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="身高" prop="healthHeight">
          <el-input v-model="temp.healthHeight" />
        </el-form-item>
        <el-form-item label="体重" prop="healthWeight">
          <el-input v-model="temp.healthWeight" />
        </el-form-item>
        <el-form-item label="血压" prop="healthBoold">
          <el-input v-model="temp.healthBlood" />
        </el-form-item>
        <el-form-item label="心率" prop="healthHeart">
          <el-input v-model="temp.healthHeart" />
        </el-form-item>
        <el-form-item label="记录时间" prop="healthTime">
          <el-date-picker v-model="temp.healthTime" type="datetime" placeholder="请选择一个时间" />
        </el-form-item>
        <el-form-item label="老人编号" hidden>
          <el-select v-model="temp.olderId"  placeholder="请选择" @change="onOlderIdChange">
            <el-option v-for="(item,index) in olderIds" :key="index" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="老人名称">
          <el-select v-model="temp.olderName"  placeholder="请选择"  @change="onOlderNameChange">
            <el-option v-for="(item,index) in olderNames" :key="index" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="医师编号" hidden>
          <el-input v-model="temp.doctorId" />
        </el-form-item>
        <el-form-item label="填写医师">
          <el-input v-model="temp.doctorName" readonly />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button
          type="primary"
          @click="dialogStatus==='create'?createData():updateData()"
        >{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">{{ $t('table.confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  fetchList,
  fetchPv,
  createArticle,
  updateArticle,
  deleteArticle,
  getOlderName
} from "@/api/health";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import { mapGetters } from "vuex";

export default {
  name: "ComplexTable",
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      olderNames: [],
      olderIds: [],
      state: ["正常", "感冒", "发烧", "隔离"],
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        healthState: undefined,
        olderName: undefined,
        healthTime: undefined
      },
      temp: {
        healthId: undefined,
        healthState: "",
        healthHeight: undefined,
        healthWeight: undefined,
        healthBlood: undefined,
        healthHeart: undefined,
        healthTime: new Date(),
        olderId: undefined,
        olderName: "",
        doctorId: undefined,
        doctorName: ""
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "修改",
        create: "创建"
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        dietTime: [
          {
            type: "date",
            required: true,
            message: "时间不能为空",
            trigger: "change"
          }
        ],
        dietFood: [
          { required: true, message: "膳食内容不能为空", trigger: "blur" }
        ]
      },
      downloadLoading: false
    };
  },
  watch: {
    // 当olderId变化时，更新olderName
    'temp.olderId': function(newId) {
      const index = this.olderIds.indexOf(newId);
      if (index !== -1) {
        this.temp.olderName = this.olderNames[index]; // 同步更新老人名称
      }
    },
    // 当olderName变化时，更新olderId
    'temp.olderName': function(newName) {
      const index = this.olderNames.indexOf(newName);
      if (index !== -1) {
        this.temp.olderId = this.olderIds[index]; // 同步更新老人编号
      }
    },
  },
  computed: {
    ...mapGetters(["name", "id"])
  },
  created() {
    this.getList();
    this.getOlders();
  },
  methods: {
    onOlderIdChange(value) {
      const index = this.olderIds.indexOf(value);
      if (index !== -1) {
        this.temp.olderName = this.olderNames[index];
      }
    },
    onOlderNameChange(value) {
      const index = this.olderNames.indexOf(value);
      if (index !== -1) {
        this.temp.olderId = this.olderIds[index];
      }
    },
    getList() {
      this.listLoading = true;
      fetchList(this.listQuery).then(response => {
        this.list = response.data.healthList;
        this.total = response.data.total;

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 1000);
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    resetTemp() {
      this.temp = {
        healthId: undefined,
        healthState: "",
        healthHeight: undefined,
        healthWeight: undefined,
        healthBlood: undefined,
        healthHeart: undefined,
        healthTime: new Date(),
        olderId: undefined,
        olderName: "",
        doctorId: undefined,
        doctorName: ""
      };
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
        this.temp.doctorId = this.id;
        this.temp.doctorName = this.name;
      });
    },
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          createArticle(this.temp).then(response => {
            this.dialogFormVisible = false;
            this.$notify({
              title: "成功",
              message: response.msg,
              type: "success"
            });
            this.getList();
          });
        }
      });
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row); // copy obj
      this.temp.dietTime = new Date(this.temp.dietTime);
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          tempData.dietTime = +new Date(tempData.dietTime); // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateArticle(tempData).then(response => {
            this.dialogFormVisible = false;
            this.$notify({
              title: "成功",
              message: response.msg,
              type: "success"
            });
            this.getList();
          });
        }
      });
    },
    getOlders() {
      getOlderName().then(response => {
        const { data } = response;
        this.olderIds = data.olderIds;
        this.olderNames = data.olderNames;
      });
    },
    handleDelete(row) {
      deleteArticle(row.healthId).then(response => {
        this.$notify({
          title: "成功",
          message: response.msg,
          type: "success"
        });
        this.getList();
      });
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData;
        this.dialogPvVisible = true;
      });
    },
    handleDownload() {
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then(excel => {
        const tHeader = [
          "档案编号",
          "身体状况",
          "身高",
          "体重",
          "血压",
          "心率",
          "记录时间",
          "老人编号",
          "老人姓名",
          "医生编号",
          "医生姓名"
        ];
        const filterVal = [
          "healthId",
          "healthState",
          "healthHeight",
          "healthWeight",
          "healthBlood",
          "healthHeart",
          "healthTime",
          "olderId",
          "olderName",
          "doctorId",
          "doctorName"
        ];
        const data = this.formatJson(filterVal);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "健康档案表表"
        });
        this.downloadLoading = false;
      });
    },
    formatJson(filterVal) {
      return this.list.map(v =>
        filterVal.map(j => {
          if (j === "healthTime") {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
    }
  }
};
</script>
