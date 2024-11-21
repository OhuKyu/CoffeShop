<template>
  <div class="payment-container">
    <div class="payment-content">
      <h1 class="payment-title">
        <i class="fas fa-credit-card"></i>
        Thanh Toán
      </h1>
      <div class="order-summary">
        <div class="section-header">
          <h2><i class="fas fa-shopping-cart"></i> Đơn hàng của bạn</h2>
          <span class="items-count">{{ cart.length }} sản phẩm</span>
        </div>
        <div class="order-items">
          <div v-for="item in cart" :key="item.id" class="order-item">
            <img :src="item.image" :alt="item.name" class="item-image">
            <div class="item-details">
              <h3>{{ item.name }}</h3>
              <div class="item-meta">
                <span class="quantity">Số lượng: {{ item.quantity }}</span>
                <span v-if="item.selectedSize" class="size">Size: {{ item.selectedSize }}</span>
              </div>
              <p class="price">{{ formatPrice(calculateItemTotal(item)) }}</p>
            </div>
          </div>
        </div>
        <div class="order-total">
          <div class="subtotal">
            <span>Tạm tính:</span>
            <span>{{ formatPrice(calculateSubtotal) }}</span>
          </div>
          <div class="shipping">
            <span>Phí vận chuyển:</span>
            <span>{{ formatPrice(shippingCost) }}</span>
          </div>
          <div class="total">
            <span>Tổng cộng:</span>
            <span>{{ formatPrice(calculateTotal) }}</span>
          </div>
        </div>
      </div>
      <div class="payment-form">
        <div class="section-header">
          <h2><i class="fas fa-lock"></i> Thông tin thanh toán</h2>
        </div>
        <form @submit.prevent="processPayment">
          <div class="card-element">
            <div class="card-icon">
              <i class="far fa-credit-card"></i>
            </div>
            <div class="form-group">
              <label>Số thẻ</label>
              <input 
                v-model="cardNumber"
                type="text"
                placeholder="1234 5678 9012 3456"
                maxlength="19"
                @input="formatCardNumber"
                required
              >
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Ngày hết hạn</label>
              <input 
                v-model="expiryDate"
                type="text"
                placeholder="MM/YY"
                maxlength="5"
                @input="formatExpiryDate"
                required
              >
            </div>
            <div class="form-group">
              <label>CVV</label>
              <div class="cvv-input">
                <input 
                  v-model="cvv"
                  type="text"
                  placeholder="123"
                  maxlength="3"
                  required
                >
                <i class="fas fa-question-circle" title="Mã bảo mật 3 số ở mặt sau thẻ"></i>
              </div>
            </div>
          </div>
          <div class="form-group">
            <label>Tên chủ thẻ</label>
            <input 
              v-model="cardHolder"
              type="text"
              placeholder="NGUYEN VAN A"
              required
            >
          </div>
          <button type="submit" class="pay-button" :disabled="!isFormValid">
            <i class="fas fa-lock"></i>
            Thanh toán {{ formatPrice(calculateTotal) }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2'
import carts from '../data/cart'
import orderHistory from '../data/orderHistory'

export default {
  data() {
    return {
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardHolder: '',
      shippingCost: 30000,
      currentUser: null,
      cart: []
    }
  },
  computed: {
    calculateSubtotal() {
      return this.cart.reduce((total, item) => {
        return total + this.calculateItemTotal(item)
      }, 0)
    },
    calculateTotal() {
      return this.calculateSubtotal + this.shippingCost
    },
    isFormValid() {
      return this.cardNumber.length === 19 &&
        this.expiryDate.length === 5 &&
        this.cvv.length === 3 &&
        this.cardHolder.length > 0
    }
  },
  created() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'))
    if (!this.currentUser) {
      this.$router.push('/login')
    } else {
      this.cart = carts[this.currentUser.username] || []
      if (this.cart.length === 0) {
        this.$router.push('/cart')
      }
    }
  },
  methods: {
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
    formatCardNumber(e) {
      let value = e.target.value.replace(/\D/g, '')
      value = value.replace(/(\d{4})/g, '$1 ').trim()
      this.cardNumber = value
    },
    formatExpiryDate(e) {
      let value = e.target.value.replace(/\D/g, '')
      if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2)
      }
      this.expiryDate = value
    },
    processPayment() {
      Swal.fire({
        title: 'Đang xử lý...',
        text: 'Vui lòng chờ trong giây lát',
        allowOutsideClick: false,
        showConfirmButton: false,
        willOpen: () => {
          Swal.showLoading()
        }
      })

      setTimeout(() => {
        if (this.currentUser) {
          const newOrder = {
            id: Date.now(),
            date: new Date().toISOString(),
            items: [...this.cart],
            total: this.calculateTotal,
          }

          if (!orderHistory[this.currentUser.username]) {
            orderHistory[this.currentUser.username] = []
          }

          orderHistory[this.currentUser.username].push(newOrder)

          carts[this.currentUser.username] = []
        }

        Swal.fire({
          icon: 'success',
          title: 'Thanh toán thành công!',
          text: 'Cảm ơn bạn đã mua hàng',
          confirmButtonText: 'OK'
        }).then(() => {
          this.$router.push('/orders')
        })
      }, 3000)
    }
  }
}
</script>

