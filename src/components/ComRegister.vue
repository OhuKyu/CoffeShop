<template>
  <div class="register-container">
    <div class="register-box">
      <div class="register-header">
        <h2>Đăng Ký Tài Khoản</h2>
        <p>Tạo tài khoản để trải nghiệm dịch vụ tốt nhất!</p>
      </div>
      <form @submit.prevent="handleRegister" class="register-form">
        <div class="form-group">
          <label for="fullname">
            <i class="fas fa-user-circle"></i>
            Họ và tên
          </label>
          <input
            id="fullname"
            v-model="fullname"
            type="text"
            placeholder="Nhập họ và tên"
            required
            :class="{ 'error': errors.fullname }"
          />
          <span v-if="errors.fullname" class="error-message">
            {{ errors.fullname }}
          </span>
        </div>
        <div class="form-group">
          <label for="username">
            <i class="fas fa-user"></i>
            Tên đăng nhập
          </label>
          <input
            id="username"
            v-model="username"
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
            v-model="password"
            type="password"
            placeholder="Nhập mật khẩu"
            required
            :class="{ 'error': error }"
          />
        </div>
        <div class="form-group">
          <label for="confirmPassword">
            <i class="fas fa-lock"></i>
            Xác nhận mật khẩu
          </label>
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            placeholder="Nhập lại mật khẩu"
            required
            :class="{ 'error': error }"
          />
        </div>
        <p v-if="error" class="error-message">
          <i class="fas fa-exclamation-circle"></i>
          {{ error }}
        </p>
        <button type="submit" class="register-button">
          <i class="fas fa-user-plus"></i>
          Đăng ký
        </button>
      </form>
      <div class="register-footer">
        <p>Đã có tài khoản? 
          <router-link to="/login">Đăng nhập ngay</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import users from '@/data/users'
import { mapActions } from 'vuex'

export default {
  data() {
    return {
      fullname: "",
      username: "",
      password: "",
      confirmPassword: "",
      error: "",
      errors: {
        fullname: ""
      },
      users
    };
  },
  methods: {
    ...mapActions('auth', ['register']),
    
    async handleRegister() {
      try {
        if (!this.validateForm()) return
        
        await this.register({
          fullname: this.fullname,
          username: this.username,
          password: this.password
        })
        
        this.resetForm()
        this.redirectToLogin()
      } catch (error) {
        this.error = error
      }
    },

    validateForm() {
      const validations = {
        fullname: this.validateFullname(),
        fields: Boolean(this.username && this.password && this.confirmPassword),
        password: this.password === this.confirmPassword,
        username: !this.users.find(x => x.username === this.username)
      }

      const errors = {
        fields: 'Vui lòng điền đầy đủ thông tin',
        password: 'Mật khẩu xác nhận không khớp', 
        username: 'Tên đăng nhập đã tồn tại'
      }

      const error = Object.keys(errors).find(key => !validations[key])

      if (error) {
        this.error = errors[error]
        return false
      }

      return true
    },
    validateFullname() {
      const validations = {
        empty: !this.fullname,
        tooShort: this.fullname.length < 3
      }

      const errors = {
        empty: 'Vui lòng nhập họ và tên',
        tooShort: 'Họ và tên phải có ít nhất 3 ký tự'
      }

      const error = Object.keys(validations).find(key => validations[key])
      this.errors.fullname = error ? errors[error] : ''
      
      return !error
    },
    resetForm() {
      Object.assign(this, {
        fullname: '',
        username: '',
        password: '',
        confirmPassword: '',
        error: '',
        errors: { fullname: '' }
      })
    },
    redirectToLogin() {
      alert('Đăng ký thành công!')
      this.$router.push('/login')
    }
  }
};
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8e8e8 100%);
  padding: 20px;
}

.register-box {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 400px;
}

.register-header {
  text-align: center;
  margin-bottom: 30px;
}

.register-header h2 {
  color: #8B4513;
  font-size: 2em;
  margin-bottom: 10px;
}

.register-header p {
  color: #666;
  font-size: 1.1em;
}

.register-form {
  margin-bottom: 20px;
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

.register-button {
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

.register-button:hover {
  background: #693410;
  transform: translateY(-1px);
}

.register-footer {
  text-align: center;
  color: #666;
}

.register-footer a {
  color: #8B4513;
  text-decoration: none;
  font-weight: 500;
}

.register-footer a:hover {
  text-decoration: underline;
}

@media (max-width: 480px) {
  .register-box {
    padding: 30px 20px;
  }
}
</style>