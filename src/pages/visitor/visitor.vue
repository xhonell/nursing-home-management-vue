<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.visitorName"
        placeholder="来访姓名"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.visitorCard"
        placeholder="来访身份证号码"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-date-picker
        v-model="listQuery.visitorTime"
        type="datetime"
        class="filter-item"
        placeholder="选择日期时间"
      />

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
      <el-table-column
        label="来访编号"
        prop="visitorId"
        align="center"
        width="80"
      >
        <template slot-scope="{row}">
          <span>{{ row.visitorId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="来访时间" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.visitorTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="来访姓名" min-width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.visitorName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="来访身份证号码" min-width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.visitorCard }}</span>
        </template>
      </el-table-column>
      <el-table-column label="来访原因" min-width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.visitorReason }}</span>
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
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="来访编号" hidden>
          <el-input v-model="temp.visitorId" />
        </el-form-item>
        <el-form-item label="来访姓名" prop="visitorName">
          <el-input v-model="temp.visitorName" placeholder="请输入来访姓名" />
        </el-form-item>
        <el-form-item label="来访身份证号码" prop="visitorCard">
          <el-input v-model="temp.visitorCard" placeholder="请输入来访身份证号码" />
        </el-form-item>
        <el-form-item label="来访时间" prop="visitorTime">
          <el-date-picker
            v-model="temp.visitorTime"
            type="datetime"
            placeholder="请选择一个时间"
          />
        </el-form-item>
        <el-form-item label="来访原因" prop="visitorReason">
          <el-input v-model="temp.visitorReason" type="textarea" :rows="2" placeholder="请填写来访原因" />
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
  deleteArticle
} from '@/api/visitor'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { mapGetters } from 'vuex'

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        visitorName: undefined,
        visitorCard: undefined,
        visitorTime: undefined
      },
      temp: {
        visitorId: undefined,
        visitorName: '',
        visitorCard: '',
        visitorTime: new Date(),
        visitorReason: '',
        doctorName: '',
        doctorId: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改',
        create: '创建'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        visitorName: [
          { required: true, message: '来访姓名不能为空', trigger: 'blur' }
        ],
        visitorCard: [
          { required: true, message: '来访身份证号码不能为空', trigger: 'blur' }
        ],
        visitorTime: [
          {
            type: 'date',
            required: true,
            message: '时间不能为空',
            trigger: 'change'
          }
        ],
        visitorReason: [
          { required: true, message: '来访原因不能为空', trigger: 'blur' }
        ]
      },
      downloadLoading: false
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'id'
    ])
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.count

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    resetTemp() {
      this.temp = {
        visitorId: undefined,
        visitorName: '',
        visitorCard: '',
        visitorTime: new Date(),
        visitorReason: '',
        doctorName: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
        this.temp.doctorId = this.id
        this.temp.doctorName = this.name
      })
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          createArticle(this.temp).then(response => {
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: response.msg,
              type: 'success'
            })
            this.getList()
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.visitorTime = new Date(this.temp.visitorTime)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.visitorTime = +new Date(tempData.visitorTime) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateArticle(tempData).then(response => {
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: response.msg,
              type: 'success'
            })
            this.getList()
          })
        }
      })
    },
    handleDelete(row) {
      deleteArticle(row.visitorId).then(response => {
        this.$notify({
          title: '成功',
          message: response.msg,
          type: 'success'
        })
        this.getList()
      })
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['来访编号', '来访姓名', '来访身份证号码', '来访时间', '来访原因']
        const filterVal = [
          'visitorId',
          'visitorName',
          'visitorCard',
          'visitorTime',
          'visitorReason'
        ]
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '来访登记表'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v =>
        filterVal.map(j => {
          if (j === 'visitorTime') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        })
      )
    }
  }
}
</script>
