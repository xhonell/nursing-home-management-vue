<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        {{ $t('table.add') }}
      </el-button>
    </div>

    <!--表格内容-->
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange">
      <el-table-column label="编号" align="center" width="150" >
        <template slot-scope="scope">
          <span>{{((listQuery.page - 1) * listQuery.limit) + (scope.$index + 1)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="服务建议" prop="serviceContent" sortable="custom" align="center" width="370">
        <template slot-scope="{row}">
          <el-popover placement="top" width="300" trigger="hover" :content="row.serviceContent">
            <span slot="reference" class="popover-content">{{ row.serviceContent | truncate }}</span>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="解决方案" prop="serviceSolution" sortable="custom" align="center" width="370">
        <template slot-scope="{row}">
          <el-popover placement="top" width="300" trigger="hover" :content="row.serviceSolution">
            <span slot="reference" class="popover-content">{{ row.serviceSolution | truncate }}</span>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="是否赞成" prop="serviceIsAgree" sortable="custom" align="center" width="150">
        <template slot-scope="{row}">
          <span>{{ row.serviceIsAgree }}</span>
        </template>
      </el-table-column>

      <!--表格内部按钮-->
      <el-table-column :label="$t('table.actions')" align="center" width="240" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            {{ $t('table.edit') }}
          </el-button>
          <el-button type="primary" size="mini" @click="handleCheck(row)">
            详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!--修改的表单-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 660px; margin-left:50px;">
        <el-form-item label="编号" hidden>
          <el-input v-model="temp.serviceId" :autosize="{ minRows: 2, maxRows: 4}" retype="text" readonly />
        </el-form-item>
        <el-form-item label="服务建议">
          <el-input v-model="temp.serviceContent" :autosize="{ minRows: 6, maxRows: 10}" type="textarea"   clearable placeholder="请输入服务建议" />
        </el-form-item>
        <el-form-item label="解决方案">
          <el-input v-model="temp.serviceSolution" :autosize="{ minRows: 6, maxRows: 10}" type="textarea" readonly/>
        </el-form-item>
        <el-form-item label="是否同意">
          <el-select v-model="temp.serviceIsAgree" :autosize="{ minRows: 2, maxRows: 4 }" style="width: 330px;" clearable placeholder="是否同意">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          {{ $t('table.cancel') }}
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          {{ $t('table.confirm') }}
        </el-button>
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
import { findQuestion,addQuestion,updateQuestion} from '@/api/service/service'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { mapGetters } from "vuex";

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
  },
  data() {
    return {
      options: [{ //性别选项
          value: '非常同意',
          label: '非常同意'
        },{
          value: '同意',
          label: '同意'
        },{
          value: '不同意',
          label: '不同意'
        },{
          value: '未回复',
          label: '未回复'
        }],
      tableKey: 0,
      list: null, // 列表数据
      total: 0, // 总数据
      listLoading: true,
      listQuery: { // 查询数据
        page: 1,
        limit: 10,
        roleId:''
      },
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      showReviewer: false,
      temp: { // 修改数据
        serviceId: undefined,
        serviceContent: '',
        serviceSolution:'',
        serviceIsAgree: '',
        roleId:''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改服务建议',
        create: '添加服务建议'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
      },
      downloadLoading: false
    }
  },
  computed: {
    ...mapGetters(['id'])
  },

  created() { // 数据加载之后，页面渲染之前
    this.getList()
  },
  mounted() { // 页面渲染之后
    this.listQuery.roleId = this.id
  },
  methods: {
    // 获取列表数据
    getList() { // 获取列表数据list、总数据total
      this.listLoading = true
      findQuestion(this.listQuery).then(response => {
        this.list = response.data.questionList
        this.total = response.data.total
        setTimeout(() => {
          this.listLoading = false
        })
      })
    },
    // 查询，分页
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },

    handleModifyStatus(row, status) {
      this.$message({
        message: '成功',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        serviceId: undefined,
        serviceContent: '',
        serviceSolution:'',
        serviceIsAgree: '',
        roleId:''
      }
    },

    // 添加，弹出修改表单
    handleCreate() {
      this.resetTemp()
      this.temp.roleId = this.listQuery.roleId;
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        // 判断验证是否通过
        if (valid) {
          // this.temp.doctorStartTime = moment(String(this.temp.doctorStartTime)).format('HH:mm:ss')
          // this.temp.doctorEndTime = moment(String(this.temp.doctorEndTime)).format('HH:mm:ss')
          addQuestion(this.temp).then(() => {
            // this.list.unshift(this.temp)
            // 把添加的数据存储到集合中
            this.getList()
            // 关闭弹窗
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '添加成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },

    // 修改，弹出修改表单
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.roleId = this.listQuery.roleId;
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // 把temp中的数据拷贝到tempData中，作为临时数据
          const tempData = Object.assign({}, this.temp)
          updateQuestion(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            // 替换
            this.list.splice(index, 1, this.temp)
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },

    //详情
    handleCheck(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'check'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    handleFetchPv(pv) {

    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>

<style>
.popover-content {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

<style>
.no-wrap-label .el-form-item__label {
  white-space: nowrap;
}
</style>
