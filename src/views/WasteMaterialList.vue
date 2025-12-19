<template>
  <div class="waste-list-container">
    <div class="card shadow-lg">
      <!-- 头部与搜索栏 -->
      <div class="search-bar">
        <div class="search-item">
          <label>时间范围</label>
          <div class="date-picker-group">
            <input type="date" v-model="queryParams.startDate" />
            <span>至</span>
            <input type="date" v-model="queryParams.endDate" />
          </div>
        </div>
        <button class="search-btn" @click="handleSearch">
          <i class="fa-solid fa-magnifying-glass"></i> 查询
        </button>
      </div>

      <!-- 数据表格 -->
      <div class="table-wrapper">
        <table class="custom-table" v-loading="loading">
          <thead>
            <tr>
              <th>订单编号</th>
              <th>图号</th>
              <th>原料重量(kg)</th>
              <th>成品重量(kg)</th>
              <th>废料重量(kg)</th>
              <th>计划数量</th>
              <th>总废料(kg)</th>
              <th>生产时间</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in tableData" :key="item.id">
              <td>{{ item.productOrderNumber }}</td>
              <td>{{ item.figure }}</td>
              <td>{{ item.singleMaterialWt }}</td>
              <td>{{ item.singleProductWt }}</td>
              <td class="highlight">{{ item.singleWasteWt }}</td>
              <td>{{ item.planQuantity }}</td>
              <td class="font-bold text-blue-600">{{ item.totalWasteWt }}</td>
              <td class="text-xs text-gray-500">{{ item.orderProdTime }}</td>
            </tr>
            <tr v-if="tableData.length === 0">
              <td colspan="8" class="empty-cell">暂无数据</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 分页组件 -->
      <div class="pagination">
        <button :disabled="queryParams.current <= 1" @click="changePage(queryParams.current - 1)">上一页</button>
        <span class="page-info">第 {{ queryParams.current }} / {{ totalPages }} 页 (总计 {{ total }} 条)</span>
        <button :disabled="queryParams.current >= totalPages" @click="changePage(queryParams.current + 1)">下一页</button>
      </div>
    </div>
  </div>
</template>

<script>
import request from '@/utils/request';

export default {
  name: 'WasteMaterialList',
  data() {
    return {
      loading: false,
      tableData: [],
      total: 0,
      totalPages: 0,
      queryParams: {
        current: 1,
        page: 1,
        size: 10,
        startDate: '',
        endDate: ''
      }
    };
  },
  created() {
    this.setDefaultDates();
    this.fetchData();
  },
  methods: {
    setDefaultDates() {
      const end = new Date();
      const start = new Date();
      start.setMonth(start.getMonth() - 1); // 默认一个月前
      
      this.queryParams.startDate = start.toISOString().split('T')[0];
      this.queryParams.endDate = end.toISOString().split('T')[0];
    },
    async fetchData() {
      this.loading = true;
      try {
        // 调用您的 @GetMapping("/queryWasteMaterial")
        const res = await request.get('/wasteMaterial/queryWasteMaterial', {
          params: this.queryParams
        });
        if (res) {
          this.tableData = res.records || [];
          this.total = res.total || 0;
          this.totalPages = res.pages || 1;
        }
      } catch (err) {
        console.error('查询失败', err);
      } finally {
        this.loading = false;
      }
    },
    handleSearch() {
      this.queryParams.current = 1;
      this.fetchData();
    },
    changePage(page) {
      this.queryParams.current = page;
      this.fetchData();
    }
  }
};
</script>

<style scoped>
.waste-list-container { padding: 20px; }
.card { background: white; border-radius: 12px; padding: 24px; }
.search-bar { display: flex; align-items: flex-end; gap: 20px; margin-bottom: 24px; padding-bottom: 20px; border-bottom: 1px dashed #eee; }
.search-item { display: flex; flex-direction: column; gap: 8px; }
.search-item label { font-size: 13px; color: #606266; font-weight: bold; }
.date-picker-group { display: flex; align-items: center; gap: 10px; }
.date-picker-group input { padding: 8px 12px; border: 1px solid #dcdfe6; border-radius: 4px; font-size: 14px; }
.search-btn { background: #409eff; color: white; border: none; padding: 9px 20px; border-radius: 4px; cursor: pointer; font-size: 14px; transition: 0.3s; }
.search-btn:hover { background: #66b1ff; }

.table-wrapper { overflow-x: auto; margin-bottom: 20px; }
.custom-table { width: 100%; border-collapse: collapse; font-size: 14px; }
.custom-table th, .custom-table td { padding: 14px; text-align: left; border-bottom: 1px solid #ebeef5; }
.custom-table th { background-color: #f5f7fa; color: #909399; font-weight: 600; }
.custom-table tr:hover { background-color: #fafafa; }
.highlight { color: #f56c6c; font-weight: bold; }
.empty-cell { text-align: center; color: #999; padding: 40px; }

.pagination { display: flex; align-items: center; justify-content: center; gap: 15px; margin-top: 10px; }
.pagination button { padding: 6px 12px; border: 1px solid #dcdfe6; background: white; border-radius: 4px; cursor: pointer; font-size: 13px; }
.pagination button:disabled { color: #ccc; cursor: not-allowed; }
.page-info { font-size: 13px; color: #606266; }
</style>