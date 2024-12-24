<template>
    <div class="app-container">
      <div class="filter-container">
        <!--
          1.修改搜索条件
          v-model="listQuery.修改列名"
          placeholder="中文列名"
          v-->
        <el-input
          v-model="listQuery.classifyName"
          placeholder="物资分类名称"
          style="width: 200px"
          class="filter-item"
          @keyup.enter.native="handleFilter"
        />
        <!-- 1.在这里之前修改 -->
        <el-button
          v-waves
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          @click="handleFilter"
          >{{ $t("table.search") }}</el-button
        >
        <el-button
          class="filter-item"
          style="margin-left: 10px"
          type="primary"
          icon="el-icon-edit"
          @click="handleCreate"
          >{{ $t("table.add") }}</el-button
        >
        <el-button
          v-waves
          :loading="downloadLoading"
          class="filter-item"
          type="primary"
          icon="el-icon-download"
          @click="handleDownload"
          >{{ $t("table.export") }}</el-button
        >
      </div>
  
      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%"
      >
        <!--
          2.在这里修改列名
          label="修改中文列名"
          <span>{{ row.修改字段 }}</span>
          一个el-table-column和template是一个整体
        -->
        <el-table-column label="物资分类编号" align="center" width="120">
          <template slot-scope="{ row }">
            <span>{{ row.classifyId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="物资分类名称" min-width="250px" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.classifyName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('table.actions')"
          align="center"
          width="330"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="{ row }">
            <el-button type="primary" size="mini" @click="handleUpdate(row)">{{
              $t("table.edit")
            }}</el-button>
            <el-button
              v-if="row.status != 'deleted'"
              size="mini"
              type="danger"
              @click="handleDelete(row)"
              >{{ $t("table.delete") }}</el-button
            >
          </template>
        </el-table-column>
      </el-table>
  
      <!-- 分页下标 -->
      <pagination
        v-show="total > 0"
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
          style="width: 40 0px; margin-left: 50px"
        >
          <!--
          3.在这里修改表单
          <el-form-item label='修改列名中文' hidden>
          <el-input v-model="temp.修改列名" />
          -->
          <el-form-item label="物资分类编号" hidden>
            <el-input v-model="temp.classifyId" />
          </el-form-item>
          <el-form-item label="物资分类名称">
            <el-input v-model="temp.classifyName" placeholder="请填写物资名称" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">{{
            $t("table.cancel")
          }}</el-button>
          <el-button
            type="primary"
            @click="dialogStatus === 'create' ? createData() : updateData()"
            >{{ $t("table.confirm") }}</el-button
          >
        </div>
      </el-dialog>
  
      <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
        <el-table
          :data="pvData"
          border
          fit
          highlight-current-row
          style="width: 100%"
        >
          <el-table-column prop="key" label="Channel" />
          <el-table-column prop="pv" label="Pv" />
        </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogPvVisible = false">{{
            $t("table.confirm")
          }}</el-button>
        </span>
      </el-dialog>
    </div>
  </template>
  
  <script>
  import {
    createArticle,
    deleteArticle,
    fetchList,
    updateArticle,
  } from "@/api/classify";
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
        options: ["家具类","餐饮食品类","生活用品类","娱乐活动用品类","医疗保健类"],
        tableKey: 0,
        list: null,
        total: 0,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20,
          // 4.添加数据库搜索条件 （上面两个不动）
          // 修改列名: undefined,Name
          classifyName: undefined,
        },
        temp: {
          classifyId: undefined,
          classifyName: "",
        },
        dialogFormVisible: false,
        dialogStatus: "",
        textMap: {
          update: "修改",
          create: "创建",
        },
        dialogPvVisible: false,
        pvData: [],
        rules: {
          dietTime: [
            {
              type: "date",
              required: true,
              message: "时间不能为空",
              trigger: "change",
            },
          ],
          dietFood: [
            { required: true, message: "膳食内容不能为空", trigger: "blur" },
          ],
        },
        downloadLoading: false,
      };
    },
    computed: {
      ...mapGetters(["name", "id"]),
    },
    created() {
      this.getList();
    },
    methods: {
      getList() {
        this.listLoading = true;
        fetchList(this.listQuery).then((response) => {
          this.list = response.data;
          this.total = 40;
  
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
          dietId: undefined,
          dietFood: "",
          dietTime: new Date(),
          doctorName: "",
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
        this.$refs["dataForm"].validate((valid) => {
          if (valid) {
            createArticle(this.temp).then((response) => {
              this.dialogFormVisible = false;
              this.$notify({
                title: "成功",
                message: response.msg,
                type: "success",
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
        this.$refs["dataForm"].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.temp);
            tempData.dietTime = +new Date(tempData.dietTime); // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
            updateArticle(tempData).then((response) => {
              this.dialogFormVisible = false;
              this.$notify({
                title: "成功",
                message: response.msg,
                type: "success",
              });
              this.getList();
            });
          }
        });
      },
      handleDelete(row) {
        deleteArticle(row.classifyId).then((response) => {
          this.$notify({
            title: "成功",
            message: response.msg,
            type: "success",
          });
          this.getList();
        });
      },
      handleFetchPv(pv) {
        fetchPv(pv).then((response) => {
          this.pvData = response.data.pvData;
          this.dialogPvVisible = true;
        });
      },
      handleDownload() {
        this.downloadLoading = true;
        import("@/vendor/Export2Excel").then((excel) => {
          const tHeader = [
            "膳食序号",
            "当天时间",
            "膳食内容",
            "医师编号",
            "负责医师",
          ];
          const filterVal = [
            "dietId",
            "dietTime",
            "dietFood",
            "doctorId",
            "doctorName",
          ];
          const data = this.formatJson(filterVal);
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: "膳食信息表",
          });
          this.downloadLoading = false;
        });
      },
      formatJson(filterVal) {
        return this.list.map((v) =>
          filterVal.map((j) => {
            if (j === "dietTime") {
              return parseTime(v[j]);
            } else {
              return v[j];
            }
          })
        );
      },
    },
  };
  </script>
  