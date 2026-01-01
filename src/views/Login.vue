<template>
  <div class="login-container">
    <div class="login-form">
      <h2>RFID管理系统登录</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-item">
          <label for="account">账号</label>
          <input
            id="account"
            v-model="loginForm.account"
            type="text"
            placeholder="请输入账号"
            required
          />
        </div>
        <div class="form-item">
          <label for="password">密码</label>
          <input
            id="password"
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            required
          />
        </div>
        <button type="submit" :disabled="loading" class="login-btn">
          {{ loading ? '登录中...' : '登录' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import request from '@/utils/request';
import md5 from 'md5';
export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        account: '',
        password: ''
      },
      loading: false
    };
  },
  methods: {
    async handleLogin() {
      if (!this.loginForm.account || !this.loginForm.password) {
        this.$message.error('账号和密码不能为空');
        return;
      }

      // password = 917ed1da3a21636d0cb29cf7b81235ca root123
      this.loading = true;
      try {
        // 创建一个临时对象，对密码进行MD5加密
        const loginData = {
          account: this.loginForm.account,
          password: md5(this.loginForm.password) // 对密码进行MD5加密
        };
        const response = await request({
          url: '/user/login',
          method: 'post',
          data: loginData
        });

        // 登录成功，保存token
        const { token } = response; // 根据实际返回的数据结构调整
        // localStorage.setItem('access_token', token);
        this.$store.dispatch('login', token)             // ✅ 用 action

        // 跳转到用户列表页面
        this.$router.push('/user-list');
        this.$message.success('登录成功');
      } catch (error) {
        console.error('Login error:', error);
        this.$message.error(error.message || '登录失败');
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
}

.login-form {
  width: 400px;
  padding: 40px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.login-form h2 {
  text-align: center;
  margin-bottom: 30px;
}

.form-item {
  margin-bottom: 20px;
}

.form-item label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-item input {
  width: 100%;
  padding: 10px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  box-sizing: border-box;
}

.login-btn {
  width: 100%;
  padding: 12px;
  background-color: #409eff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.login-btn:hover:not(:disabled) {
  background-color: #66b1ff;
}
</style>