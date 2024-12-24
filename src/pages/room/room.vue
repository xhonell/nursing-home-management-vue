<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.roomName"
        class="filter-item"
        style="width: 200px;"
        placeholder="房间号"
        @keyup.enter.native="handleFilter"
      />

      <el-input
        v-model="listQuery.doctorName"
        class="filter-item"
        style="width: 200px;"
        placeholder="医生姓名"
        @keyup.enter.native="handleFilter"
      />

      <el-input
        v-model="listQuery.olderName"
        class="filter-item"
        style="width: 200px;"
        placeholder="老人姓名"
        @keyup.enter.native="handleFilter"
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
    <!-- 头显示 -->
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
        label="房间编号"
        align="center"
        width="80"
      >
        <template slot-scope="{row}">
          <span>{{ row.roomId }}</span>
        </template>

      </el-table-column>
      <el-table-column label="房间名字" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.roomName }}</span>
        </template>

      </el-table-column>
      <el-table-column label="医生名字" min-width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.doctorName }}</span>
        </template>

      </el-table-column>
      <el-table-column label="老人名字" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.olderName }}</span>
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
        <!-- 添加 -->
        <el-form-item label="房间编号" prop="roomId" hidden>
          <el-input v-model="temp.roomId" type="text" :rows="2" placeholder="请填写房间编号" />
        </el-form-item>

        <el-form-item label="房间名字" prop="roomName">
          <el-input v-model="temp.roomName" type="text" :rows="2" placeholder="请填写房间名字" />
        </el-form-item>

        <el-form-item label="医生名字" prop="doctorId">
          <el-input v-model="temp.doctorId" type="textarea" :rows="2" placeholder="请填写名字" />
        </el-form-item>

        <el-form-item label="老人名字" prop="olderId">
          <el-input v-model="temp.olderId" type="textarea" :rows="2" placeholder="请填写老人" />
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
} from '@/api/room'
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
        roomName: '',
        doctorId: '',
        olderId: ''
      },
      temp: {
        roomId: undefined,
        roomName: '',
        doctorId: undefined,
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
        dietTime: [
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
        }, 1.5 * 0)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    // 修改使用
    resetTemp() {
      this.temp = {
        roomId: undefined,
        roomName: '',
        doctorId: undefined,
        olderId: undefined
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
          // tempData.dietTime = +new Date(tempData.dietTime); // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
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
      deleteArticle(row.roomId).then(response => {
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
        const tHeader = ['房间编号', '房间号', '医生编号', '医生名字', '老人编号', '老人姓名']
        const filterVal = [
          'roomId',
          'roomName',
          'fileStudy',
          'fileExam',
          'doctorId',
          'doctorName'
        ]
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '员工档案'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v =>
        filterVal.map(j => {
          if (j === 'dietTime') {
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
