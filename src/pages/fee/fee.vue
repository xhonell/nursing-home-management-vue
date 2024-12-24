<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.feeName"
        placeholder="费用项目"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-date-picker
        v-model="listQuery.feeTime"
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
        label="费用编号"
        prop="feeId"
        align="center"
        width="80"
      >
        <template slot-scope="{row}">
          <span>{{ row.feeId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="费用项目" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.feeName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="费用价格" min-width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.feePrice }}</span>
        </template>
      </el-table-column>
      <el-table-column label="费用状况" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.feeState }}</span>
        </template>
      </el-table-column>
      <el-table-column label="费用时间" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.feeTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="老人编号" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.olderId }}</span>
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
        <el-form-item label="费用编号" hidden>
          <el-input v-model="temp.feeId" />
        </el-form-item>
        <el-form-item label="费用项目" prop="feeName">
          <el-input v-model="temp.feeName" placeholder="请填写费用项目" />
        </el-form-item>
        <el-form-item label="费用价格" prop="feePrice">
          <el-input-number v-model="temp.feePrice" :precision="2" :step="0.1" placeholder="请填写费用价格" />
        </el-form-item>
        <el-form-item label="费用状况" prop="feeState">
          <el-select v-model="temp.feeState" placeholder="请选择费用状况">
            <el-option label="已支付" value="已支付" />
            <el-option label="未支付" value="未支付" />
          </el-select>
        </el-form-item>
        <el-form-item label="费用时间" prop="feeTime">
          <el-date-picker
            v-model="temp.feeTime"
            type="datetime"
            placeholder="请选择一个时间"
          />
        </el-form-item>
        <el-form-item label="老人编号" prop="olderId">
          <el-input v-model="temp.olderId" placeholder="请填写老人编号" />
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
  createArticle,
  updateArticle,
  deleteArticle
} from '@/api/fee'
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
        feeName: undefined,
        feeTime: undefined
      },
      temp: {
        feeId: undefined,
        feeName: '',
        feePrice: 0,
        feeState: '未支付',
        feeTime: new Date(),
        olderId: undefined
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
        feeName: [
          { required: true, message: '费用项目不能为空', trigger: 'blur' }
        ],
        feePrice: [
          { required: true, message: '费用价格不能为空', trigger: 'blur' }
        ],
        feeState: [
          { required: true, message: '费用状况不能为空', trigger: 'change' }
        ],
        feeTime: [
          {
            type: 'date',
            required: true,
            message: '时间不能为空',
            trigger: 'change'
          }
        ],
        olderId: [
          { required: true, message: '老人编号不能为空', trigger: 'blur' }
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
        feeId: undefined,
        feeName: '',
        feePrice: 0,
        feeState: '未支付',
        feeTime: new Date(),
        olderId: undefined
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
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
      this.temp.feeTime = new Date(this.temp.feeTime)
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
          tempData.feeTime = +new Date(tempData.feeTime) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
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
    handleFetchPv(pv) {
      fetchFeePv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['费用编号', '费用项目', '费用价格', '费用状况', '费用时间', '老人编号']
        const filterVal = [
          'feeId',
          'feeName',
          'feePrice',
          'feeState',
          'feeTime',
          'olderId'
        ]
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '费用信息表'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v =>
        filterVal.map(j => {
          if (j === 'feeTime') {
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
