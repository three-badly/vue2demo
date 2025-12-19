import Vue from 'vue'
import Router from 'vue-router'
import WasteMaterial from '../views/WasteMaterial.vue'
import WasteMaterialList from '../views/WasteMaterialList.vue'

Vue.use(Router)

export default new Router({
    routes: [{
        // 2. 添加废料上报页面的路由配置
        path: '/WasteMaterial',
        name: 'WasteMaterial',
        component: WasteMaterial
    }, {
        path: '/WasteMaterialList',
        name: 'WasteMaterialList',
        component: WasteMaterialList
    }]
})