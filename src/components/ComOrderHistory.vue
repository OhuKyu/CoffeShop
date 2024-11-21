<template>
  <div class="order-history-container">
    <div class="order-history-header">
      <h1>
        <i class="fas fa-history"></i>
        Lịch sử đơn hàng
      </h1>
    </div>
    <div v-if="userOrders.length === 0" class="empty-history">
      <i class="fas fa-shopping-bag empty-icon"></i>
      <p>Chưa có lịch sử đơn hàng</p>
      <router-link to="/thucdon" class="shop-now-btn">
        <i class="fas fa-coffee"></i>
        Mua sắm ngay
      </router-link>
    </div>
    <div v-else class="orders-grid">
      <div v-for="order in sortedOrders" :key="order.id" class="order-card">
        <div class="order-status" :class="order.status || 'completed'">
          {{ getStatusText(order.status) }}
        </div>
        <div class="order-header">
          <div class="order-id">
            <i class="fas fa-receipt"></i>
            Đơn hàng #{{ order.id }}
          </div>
          <div class="order-date">
            <i class="far fa-calendar-alt"></i>
            {{ formatDate(order.date) }}
          </div>
        </div>
        <div class="order-items">
          <div v-for="item in order.items" :key="item.id" class="order-item">
            <img :src="item.image" :alt="item.name" class="item-image">
            <div class="item-details">
              <h3>{{ item.name }}</h3>
              <div class="item-meta">
                <span class="quantity">
                  <i class="fas fa-times"></i>
                  {{ item.quantity }}
                </span>
                <span v-if="item.selectedSize" class="size">
                  <i class="fas fa-ruler"></i>
                  Size {{ item.selectedSize }}
                </span>
              </div>
            </div>
            <div class="item-price">
              {{ formatPrice(calculateItemTotal(item)) }}
            </div>
          </div>
        </div>
        <div class="order-footer">
          <div class="total-amount">
            <span>Tổng tiền:</span>
            <span class="amount">{{ formatPrice(order.total) }}</span>
          </div>
          <button class="reorder-btn" @click="handleReorder(order)" :disabled="isReordering">
            <i class="fas fa-redo"></i>
            {{ isReordering ? 'Đang xử lý...' : 'Đặt lại' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import orderHistory from '../data/orderHistory'
import carts from '../data/cart'
import items from '../data/items'
import Swal from 'sweetalert2'

export default {
  data() {
    return {
      currentUser: null,
      orderHistory: orderHistory,
      isReordering: false
    }
  },
  computed: {
    userOrders() {
      if (!this.currentUser) return []
      return this.orderHistory[this.currentUser.username] || []
    },
    sortedOrders() {
      return [...this.userOrders].sort((a, b) => new Date(b.date) - new Date(a.date))
    }
  },
  created() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'))
    if (!this.currentUser) {
      this.$router.push('/login')
    }
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleDateString('vi-VN')
    },
    formatPrice(price) {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(price)
    },
    calculateItemTotal(item) {
      const basePrice = item.price * 1000
      const sizePrice = item.selectedSize ?
        (item.sizes.find(s => s.label === item.selectedSize)?.price || 0) * 1000 : 0
      return (basePrice + sizePrice) * item.quantity
    },
    getStatusText(status) {
      const statusMap = {
        'pending': 'Đang xử lý',
        'completed': 'Hoàn thành',
        'cancelled': 'Đã hủy'
      }
      return statusMap[status] || 'Hoàn thành'
    },
    async handleReorder(order) {
      try {
        this.isReordering = true
        
        const unavailableItems = order.items.filter(item => {
          const product = items.find(p => p.id === item.id)
          return !product || product.quality < item.quantity
        })

        if (unavailableItems.length > 0) {
          Swal.fire({
            icon: 'error',
            title: 'Không thể đặt lại',
            text: 'Một số sản phẩm đã hết hàng hoặc không đủ số lượng',
            confirmButtonText: 'Đóng'
          })
          return
        }

        if (!carts[this.currentUser.username]) {
          carts[this.currentUser.username] = []
        }

        order.items.forEach(item => {
          const product = items.find(p => p.id === item.id)
          if (product) {
            product.quality -= item.quantity
            carts[this.currentUser.username].push({
              ...item,
              price: product.price 
            })
          }
        })

        Swal.fire({
          icon: 'success',
          title: 'Đã thêm vào giỏ hàng',
          text: 'Bạn có muốn đến trang giỏ hàng?',
          showCancelButton: true,
          confirmButtonText: 'Đến giỏ hàng',
          cancelButtonText: 'Tiếp tục mua sắm'
        }).then((result) => {
          if (result.isConfirmed) {
            this.$router.push('/cart')
          }
        })
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Có lỗi xảy ra',
          text: 'Vui lòng thử lại sau',
          confirmButtonText: 'Đóng'
        })
      } finally {
        this.isReordering = false
      }
    }
  }
}
</script>

<style scoped>
.order-history-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.order-history-header {
  margin-bottom: 40px;
  text-align: center;
}

.order-history-header h1 {
  color: #8B4513;
  font-size: 2.5em;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
}

.empty-history {
  text-align: center;
  padding: 60px 20px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.empty-icon {
  font-size: 4em;
  color: #8B4513;
  margin-bottom: 20px;
}

.empty-history p {
  color: #666;
  font-size: 1.2em;
  margin-bottom: 30px;
}

.shop-now-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 25px;
  background: #8B4513;
  color: white;
  border-radius: 25px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
}

.shop-now-btn:hover {
  background: #693410;
  transform: translateY(-2px);
}

.orders-grid {
  display: grid;
  gap: 30px;
}

.order-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.order-card:hover {
  transform: translateY(-5px);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: #f8f9fa;
  border-bottom: 1px solid #eee;
}

.order-id, .order-date {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #8B4513;
  font-weight: 500;
}

.order-items {
  padding: 20px;
}

.order-item {
  display: flex;
  gap: 15px;
  padding: 15px;
  border-bottom: 1px solid #eee;
}

.item-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
}

.item-details {
  flex: 1;
}

.item-details h3 {
  margin: 0 0 10px;
  color: #333;
}

.item-meta {
  display: flex;
  gap: 20px;
  color: #666;
  font-size: 0.9em;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: #f8f9fa;
  border-top: 1px solid #eee;
}

.total-amount {
  font-size: 1.1em;
}

.amount {
  color: #8B4513;
  font-weight: bold;
  margin-left: 10px;
}

.reorder-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #8B4513;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.reorder-btn:hover {
  background: #693410;
}

@media (max-width: 768px) {
  .order-history-container {
    padding: 20px 10px;
  }
  
  .order-header {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }
  
  .item-meta {
    flex-direction: column;
    gap: 5px;
  }
  
  .order-footer {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
}
</style>