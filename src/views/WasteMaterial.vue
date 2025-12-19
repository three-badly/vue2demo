<template>
  <div class="waste-report-page">
    <div class="card">
      <div class="header">
        <i class="fa-solid fa-file-invoice"></i>
        <h2>废料上报录入</h2>
      </div>
      
      <div class="form-container">
        <!-- 订单号搜索 -->
        <div class="form-item">
          <label>订单号</label>
          <div class="custom-select-wrapper" :class="{ 
            'is-locked': form.productOrderNumber,
            'is-invalid': orderSearch && !form.productOrderNumber 
          }">
            <input 
              ref="orderInput"
              type="text" 
              v-model="orderSearch" 
              placeholder="搜索订单号 (如 SD)..."
              class="order-input"
              @focus="showOrderList = true"
              @blur="showOrderList = false"
            />
            
            <!-- 清空按钮：仅在有内容时显示 -->
            <i v-if="orderSearch" 
               class="fa-solid fa-circle-xmark clear-btn" 
               @mousedown.prevent="clearOrder">×</i>

            <!-- 状态图标 -->
            <i v-if="form.productOrderNumber" class="fa-solid fa-circle-check lock-icon"></i>
            <i v-if="orderSearch && !form.productOrderNumber" class="fa-solid fa-circle-exclamation error-icon"></i>
            
            <ul class="dropdown-list" v-if="showOrderList && filteredOrders.length">
              <li v-for="item in filteredOrders" :key="item" @mousedown="selectOrder(item)">
                {{ item }}
              </li>
            </ul>
          </div>
        </div>

        <!-- 图号搜索 -->
        <div class="form-item">
          <label>图号</label>
          <div class="custom-select-wrapper" :class="{ 
            'is-locked': form.figure,
            'is-invalid': figureSearch && !form.figure 
          }">
            <input 
              type="text" 
              v-model="figureSearch" 
              placeholder="请先选定订单号"
              :disabled="!form.productOrderNumber"
              @focus="showFigureList = true"
              @blur="showFigureList = false"
            />
            <i v-if="form.figure" class="fa-solid fa-circle-check lock-icon"></i>
            <i v-if="figureSearch && !form.figure" class="fa-solid fa-circle-exclamation error-icon"></i>

            <ul class="dropdown-list" v-if="showFigureList && filteredFigures.length">
              <li v-for="item in filteredFigures" :key="item" @mousedown="selectFigure(item)">
                {{ item }}
              </li>
            </ul>
          </div>
        </div>

        <!-- 自动带出区域 -->
        <div class="form-group-row">
          <div class="form-item">
            <label>计划数量</label>
            <input type="text" v-model="form.planQuantity" placeholder="自动带出" readonly class="readonly-input" />
          </div>
          <div class="form-item">
            <label>订单时间</label>
            <input type="text" v-model="form.orderProdTime" placeholder="自动带出" readonly class="readonly-input" />
          </div>
        </div>

        <div class="form-item">
          <label>单件原料重量</label>
          <input type="text" v-model="form.singleMaterialWt" placeholder="请输入重量" />
        </div>

        <div class="form-item">
          <label>单件成品重量</label>
          <input type="text" v-model="form.singleProductWt" placeholder="请输入重量" />
        </div>

        <button class="submit-btn" @click="handleSubmit" :disabled="submitting || !form.productOrderNumber || !form.figure">
          <i v-if="submitting" class="fa-solid fa-spinner fa-spin"></i>
          {{ submitting ? ' 正在保存...' : '确认录入' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import request from '@/utils/request';

export default {
  data() {
    return {
      submitting: false,
      orderOptions: [],
      figureOptions: [],
      orderSearch: '',
      figureSearch: '',
      showOrderList: false,
      showFigureList: false,
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
  watch: {
    orderSearch(val) {
      if (val !== this.form.productOrderNumber) {
        this.resetSelection();
      }
    },
    figureSearch(val) {
      if (val !== this.form.figure) {
        this.form.figure = '';
        this.form.planQuantity = '';
        this.form.orderProdTime = '';
      }
    }
  },
  computed: {
    filteredOrders() {
      const s = this.orderSearch.toLowerCase();
      if (!s) return this.orderOptions;
      return this.orderOptions.filter(item => item.toLowerCase().includes(s));
    },
    filteredFigures() {
      const s = this.figureSearch.toLowerCase();
      if (!s) return this.figureOptions;
      return this.figureOptions.filter(item => item.toLowerCase().includes(s));
    }
  },
  mounted() {
    this.fetchOrders();
  },
  methods: {
    // 清空订单号
    clearOrder() {
      this.orderSearch = '';
      this.resetSelection();
      this.$nextTick(() => {
        this.$refs.orderInput.focus();
      });
    },

    resetSelection() {
      this.form.productOrderNumber = ''; 
      this.figureOptions = [];
      this.form.figure = '';
      this.figureSearch = '';
      this.form.planQuantity = '';
      this.form.orderProdTime = '';
    },

    async fetchOrders() {
      try {
        const res = await request.get('/wasteMaterial/listOrders');
        this.orderOptions = res || [];
      } catch (err) {}
    },
    
    selectOrder(val) {
      this.orderSearch = val;
      this.form.productOrderNumber = val; 
      this.showOrderList = false;
      this.onOrderChange();
    },

    async onOrderChange() {
      try {
        const res = await request.get('/wasteMaterial/getFigures', {
          params: { productOrderNumber: this.form.productOrderNumber }
        });
        this.figureOptions = res || [];
      } catch (err) {}
    },

    selectFigure(val) {
      this.figureSearch = val;
      this.form.figure = val; 
      this.showFigureList = false;
      this.onFigureChange();
    },

    async onFigureChange() {
      try {
        const res = await request.get('/wasteMaterial/getOrderProdTimePlanTime', {
          params: { 
            productOrderNumber: this.form.productOrderNumber,
            figure: this.form.figure
          }
        });
        if (res) {
          this.form.planQuantity = res.planQuantity;
          this.form.orderProdTime = res.orderProdTime;
        }
      } catch (err) {}
    },

    async handleSubmit() {
      if (!this.form.productOrderNumber || !this.form.figure) {
        return alert('请从下拉列表中选择有效的订单和图号');
      }
      this.submitting = true;
      try {
        await request.post('/wasteMaterial/saveWasteMaterial', {
          ...this.form,
          planQuantity: Number(this.form.planQuantity),
          singleMaterialWt: Number(this.form.singleMaterialWt),
          singleProductWt: Number(this.form.singleProductWt)
        });
        alert('数据上报成功！');
      } catch (err) {
        alert('提交失败');
      } finally {
        this.submitting = false;
      }
    }
  }
};
</script>

<style scoped>
.waste-report-page { padding: 40px 20px; display: flex; justify-content: center; background: #f8fafc; min-height: 100vh; }
.card { background: white; padding: 40px; border-radius: 20px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); width: 100%; max-width: 500px; border-top: 6px solid #4f46e5; }
.header { text-align: center; margin-bottom: 35px; }
.header i { font-size: 32px; color: #4f46e5; margin-bottom: 10px; }
.header h2 { font-size: 24px; font-weight: 800; color: #1e293b; }

.form-container { display: flex; flex-direction: column; gap: 24px; }
.form-item { display: flex; flex-direction: column; gap: 8px; }
label { font-size: 13px; font-weight: 700; color: #64748b; text-transform: uppercase; }

.custom-select-wrapper { position: relative; }

/* 调整 Input 右侧间距，预留出两个图标的位置 */
.order-input { padding-right: 65px !important; }

/* 状态图标定位 */
.lock-icon, .error-icon { position: absolute; right: 12px; top: 14px; font-size: 16px; z-index: 5; }
.lock-icon { color: #10b981; }
.error-icon { color: #ef4444; }

/* 清空图标定位 */
.clear-btn { 
  position: absolute; right: 38px; top: 14px; 
  color: #94a3b8; font-size: 16px; cursor: pointer; 
  transition: all 0.2s; z-index: 10; 
}
.clear-btn:hover { color: #4f46e5; transform: scale(1.1); }

input { 
  width: 100%; padding: 12px 16px; border: 2px solid #e2e8f0; border-radius: 12px; 
  font-size: 14px; transition: all 0.2s; outline: none; box-sizing: border-box;
}

.is-locked input { border-color: #10b981; background: #f0fdf4; }
.is-locked input:focus { border-color: #10b981; box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1); }
.is-invalid input { border-color: #ef4444; background: #fef2f2; }
.is-invalid input:focus { border-color: #ef4444; box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.1); }
input:focus { border-color: #4f46e5; box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1); }

.readonly-input { background-color: #f1f5f9; color: #64748b; border-style: dashed; }

.dropdown-list {
  position: absolute; top: calc(100% + 5px); left: 0; right: 0;
  background: white; border: 1px solid #e2e8f0; border-radius: 12px;
  max-height: 220px; overflow-y: auto; z-index: 999;
  box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); padding: 6px; margin: 0; list-style: none;
}
.dropdown-list li { padding: 10px 14px; cursor: pointer; font-size: 14px; border-radius: 8px; }
.dropdown-list li:hover { background-color: #f1f5f9; color: #4f46e5; font-weight: 600; }

.form-group-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }

.submit-btn {
  margin-top: 10px; padding: 16px; background: #4338ca; color: white; border: none; 
  border-radius: 12px; cursor: pointer; font-weight: 700; font-size: 16px; transition: all 0.2s;
}
.submit-btn:hover:not(:disabled) { background: #4338ca; transform: translateY(-2px); box-shadow: 0 8px 20px rgba(79, 70, 229, 0.3); }
.submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }
</style>