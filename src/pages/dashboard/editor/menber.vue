<template>
  <div class="container">
    <h3>小组成员</h3>
    <div v-for="item in menber" :key="item" style="margin-bottom:10px;">
      <el-row>
        <el-col :span="11" style="text-align:left;" :offset="2">姓名：{{ item.name }}</el-col>
        <el-col :span="10">职位：{{ item.position }}</el-col>
      </el-row>
    </div>
    {{ remark }}
  </div>
</template>

<script>
export default {
  name: 'Menber',
  data() {
    return {
      menber: [
        { name: '李旗', position: '组长' },
        { name: '段林宏', position: '成员' },
        { name: '黄雄', position: '成员' },
        { name: '侯仁杰', position: '成员' },
        { name: '钟婧', position: '成员' }
      ],
      remark: '(按姓氏字母排序)'
    }
  }
}
</script>
<style>
.container {
  width: 100%;
  height: 100%;
  border: 1px solid #4f4f4f;
  border-radius: 5px;
  text-align: center;
  background-color: #efefef;
}
</style>
