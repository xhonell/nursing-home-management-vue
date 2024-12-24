<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- 搜索框 -->
      <el-input
        v-model="listQuery.activityName"
        placeholder="活动名称"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.activityAddress"
        placeholder="活动地址"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />

      <el-input
        v-model="listQuery.doctorName"
        placeholder="医生"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <!-- <el-date-picker
          v-model="listQuery.activityTime"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          type="datetime"
          class="filter-item"
          placeholder="选择时间"
        ></el-date-picker> -->

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
    <!-- 头部显示栏 -->
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="活动编号" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ ((listQuery.page - 1) * listQuery.limit) + (scope.$index + 1) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="活动名称" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.activityName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="活动时间" min-width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.activityTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column label="活动地址" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.activityAddress }}</span>
        </template>
      </el-table-column>

      <el-table-column label="活动内容" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.activityContent }}</span>
        </template>
      </el-table-column>

      <el-table-column label="医生" width="150px" align="center">
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
        <!-- 添加栏 -->
        <el-form-item label="活动编号" hidden>
          <el-input v-model="temp.activityId" />
        </el-form-item>

        <el-form-item label="活动名字" prop="activityName">
          <el-input v-model="temp.activityName" type="textarea" :rows="2" placeholder="请填写活动地址" />
        </el-form-item>

        <el-form-item label="活动时间" prop="activityTime">
          <el-date-picker
            v-model="temp.activityTime"
            type="datetime"
            placeholder="请选择一个时间"
          />
        </el-form-item>
        <el-form-item label="活动地址" prop="activityAddress">
          <el-input v-model="temp.activityAddress" type="textarea" :rows="2" placeholder="请填写活动地址" />
        </el-form-item>

        <el-form-item label="活动内容" prop="activityContent">
          <el-input v-model="temp.activityContent" type="textarea" :rows="2" placeholder="请填写活动内容" />
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
}
// 修改Api
from '@/api/activity'
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
        activityName: '',
        activityAddress: '',
        doctorId: ''
      },
      // 修改
      temp: {
        activityId: undefined,
        activityName: '',
        activityTime: new Date(),
        activityAddress: '',
        activityContent: '',
        doctorId: undefined,
        doctorName: ''
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
        activityTime: [
          {
            type: 'date',
            required: true,
            message: '时间不能为空',
            trigger: 'change'
          }
        ],
        dietFood: [
          { required: true, message: '膳食内容不能为空', trigger: 'blur' }
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
        this.list = response.data
        this.total = 100

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
    // 是方法里面的调用
    resetTemp() {
      this.temp = {
        activityId: undefined,
        activityName: '',
        activityTime: new Date(),
        activityAddress: '',
        activityContent: '',
        doctorId: undefined,
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
          this.temp.activityTime = +new Date(this.temp.activityTime)// 转换为时间戳
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
      this.temp.activityTime = new Date(this.temp.activityTime)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 修改
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.activityTime = +new Date(tempData.activityTime) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
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
    // 删除

    handleDelete(row) {
      deleteArticle(row.activityId).then(response => {
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
    // 文件导出
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['活动编号', '当天时间', '膳食内容', '医师编号', '负责医师']
        const filterVal = [
          'activityId',
          'activityTime',
          'dietFood',
          'doctorId',
          'doctorName'
        ]
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '活动信息表'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v =>
        filterVal.map(j => {
          if (j === 'activityTime') {
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
