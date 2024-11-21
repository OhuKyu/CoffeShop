<template>
  <header class="header">
    <div class="container">
      <div class="logo">
        <img src="/Images/logo.png" alt="Cafe Logo">
      </div>
      <nav>
        <ul>
          <li><router-link to="/">Trang Chủ</router-link></li>
          <li><router-link to="/thucdon">Thực Đơn</router-link></li>
          <li><router-link to="/gioithieu">Giới Thiệu</router-link></li>
        </ul>
      </nav>
      <div class="user-section">
        <router-link to="/cart" class="cart-button">
          <i class="fas fa-shopping-cart"></i>
          <span v-if="cartCount > 0" class="cart-count">{{ cartCount }}</span>
        </router-link>
        <template v-if="!currentUser">
          <router-link to="/login" class="auth-button">
            <i class="fas fa-sign-in-alt"></i>
            Đăng Nhập
          </router-link>
        </template>
        <div v-else class="user-menu">
          <div class="user-trigger" @click="handleToggleMenu">
            <img :src="currentUser.avatar || '/Images/default-avatar.png'" class="user-avatar" />
            <span class="username">{{ currentUser.username }}</span>
            <i class="fas fa-chevron-down"></i>
          </div>
          <div class="dropdown-menu" v-show="isMenuOpen">
            <router-link to="/profile" class="menu-item">
              <i class="fas fa-user"></i>
              Tài khoản của tôi
            </router-link>
            <router-link to="/orders" class="menu-item">
              <i class="fas fa-shopping-bag"></i>
              Lịch sử thanh toán
            </router-link>
            <div class="divider"></div>
            <button @click="handleLogout" class="menu-item logout">
              <i class="fas fa-sign-out-alt"></i>
              Đăng xuất
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
  <router-view />
</template>

<script setup>
import { computed, watch, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import eventBus from '@/eventBus'
import carts from '../data/cart'

const router = useRouter()
const store = useStore()

const currentUser = computed(() => store.getters['auth/currentUser'])
const isMenuOpen = ref(false)

const cartCount = computed(() => {
  if (!currentUser.value) return 0
  const userCart = carts[currentUser.value.username]
  return userCart ? userCart.reduce((total, item) => total + item.quantity, 0) : 0
})

const handleToggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const handleLogout = () => {
  store.dispatch('auth/logout')
  isMenuOpen.value = false
  router.push('/login')
}

watch(currentUser, (newUser) => {
  if (newUser) {
    if (!carts[newUser.username]) {
      carts[newUser.username] = []
    }
  }
})

eventBus.on('loginSuccess', (userData) => {
  store.dispatch('auth/setCurrentUser', userData)
})

eventBus.on('cartUpdated', () => {
  cartCount.value
})
</script>

<style scoped>
.header {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
  backdrop-filter: blur(10px);
}

.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 50px;
  background: rgba(139, 69, 19, 0.95);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
}

.logo img {
  height: 45px;
  transition: transform 0.3s ease;
}

.logo img:hover {
  transform: scale(1.05);
}

nav ul {
  list-style: none;
  display: flex;
  gap: 30px;
  margin: 0;
  padding: 0;
}

nav ul li {
  position: relative;
}

nav ul li a {
  color: #FFF;
  text-decoration: none;
  font-weight: 500;
  font-size: 16px;
  letter-spacing: 0.5px;
  padding: 8px 0;
  transition: all 0.3s ease;
  position: relative;
}

nav ul li a::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background-color: #fcb034;
  transition: width 0.3s ease;
}

nav ul li a:hover::after {
  width: 100%;
}

nav ul li a:hover {
  color: #fcb034;
}

.cta-button {
  padding: 10px 20px;
  background-color: #fcb034;
  color: #fff;
  text-decoration: none;
  border-radius: 25px;
  font-weight: 500;
  font-size: 16px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(252, 176, 52, 0.3);
  position: relative;
  display: inline-block;
}

.cta-button:hover {
  background-color: #ffa726;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(252, 176, 52, 0.4);
}

.cart-count {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: #fcb034;
  color: white;
  border-radius: 50%;
  padding: 2px 6px;
  font-size: 12px;
  min-width: 18px;
  text-align: center;
}

@media (max-width: 768px) {
  .container {
    padding: 15px 20px;
  }

  nav ul {
    gap: 15px;
  }

  nav ul li a {
    font-size: 14px;
  }

  .logo img {
    height: 35px;
  }
}

.user-section {
  display: flex;
  align-items: center;
  gap: 15px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.welcome-text {
  color: white;
  font-weight: 500;
}

.logout-button {
  padding: 8px 16px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 25px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s ease;
}

.logout-button:hover {
  background-color: #c82333;
  transform: translateY(-1px);
}

.cart-button {
  padding: 10px;
  background-color: transparent;
  color: #fff;
  border-radius: 50%;
  transition: all 0.3s ease;
  position: relative;
}

.cart-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.user-menu {
  position: relative;
}

.user-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  cursor: pointer;
  border-radius: 20px;
  background-color: rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.user-trigger:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #fff;
}

.username {
  color: white;
  font-weight: 500;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  min-width: 200px;
  padding: 8px 0;
  transform-origin: top;
  animation: dropdownFade 0.3s ease;
}

@keyframes dropdownFade {
  from {
    opacity: 0;
    transform: scaleY(0);
  }
  to {
    opacity: 1;
    transform: scaleY(1);
  }
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  color: #333;
  text-decoration: none;
  transition: background-color 0.2s;
}

.menu-item:hover {
  background-color: #f5f5f5;
}

.menu-item i {
  width: 20px;
}

.divider {
  height: 1px;
  background-color: #eee;
  margin: 8px 0;
}

.logout {
  width: 100%;
  text-align: left;
  border: none;
  background: none;
  color: #dc3545;
  cursor: pointer;
}

.logout:hover {
  background-color: #fff1f1;
}

.auth-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: #fcb034;
  color: #fff;
  border-radius: 20px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
}

.auth-button:hover {
  background-color: #e69b26;
  transform: translateY(-1px);
}
</style>
