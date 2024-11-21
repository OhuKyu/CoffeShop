<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <h2>Đăng Nhập</h2>
        <p>Chào mừng bạn quay trở lại!</p>
      </div>
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="username">
            <i class="fas fa-user"></i>
            Tên đăng nhập
          </label>
          <input
            id="username"
            v-model="formData.username"
            type="text"
            placeholder="Nhập tên đăng nhập"
            required
            :class="{ 'error': error }"
          />
        </div>
        <div class="form-group">
          <label for="password">
            <i class="fas fa-lock"></i>
            Mật khẩu
          </label>
          <input
            id="password" 
            v-model="formData.password"
            type="password"
            placeholder="Nhập mật khẩu"
            required
            :class="{ 'error': error }"
          />
        </div>
        <p v-if="error" class="error-message">
          <i class="fas fa-exclamation-circle"></i>
          {{ error }}
        </p>
        <button type="submit" class="login-button">
          <i class="fas fa-sign-in-alt"></i>
          Đăng nhập
        </button>
      </form>
      <div class="login-footer">
        <p>Chưa có tài khoản? 
          <router-link to="/register">Đăng ký ngay</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginView',
  
  data() {
    return {
      formData: {
        username: '',
        password: ''
      },
      error: ''
    }
  },

  methods: {
    async handleLogin() {
      try {
        this.error = ''
        
        if (!this.formData.username || !this.formData.password) {
          this.error = 'Vui lòng nhập đầy đủ thông tin'
          return
        }

        await this.$store.dispatch('auth/login', {
          username: this.formData.username,
          password: this.formData.password
        })
        
        this.$router.push('/')
      } catch (error) {
        this.error = error || 'Tên đăng nhập hoặc mật khẩu không chính xác'
      }
    }
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8e8e8 100%);
  padding: 20px;
}

.login-box {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 400px;
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h2 {
  color: #8B4513;
  font-size: 2em;
  margin-bottom: 10px;
}

.login-header p {
  color: #666;
  font-size: 1.1em;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  color: #333;
  font-weight: 500;
}

.form-group label i {
  color: #8B4513;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
}

.form-group input:focus {
  border-color: #8B4513;
  outline: none;
  box-shadow: 0 0 0 3px rgba(139, 69, 19, 0.1);
}

.form-group input.error {
  border-color: #dc3545;
}

.error-message {
  color: #dc3545;
  font-size: 14px;
  margin: 10px 0;
  display: flex;
  align-items: center;
  gap: 6px;
}

.login-button {
  width: 100%;
  padding: 14px;
  background: #8B4513;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.login-button:hover {
  background: #693410;
  transform: translateY(-1px);
}

.login-footer {
  text-align: center;
  margin-top: 20px;
  color: #666;
}

.login-footer a {
  color: #8B4513;
  text-decoration: none;
  font-weight: 500;
}

.login-footer a:hover {
  text-decoration: underline;
}
</style>