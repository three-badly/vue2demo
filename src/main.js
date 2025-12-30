// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

// 引入 Element UI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// 引入 request 工具并挂载到 Vue 原型
import request from '@/utils/request'
Vue.prototype.$http = request
Vue.prototype.$message = ElementUI.Message // 挂载 Message 组件

Vue.config.productionTip = false

// 使用 Element UI
Vue.use(ElementUI)

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>'
})