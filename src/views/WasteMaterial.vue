<template>
  <div class="waste-report-page">
    <div class="card">
      <div class="header">
        <i class="fa-solid fa-file-invoice"></i>
        <h2>废料上报录入</h2>
      </div>
      
      <div class="form-container">
        <div class="form-item">
          <label>订单号</label>
          <select v-model="form.productOrderNumber" @change="onOrderChange">
            <option value="">-- 请选择订单号 --</option>
            <option v-for="item in orderOptions" :key="item" :value="item">{{ item }}</option>
          </select>
        </div>

        <div class="form-item">
          <label>图号</label>
          <select v-model="form.figure" @change="onFigureChange" :disabled="!form.productOrderNumber">
            <option value="">-- 请选择图号 --</option>
            <option v-for="item in figureOptions" :key="item" :value="item">{{ item }}</option>
          </select>
        </div>

        <div class="form-group-row">
          <div class="form-item">
            <label>计划数量</label>
            <input type="number" v-model="form.planQuantity" placeholder="自动带出" readonly class="readonly-input" />
          </div>
          <div class="form-item">
            <label>订单时间</label>
            <input type="text" v-model="form.orderProdTime" placeholder="自动带出" readonly class="readonly-input" />
          </div>
        </div>

        <div class="form-item">
          <label>单件原料重量 (singleMaterialWt)</label>
          <input type="text" v-model="form.singleMaterialWt" placeholder="请输入重量" />
        </div>

        <div class="form-item">
          <label>单件成品重量 (singleProductWt)</label>
          <input type="text" v-model="form.singleProductWt" placeholder="请输入重量" />
        </div>

        <button class="submit-btn" @click="handleSubmit" :disabled="submitting">
          <i v-if="submitting" class="fa-solid fa-spinner fa-spin"></i>
          {{ submitting ? ' 正在保存...' : '点我录入' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import request from '@/utils/request';

export default {
  name: 'WasteMaterial',
  data() {
    return {
      submitting: false,
      orderOptions: [],
      figureOptions: [],
      form: {
        productOrderNumber: '',
        figure: '',
        planQuantity: '',
        orderProdTime: '',
        singleMaterialWt: '',
        singleProductWt: ''
      }
    };
  },
  mounted() {
    this.fetchOrders();
  },
  methods: {
    async fetchOrders() {
      try {
        const res = await request.get('/wasteMaterial/listOrders');
        // 因为 request.js 做了 res.data 的解包，所以这里 res 直接就是数组了
        this.orderOptions = res || [];
      } catch (err) {
        console.error('获取订单失败', err);
      }
    },
    
    async onOrderChange() {
      this.form.figure = '';
      this.form.planQuantity = '';
      this.form.orderProdTime = '';
      this.figureOptions = [];
      if (!this.form.productOrderNumber) return;
      
      try {
        const res = await request.get('/wasteMaterial/getFigures', {
          params: { productOrderNumber: this.form.productOrderNumber }
        });
        this.figureOptions = res || [];
      } catch (err) {}
    },

    async onFigureChange() {
      if (!this.form.figure) return;
      try {
        // 使用您提供的正确接口路径
        const res = await request.get('/wasteMaterial/getOrderProdTimePlanTime', {
          params: { 
            productOrderNumber: this.form.productOrderNumber,
            figure: this.form.figure
          }
        });
        // 这里的 res 直接就是 { figure: '...', orderProdTime: '...', planQuantity: 100 }
        if (res) {
          this.form.planQuantity = res.planQuantity;
          this.form.orderProdTime = res.orderProdTime;
        }
      } catch (err) {}
    },

    async handleSubmit() {
      if (!this.form.productOrderNumber || !this.form.figure) {
        return alert('请先选择订单和图号');
      }
      this.submitting = true;
      try {
        await request.post('/wasteMaterial/saveWasteMaterial', {
          ...this.form,
          planQuantity: Number(this.form.planQuantity)
        });
        alert('数据保存成功！');
      } catch (err) {
        console.error('提交失败', err);
      } finally {
        this.submitting = false;
      }
    }
  }
};
</script>

<style scoped>
.waste-report-page { padding: 40px 20px; display: flex; justify-content: center; background: #f0f2f5; min-height: 100vh; }
.card { background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); width: 100%; max-width: 550px; border-top: 4px solid #409eff; }
.header { display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 30px; color: #303133; }
.header h2 { margin: 0; font-size: 22px; }
.header i { font-size: 24px; color: #409eff; }
.form-container { display: flex; flex-direction: column; gap: 20px; }
.form-item { display: flex; flex-direction: column; gap: 8px; }
.form-group-row { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
label { font-size: 14px; color: #606266; font-weight: 600; }
select, input { padding: 12px; border: 1px solid #dcdfe6; border-radius: 6px; font-size: 14px; transition: all 0.2s; outline: none; background: #fff; }
select:focus, input:focus { border-color: #409eff; box-shadow: 0 0 0 2px rgba(64,158,255,0.1); }
.readonly-input { background-color: #f5f7fa; color: #909399; cursor: not-allowed; }
.submit-btn { margin-top: 15px; padding: 14px; background: #409eff; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 16px; transition: all 0.3s; }
.submit-btn:hover { background: #66b1ff; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(64,158,255,0.3); }
.submit-btn:active { transform: translateY(0); }
.submit-btn:disabled { background: #a0cfff; cursor: not-allowed; transform: none; box-shadow: none; }
</style>