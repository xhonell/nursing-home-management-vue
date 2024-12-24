<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="listQuery.serviceIsOk" placeholder="是否解决" style="width: 200px;margin-left: 10px;" clearable class="filter-item" @change="handleFilter" >
        <el-option v-for="item in solutions" :key="item.value" :label="item.label" :value="item.value"/>
      </el-select>
      <el-select v-model="listQuery.serviceIsAgree" placeholder="是否同意" style="width: 200px;margin-left: 10px;" clearable class="filter-item" @change="handleFilter" >
        <el-option v-for="item in agrees" :key="item.value" :label="item.label" :value="item.value"/>
      </el-select>
      <el-button v-waves class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-search" @click="handleFilter">
        {{ $t('table.search') }}
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        {{ $t('table.export') }}
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
      <el-table-column label="是否解决" prop="serviceIsOk" sortable="custom" align="center" width="150">
        <template slot-scope="{row}">
          <el-switch
            v-model="row.serviceIsOk"
            :active-value="'已解决'"
            :inactive-value="'未解决'"
            :disabled="true">
          </el-switch>
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
          <el-input v-model="temp.serviceContent" :autosize="{ minRows: 6, maxRows: 10}" type="textarea" readonly />
        </el-form-item>
        <el-form-item label="解决方案">
          <el-input v-model="temp.serviceSolution" :autosize="{ minRows: 6, maxRows: 10}" type="textarea" clearable placeholder="请输入解决方案" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          {{ $t('table.cancel') }}
        </el-button>
        <el-button type="primary" @click="dialogStatus==='update'?updateData():checkData()">
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
import { findService,updateService} from '@/api/service/service'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
  },
  data() {
    return {
        solutions: [{ //是否解决选项
          value: '已解决',
          label: '已解决'
        },{
          value: '未解决',
          label: '未解决'
        }],
        agrees: [{ //是否赞成选项
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
      serviceIsOk:'',
      tableKey: 0,
      list: null, // 列表数据
      total: 0, // 总数据
      listLoading: true,
      listQuery: { // 查询数据
        page: 1,
        limit: 10,
        serviceIsOk: '',
        serviceIsAgree:''
      },
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      showReviewer: false,
      temp: { // 修改数据
        serviceId: undefined,
        serviceContent: '',
        serviceSolution:'',
        serviceIsOk: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改解决方案',
        check: '查看详情'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
      },
      downloadLoading: false
    }
  },
  created() { // 数据加载之后，页面渲染之前
    this.getList()
  },
  methods: {
    // 获取列表数据
    getList() { // 获取列表数据list、总数据total
      this.listLoading = true
      findService(this.listQuery).then(response => {
        this.list = response.data.serviceList.map(item => {
          if (item.serviceSolution === '' && item.serviceIsOk === '已解决') {
            item.serviceIsOk = '未解决';
          }
          return item;
        });
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
        serviceIsOk: ''
      }
    },

    // 修改，弹出修改表单
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.temp.serviceSolution === '') {
            this.temp.serviceIsOk = '未解决';
          }else{
            this.temp.serviceIsOk = '已解决';
          }
          // 把temp中的数据拷贝到tempData中，作为临时数据
          const tempData = Object.assign({}, this.temp)
          updateService(tempData).then(() => {
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
