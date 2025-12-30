import Vue from 'vue'
import Router from 'vue-router'
import WasteMaterial from '../views/WasteMaterial.vue'
import WasteMaterialList from '../views/WasteMaterialList.vue'
import Login from '../views/Login.vue'
import UserList from '../views/UserList.vue'

Vue.use(Router)

const routes = [{
        path: '/login',
        name: 'Login',
        component: Login,
        meta: { requiresAuth: false }
    },
    {
        path: '/user-list',
        name: 'UserList',
        component: UserList,
        meta: { requiresAuth: true }
    },
    {
        // 废料上报页面的路由配置
        path: '/WasteMaterial',
        name: 'WasteMaterial',
        component: WasteMaterial,
        meta: { requiresAuth: true }
    },
    {
        path: '/WasteMaterialList',
        name: 'WasteMaterialList',
        component: WasteMaterialList,
        meta: { requiresAuth: true }
    },
    {
        path: '/',
        redirect: '/login'
    }
]

const router = new Router({
    mode: 'history',
    routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('access_token');

    if (to.matched.some(record => record.meta.requiresAuth)) {
        // 需要认证的页面
        if (!token) {
            // 没有token，跳转到登录页
            next('/login');
        } else {
            // 有token，允许访问
            next();
        }
    } else {
        // 不需要认证的页面（如登录页）
        if (token && to.path === '/login') {
            // 如果已登录且访问登录页，跳转到用户列表页
            next('/user-list');
        } else {
            next();
        }
    }
});

export default router;