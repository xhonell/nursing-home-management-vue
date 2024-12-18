<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.olderName" placeholder="姓名" style="width: 200px ;margin-left: 10px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.olderSex" placeholder="性别" style="width: 200px ;margin-left: 10px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.olderAge" placeholder="年龄" style="width: 200px ;margin-left: 10px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.olderBirth" placeholder="出生日期" style="width: 200px ;margin-left: 10px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.olderHealth" placeholder="健康状态" clearable class="filter-item" style="width: 130px;margin-left: 10px;">
        <el-option v-for="item in olderHealthList" :key="item.olderHealth" :label="item.olderHealth" :value="item.olderHealth" />
      </el-select>
      <el-input v-model="listQuery.olderStartTime" placeholder="入院时间" style="width: 200px ;margin-left: 10px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.olderEndTime" placeholder="出院时间" style="width: 200px ;margin-left: 10px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.gradeId" placeholder="医护等级" clearable class="filter-item" style="width: 130px;margin-left: 10px;">
        <el-option v-for="item in gradeList" :key="item.gradeId" :label="item.gradeName+'('+item.gradeId+')'" :value="item.gradeId" />
      </el-select>
      <el-button v-waves class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-search" @click="handleFilter">
        {{ $t('table.search') }}
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        {{ $t('table.add') }}
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
      @sort-change="sortChange"
    >
      <el-table-column label="编号" prop="olderId" sortable="custom" align="center" width="160" :class-name="getSortClass('olderId')">
        <template slot-scope="{row}">
          <span>{{ row.olderId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" prop="olderName" sortable="custom" align="center" width="160">
        <template slot-scope="{row}">
          <span>{{ row.olderName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别" prop="olderSex" sortable="custom" align="center" width="500">
        <template slot-scope="{row}">
          <span>{{ row.olderSex }}</span>
        </template>
      </el-table-column>
      <el-table-column label="年龄" prop="olderAge" sortable="custom" align="center" width="500">
        <template slot-scope="{row}">
          <span>{{ row.olderAge }}</span>
        </template>
      </el-table-column>
      <el-table-column label="出生日期" prop="olderBirth" sortable="custom" align="center" width="500">
        <template slot-scope="{row}">
          <span>{{ row.olderBirth }}</span>
        </template>
      </el-table-column>
      <el-table-column label="电话号码" prop="olderPhone" sortable="custom" align="center" width="500">
        <template slot-scope="{row}">
          <span>{{ row.olderPhone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="健康状态" prop="olderHealth" sortable="custom" align="center" width="500">
        <template slot-scope="{row}">
          <span>{{ row.olderHealth }}</span>
        </template>
      </el-table-column>
      <el-table-column label="既往病史" prop="olderHistory" sortable="custom" align="center" width="500">
        <template slot-scope="{row}">
          <span>{{ row.olderHistory }}</span>
        </template>
      </el-table-column>
      <el-table-column label="入院时间" prop="olderStartTime" sortable="custom" align="center" width="500">
        <template slot-scope="{row}">
          <span>{{ row.olderStartTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="出院时间" prop="olderEndTime" sortable="custom" align="center" width="500">
        <template slot-scope="{row}">
          <span>{{ row.olderEndTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="医护等级" prop="gradeName" sortable="custom" align="center" width="500">
        <template slot-scope="{row}">
          <span>{{ row.gradeName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="olderRemark" sortable="custom" align="center" width="500">
        <template slot-scope="{row}">
          <span>{{ row.olderRemark }}</span>
        </template>
      </el-table-column>

      <!--表格内部按钮-->
      <el-table-column :label="$t('table.actions')" align="center" width="240" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            {{ $t('table.edit') }}
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
            {{ $t('table.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!--修改的表单-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="编号">
          <el-input v-model="temp.olderId" :autosize="{ minRows: 2, maxRows: 4}" retype="text" readonly />
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="temp.olderName" :autosize="{ minRows: 2, maxRows: 4}" type="text" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="性别">
          <el-input v-model="temp.olderSex" :autosize="{ minRows: 2, maxRows: 4}" type="radio" value="男" />男
          <el-input v-model="temp.olderSex" :autosize="{ minRows: 2, maxRows: 4}" type="radio" value="女" />女
        </el-form-item>
        <el-form-item label="年龄">
          <el-input v-model="temp.olderAge" :autosize="{ minRows: 2, maxRows: 4}" type="text" placeholder="请输入年龄" />
        </el-form-item>
        <el-form-item label="出生日期">
          <el-input v-model="temp.olderBirth" :autosize="{ minRows: 2, maxRows: 4}" type="date" placeholder="请输入出生日期" />
        </el-form-item>
        <el-form-item label="电话号码">
          <el-input v-model="temp.olderPhone" :autosize="{ minRows: 2, maxRows: 4}" type="text" placeholder="请输入电话号码" />
        </el-form-item>
        <el-form-item label="健康状态">
          <el-select v-model="temp.olderHealth" placeholder="部门" clearable class="filter-item" style="width: 130px">
            <el-option v-for="item in olderHealthList" :key="item.olderHealth" :label="item.olderHealth" :value="item.olderHealth" />
          </el-select>
        </el-form-item>
        <el-form-item label="既往病史">
          <el-input v-model="temp.olderHistory" :autosize="{ minRows: 2, maxRows: 4}" type="textLine" placeholder="请输入既往病史" />
        </el-form-item>
        <el-form-item label="入院时间">
          <el-input v-model="temp.olderStartTime" :autosize="{ minRows: 2, maxRows: 4}" type="dateTime" placeholder="请输入入院时间" />
        </el-form-item>
        <el-form-item label="出院时间">
          <el-input v-model="temp.olderEndTime" :autosize="{ minRows: 2, maxRows: 4}" type="dateTime" placeholder="请输入出院时间" />
        </el-form-item>
        <el-form-item label="医护等级">
          <el-select v-model="temp.gradeId" placeholder="部门" clearable class="filter-item" style="width: 130px">
            <el-option v-for="item in gradeList" :key="item.gradeId" :label="item.gradeName+'('+item.gradeId+')'" :value="item.gradeId" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="temp.olderRemark" :autosize="{ minRows: 2, maxRows: 4}" type="textLine" placeholder="请输入备注" />
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
import { findByPage, deleteOlder, addOlder, updateOlder, findAllOlderHealthList } from '@/api/person/older'
import { findAllGradeList } from '@/api/person/grade'
import moment from 'moment'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null, // 列表数据
      total: 0, // 总数据
      listLoading: true,
      listQuery: { // 查询数据
        page: 1,
        limit: 10,
        olderName: undefined,
        olderSex: undefined,
        olderAge: undefined,
        olderBirth: undefined,
        olderHealth: undefined,
        olderStartTime: undefined,
        olderEndTime: undefined,
        gradeId: undefined
      },
      olderHealthList: null,
      gradeList: null,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      showReviewer: false,
      temp: { // 修改数据
        olderId: undefined,
        olderName: '',
        olderSex: '',
        olderAge: '',
        olderBirth: new Date(),
        olderPhone: '',
        olderHealth: '',
        olderHistory: '',
        olderStartTime: new DateTime(),
        olderEndTime: new DateTime(),
        gradeId: '',
        olderRemark: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改',
        create: '添加'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        olderName: [{ required: true, message: '不能为空', trigger: 'change' }]
      },
      downloadLoading: false
    }
  },
  created() { // 数据加载之后，页面渲染之前
    this.getList()
    this.getOlderHealthList()
    this.getGradeList()
  },
  methods: {
    // 获取列表数据
    getList() { // 获取列表数据list、总数据total
      this.listLoading = true
      findByPage(this.listQuery).then(response => {
        this.list = response.data.olderList
        this.total = response.data.total
        setTimeout(() => {
          this.listLoading = false
        })
      })
    },
    // 获取健康状态列表
    getOlderHealthList() {
      this.listLoading = true
      findAllOlderHealthList(this.listQuery).then(response => {
        this.olderHealthList = response.data.olderHealthList
        setTimeout(() => {
          this.listLoading = false
        })
      })
    },
    // 获取医护等级列表
    getGradeList() {
      this.listLoading = true
      findAllGradeList(this.listQuery).then(response => {
        this.gradeList = response.data.gradeList
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
        olderId: undefined,
        olderName: '',
        olderSex: '',
        olderAge: '',
        olderBirth: new Date(),
        olderPhone: '',
        olderHealth: '',
        olderHistory: '',
        olderStartTime: new DateTime(),
        olderEndTime: new DateTime(),
        gradeId: '',
        olderRemark: ''
      }
    },

    // 添加，弹出修改表单
    handleCreate() {
      this.resetTemp()
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
          this.temp.olderBirth = moment(String(this.temp.olderBirth)).format('yyyy-MM-DD')
          this.temp.olderStartTime = moment(String(this.temp.olderStartTime)).format('yyyy-MM-DD HH:mm:ss')
          this.temp.olderEndTime = moment(String(this.temp.olderEndTime)).format('yyyy-MM-DD HH:mm:ss')
          addOlder(this.temp).then(() => {
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
      this.temp.timestamp = new Date(this.temp.timestamp)
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
          this.temp.olderBirth = moment(String(this.temp.olderBirth)).format('yyyy-MM-DD')
          this.temp.olderStartTime = moment(String(this.temp.olderStartTime)).format('yyyy-MM-DD HH:mm:ss')
          this.temp.olderEndTime = moment(String(this.temp.olderEndTime)).format('yyyy-MM-DD HH:mm:ss')
          updateOlder(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            // 替换
            // this.list.splice(index, 1, this.temp)
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

    // 删除
    handleDelete(row, index) {
      deleteOlder(row.olderId).then(() => {
        this.getList()
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
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

