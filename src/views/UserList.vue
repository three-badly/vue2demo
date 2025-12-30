<template>
  <div class="user-list-container">
    <div class="search-form">
      <el-form :model="queryForm" inline>
        <el-form-item label="用户名">
          <el-input 
            v-model="queryForm.username" 
            placeholder="请输入用户名"
            clearable
          />
        </el-form-item>
        <el-form-item label="公司名称">
          <el-input 
            v-model="queryForm.companyName" 
            placeholder="请输入公司名称"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fetchUserList">查询</el-button>
          <el-button @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table :data="userList" style="width: 100%" v-loading="loading">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="account" label="账号" width="120" />
      <el-table-column prop="username" label="用户名" width="120" />
      <el-table-column prop="mobile" label="手机号" width="130" />
      <el-table-column prop="role" label="身份" width="100" />
      <el-table-column prop="companyName" label="公司名称" />
    </el-table>

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryForm.current"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="queryForm.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      style="margin-top: 20px; text-align: right;"
    />
  </div>
</template>

<script>
import request from '@/utils/request';

export default {
  name: 'UserList',
  data() {
    return {
      userList: [],
      total: 0,
      loading: false,
      queryForm: {
        current: 1,
        size: 10,
        username: '',
        companyName: ''
      }
    };
  },
  created() {
    this.fetchUserList();
  },
  methods: {
    async fetchUserList() {
      this.loading = true;
      try {
        const response = await request({
          url: '/user/pageUser',
          method: 'get',
          params: {
            current: this.queryForm.current,
            size: this.queryForm.size,
            username: this.queryForm.username,
            companyName: this.queryForm.companyName
          }
        });

        // 根据实际响应结构调整，假设返回的数据结构为 { records: [], total: 0 }
        this.userList = response.records || [];
        this.total = response.total || 0;
      } catch (error) {
        console.error('获取用户列表失败:', error);
        this.$message.error(error.message || '获取用户列表失败');
      } finally {
        this.loading = false;
      }
    },
    handleSizeChange(val) {
      this.queryForm.size = val;
      this.fetchUserList();
    },
    handleCurrentChange(val) {
      this.queryForm.current = val;
      this.fetchUserList();
    },
    resetQuery() {
      this.queryForm = {
        current: 1,
        size: 10,
        username: '',
        companyName: ''
      };
      this.fetchUserList();
    }
  }
};
</script>

<style scoped>
.user-list-container {
  padding: 20px;
}

.search-form {
  margin-bottom: 20px;
  padding: 20px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>