<style scoped>
.payment-container {
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 20px;
}

.payment-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 30px;
}

.payment-title {
  grid-column: 1 / -1;
  color: #2c3e50;
  font-size: 2em;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 2px solid #eee;
}

.payment-title i {
  margin-right: 10px;
  color: #8B4513;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h2 {
  font-size: 1.5em;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 10px;
}

.section-header i {
  color: #8B4513;
}

.items-count {
  background: #f8f9fa;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 0.9em;
  color: #666;
}

.order-items {
  max-height: 400px;
  overflow-y: auto;
  padding-right: 10px;
}

.order-item {
  display: flex;
  gap: 15px;
  padding: 15px;
  border-bottom: 1px solid #eee;
  transition: background-color 0.3s;
}

.order-item:hover {
  background-color: #f8f9fa;
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
  margin: 0 0 8px;
  font-size: 1.1em;
  color: #2c3e50;
}

.item-meta {
  display: flex;
  gap: 15px;
  color: #666;
  font-size: 0.9em;
  margin-bottom: 8px;
}

.price {
  color: #8B4513;
  font-weight: bold;
  font-size: 1.1em;
}

.order-total {
  margin-top: 20px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
}

.order-total > div {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
}

.total {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 2px dashed #ddd;
  font-size: 1.2em;
  font-weight: bold;
  color: #8B4513;
}

.payment-form {
  padding: 25px;
  background: #f8f9fa;
  border-radius: 12px;
  max-width: 500px;
  margin: 0 auto;
}

.card-element {
  position: relative;
  margin-bottom: 25px;
  width: 100%;
}

.card-icon {
  position: absolute;
  right: 15px;
  top: 40px;
  color: #8B4513;
}

.form-group {
  margin-bottom: 20px;
  width: 100%;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  width: 100%;
}

label {
  display: block;
  margin-bottom: 8px;
  color: #2c3e50;
  font-weight: 500;
}

input {
  width: 100%;
  padding: 12px 15px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1em;
  transition: border-color 0.3s;
  box-sizing: border-box;
}

input:focus {
  border-color: #8B4513;
  outline: none;
}

.cvv-input {
  position: relative;
}

.cvv-input i {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
  cursor: help;
}

.pay-button {
  width: 100%;
  padding: 15px;
  background: #8B4513;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1em;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.pay-button:hover {
  background: #693410;
}

.pay-button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .payment-content {
    grid-template-columns: 1fr;
  }
  
  .form-row {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  input {
    font-size: 16px;
  }
}
</style>
