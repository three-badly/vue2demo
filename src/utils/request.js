import axios from 'axios';

// 创建 axios 实例
const service = axios.create({
    baseURL: 'http://172.16.0.139:38104', // 后端地址
    timeout: 10000 // 请求超时时间
});

// 请求拦截器
service.interceptors.request.use(
    config => {
        // 可以在这里添加 Token 等 Header
        return config;
    },
    error => {
        console.error('Request Error:', error);
        return Promise.reject(error);
    }
);

// 响应拦截器：统一处理数据结构
service.interceptors.response.use(
    response => {
        const res = response.data;
        // 如果 code 为 0，说明成功，直接返回 data 部分
        if (res.code === 0) {
            return res.data;
        } else {
            // 如果 code 不为 0，弹出错误信息
            alert(res.message || '业务请求失败');
            return Promise.reject(new Error(res.message || 'Error'));
        }
    },
    error => {
        alert('网络请求失败：' + error.message);
        return Promise.reject(error);
    }
);

export default service;