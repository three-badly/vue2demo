import axios from 'axios';
import store from '@/store'

// 1. 创建实例 - 使用代理路径
const service = axios.create({
    // baseURL: '/api', // 使用代理路径
    baseURL: 'http://172.16.0.139:8084', // 后端地址
    timeout: 10000
});

// 2. 不需要携带 token 的接口列表
const WHITE_LIST = ['/login', '/register', '/captcha']; // 根据实际接口调整

// 3. 请求拦截器：统一加 token
service.interceptors.request.use(
    config => {
        // 白名单直接放行 - 需要调整路径匹配逻辑
        const originalUrl = config.url;
        // // 从URL中提取路径部分，去掉代理前缀
        // let urlWithoutPrefix = originalUrl;
        // if (originalUrl.startsWith('/api')) {
        //     urlWithoutPrefix = originalUrl.replace('/api', '');
        // }
        const isWhite = WHITE_LIST.some(path => originalUrl.startsWith(path));

        if (isWhite) return config;
        // 非白名单就塞 token
        // const token = localStorage.getItem('access_token'); // 也可以换成 cookie
        //vuex拿token
        const token = store.getters.token
        if (token) {
            // 后端要求的 header 名，常见两种写法：
            config.headers['Authorization'] = `Bearer ${token}`; // 写法 1

        }
        return config;
    },
    error => {
        console.error('Request Error:', error);
        return Promise.reject(error);
    }
);

// 4. 响应拦截器：统一处理数据结构
service.interceptors.response.use(
    response => {
        const res = response.data;
        if (res.code === 0 || res.code === 200) {
            return res.data; // 业务层只关心真正的数据
        } else {
            // 业务错误
            alert(res.message || '业务请求失败');
            return Promise.reject(new Error(res.message || 'Error'));
        }
    },
    error => {
        // HTTP 状态码异常
        if (error.response && error.response.status === 401) {
            // token 失效，跳回登录页
            store.dispatch('logout') // 统一动作
            location.href = '/login';
        } else {
            alert('网络请求失败：' + error.message);
        }
        return Promise.reject(error);
    }
);

export default service;