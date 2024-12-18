<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.doctorName" placeholder="姓名" style="width: 120px ;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.doctorSex" placeholder="性别" style="width: 120px ;margin-left: 10px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.doctorAge" placeholder="年龄" style="width: 120px ;margin-left: 10px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.departmentId" placeholder="部门" clearable class="filter-item" style="width: 120px;margin-left: 10px;">
        <el-option v-for="item in departmentList" :key="item.departmentId" :label="item.departmentName+'('+item.departmentId+')'" :value="item.departmentId" />
      </el-select>
      <el-select v-model="listQuery.positionId" placeholder="职位" clearable class="filter-item" style="width: 120px;margin-left: 10px;">
        <el-option v-for="item in positionList" :key="item.positionId" :label="item.positionName+'('+item.positionId+')'" :value="item.positionId" />
      </el-select>
      <el-input v-model="listQuery.doctorPopularity" placeholder="评分" style="width: 120px ;margin-left: 10px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.doctorStartTime" placeholder="工作开始时间" style="width: 120px ;margin-left: 10px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.doctorEndTime" placeholder="工作结束时间" style="width: 120px ;margin-left: 10px;" class="filter-item" @keyup.enter.native="handleFilter" />
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
      @sort-change="sortChange">
      <el-table-column label="编号" prop="doctorId" sortable="custom" align="center" width="80" :class-name="getSortClass('doctorId')">
        <template slot-scope="{row}">
          <span>{{ row.doctorId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" prop="doctorName" sortable="custom" align="center" width="80" >
        <template slot-scope="{row}">
          <span>{{ row.doctorName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别" prop="doctorSex" sortable="custom" align="center" width="80" >
        <template slot-scope="{row}">
          <span>{{ row.doctorSex }}</span>
        </template>
      </el-table-column>
      <el-table-column label="年龄" prop="doctorAge" sortable="custom" align="center" width="80" >
        <template slot-scope="{row}">
          <span>{{ row.doctorAge }}</span>
        </template>
      </el-table-column>
      <el-table-column label="电话号码" prop="doctorPhone" sortable="custom" align="center" width="110" >
        <template slot-scope="{row}">
          <span>{{ row.doctorPhone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="邮箱" prop="doctorEmail" sortable="custom" align="center" width="120" >
        <template slot-scope="{row}">
          <span>{{ row.doctorEmail }}</span>
        </template>
      </el-table-column>
      <el-table-column label="部门" prop="departmentName" sortable="custom" align="center" width="80" >
        <template slot-scope="{row}">
          <span>{{ row.departmentName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="职位" prop="positionName" sortable="custom" align="center" width="80" >
        <template slot-scope="{row}">
          <span>{{ row.positionName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="工作内容" prop="doctorJob" sortable="custom" align="center" width="120" >
        <template slot-scope="{row}">
          <el-popover
            placement="top"
            width="300"
            trigger="hover"
            :content="row.doctorJob">
            <span slot="reference" class="popover-content">{{ row.doctorJob | truncate }}</span>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="个人简介" prop="doctorIntroduction" sortable="custom" align="center" width="120" >
        <template slot-scope="{row}">
          <el-popover
            placement="top"
            width="300"
            trigger="hover"
            :content="row.doctorIntroduction">
            <span slot="reference" class="popover-content">{{ row.doctorIntroduction | truncate }}</span>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="工作经验" prop="doctorExperience" sortable="custom" align="center" width="120" >
        <template slot-scope="{row}">
          <el-popover
            placement="top"
            width="300"
            trigger="hover"
            :content="row.doctorExperience">
            <span slot="reference" class="popover-content">{{ row.doctorExperience | truncate }}</span>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="工作开始时间" prop="doctorStartTime" sortable="custom" align="center" width="140" >
        <template slot-scope="{row}">
          <span>{{ row.doctorStartTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="工作结束时间" prop="doctorEndTime" sortable="custom" align="center" width="140" >
        <template slot-scope="{row}">
          <span>{{ row.doctorEndTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="评分" prop="doctorPopularity" sortable="custom" align="center" width="80" >
        <template slot-scope="{row}">
          <span>{{ row.doctorPopularity }}</span>
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
          <el-input v-model="temp.doctorId" :autosize="{ minRows: 2, maxRows: 4}" retype="text" readonly/>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="temp.doctorName" :autosize="{ minRows: 2, maxRows: 4}" type="text" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="性别">
          <el-input v-model="temp.doctorSex" :autosize="{ minRows: 2, maxRows: 4}" type="text" placeholder="请输入性别" />
        </el-form-item>
        <el-form-item label="年龄">
          <el-input v-model="temp.doctorAge" :autosize="{ minRows: 2, maxRows: 4}" type="text" placeholder="请输入年龄" />
        </el-form-item>
        <el-form-item label="电话号码">
          <el-input v-model="temp.doctorPhone" :autosize="{ minRows: 2, maxRows: 4}" type="text" placeholder="请输入电话号码" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="temp.doctorEmail" :autosize="{ minRows: 2, maxRows: 4}" type="text" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="工作内容">
          <el-input v-model="temp.doctorJob" :autosize="{ minRows: 2, maxRows: 4}" type="textLine" placeholder="请输入工作内容" />
        </el-form-item>
        <el-form-item label="个人简介">
          <el-input v-model="temp.doctorIntroduction" :autosize="{ minRows: 2, maxRows: 4}" type="textLine" placeholder="请输入个人简介" />
        </el-form-item>
        <el-form-item label="工作经验">
          <el-input v-model="temp.doctorExperience" :autosize="{ minRows: 2, maxRows: 4}" type="textLine" placeholder="请输入工作经验" />
        </el-form-item>
        <el-form-item label="工作开始时间">
          <el-input v-model="temp.doctorStartTime" :autosize="{ minRows: 2, maxRows: 4}" type="datetime" placeholder="请输入工作开始时间" />
        </el-form-item>
        <el-form-item label="工作结束时间">
          <el-input v-model="temp.doctorEndTime" :autosize="{ minRows: 2, maxRows: 4}" type="datetime" placeholder="请输入工作结束时间" />
        </el-form-item>
        <el-form-item label="评分">
          <el-input v-model="temp.doctorPopularity" :autosize="{ minRows: 2, maxRows: 4}" type="text" placeholder="请输入评分" />
        </el-form-item>
        <el-form-item label="职位">
          <el-select v-model="temp.positionId" placeholder="职位" clearable class="filter-item" style="width: 130px">
            <el-option v-for="item in positionAllList" :key="item.positionId" :label="item.positionName+'('+item.positionId+')'" :value="item.positionId" />
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
import {findByPage, deleteDoctor, addDoctor, updateDoctor } from '@/api/person/doctor'
import { findAllDepartmentList } from '@/api/person/department'
import { findPositionByDepartmentIdList, findPositionAllList } from '@/api/person/position'
import moment from 'moment'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    truncate(value) {
      if (!value) return ''
      const length = 20 // 调整长度
      return value.length > length ? value.slice(0, length) + '...' : value
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null, //列表数据
      total: 0,  //总数据
      listLoading: true,
      listQuery: { //查询数据
        page: 1,
        limit: 10,
        doctorName: '',
        doctorSex:'',
        doctorAge:'',
        departmentId:'',
        positionId:'',
        doctorPopularity:'',
        doctorStartTime:'',
        doctorEndTime:''
      },
      departmentList:null,
      positionList:null,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      showReviewer: false,
      temp: { //修改数据
        doctorId: undefined,
        doctorName: "",
        doctorSex:"",
        doctorAge:"",
        doctorPhone:"",
        doctorEmail:"",
        doctorJob:"",
        doctorExperience:"",
        doctorIntroduction:"",
        doctorStartTime:'',
        doctorEndTime:'',
        doctorPopularity:"",
        positionId:"",
      },
      positionAllList:null,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改',
        create: '添加'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        doctorName: [{ required: true, message: '不能为空', trigger: 'change' }]
      },
      downloadLoading: false
    }
  },
  created() { //数据加载之后，页面渲染之前
    this.getList()
    this.getDepartmentList()
    this.getPositionAllList()
  },
  watch:{ //监听数据变化(职位随着部门变化)
    'listQuery.departmentId':function(){
        this.getPositionList(this.listQuery.departmentId)
    }
  },
  methods: {
    //获取列表数据
    getList() { //获取列表数据list、总数据total
      this.listLoading = true;
      findByPage(this.listQuery).then(response =>{
        this.list=response.data.doctorList
        this.total=response.data.total
        console.log(this.total)
        setTimeout(()=>{
          this.listLoading = false
        })
      })
    },
    //获取部门列表
    getDepartmentList(){
      this.listLoading=true;
      findAllDepartmentList(this.listQuery).then(response =>{
        this.departmentList=response.data.departmentList
        setTimeout(()=>{
          this.listLoading = false
        })
      })
    },
    //获取职位列表
    getPositionList(){
      this.listLoading=true;
      findPositionByDepartmentIdList(this.listQuery).then(response =>{
        this.positionList=response.data.positionList
        setTimeout(()=>{
          this.listLoading = false
        })
      })
    },
    //获取所有职位列表
    getPositionAllList(){
      findPositionAllList().then(response =>{
        this.positionAllList=response.data.positionAllList
      })
    },
    //查询，分页
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
        doctorId: undefined,
        doctorName: "",
        doctorSex:"",
        doctorAge:"",
        doctorPhone:"",
        doctorEmail:"",
        doctorJob:"",
        doctorExperience:"",
        doctorIntroduction:"",
        doctorStartTime:'',
        doctorEndTime:'',
        doctorPopularity:"",
        positionId:"",
      }
    },

    //添加，弹出修改表单
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
        //判断验证是否通过
        if (valid) {
          this.temp.doctorStartTime = moment(String(this.temp.doctorStartTime)).format('HH:mm:ss')
          this.temp.doctorEndTime = moment(String(this.temp.doctorEndTime)).format('HH:mm:ss')
          addDoctor(this.temp).then(() => {
            // this.list.unshift(this.temp)
            //把添加的数据存储到集合中
            this.getList();
            //关闭弹窗
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

    //修改，弹出修改表单
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
          //把temp中的数据拷贝到tempData中，作为临时数据
          const tempData = Object.assign({}, this.temp)
          this.temp.doctorStartTime = moment(String(this.temp.doctorStartTime)).format('HH:mm:ss')
          this.temp.doctorEndTime = moment(String(this.temp.doctorEndTime)).format('HH:mm:ss')
          updateDoctor(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            //替换
            // this.list.splice(index, 1, this.temp)
            this.getList();
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

    //删除
    handleDelete(row, index) {
      deleteDoctor(row.doctorId).then(()=>{
        this.getList();
        this.$notify({
          title:'成功',
          message:'删除成功',
          type:'success',
          duration:2000
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

<style>
.popover-content {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
