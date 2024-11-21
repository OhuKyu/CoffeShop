<template>
  <div class="shopping-cart">
    <h1 class="cart-title">GIỎ HÀNG</h1>
    <div v-if="cart.length === 0" class="empty-cart">
      <p>Giỏ hàng chưa có hàng</p>
      <router-link to="/thucdon" class="continue-shopping">
        Tiếp tục mua sắm
      </router-link>
    </div>
    <div v-else class="cart-container">
      <div class="cart-items">
        <div v-for="item in cart" :key="item.id" class="cart-item">
          <div class="item-image">
            <img :src="item.image" :alt="item.name">
          </div>
          <div class="item-details">
            <h2>{{ item.name }}</h2>
            <p class="description">{{ item.description }}</p>
            <p class="type" v-if="item.selectedSize">Size: {{ item.selectedSize }}</p>
            <p class="price">{{ formatPrice(calculateItemTotal(item)) }}</p>
            <div class="quantity-controls">
              <button @click="decreaseQuantity(item)" class="quantity-btn">-</button>
              <span class="quantity">{{ item.quantity }}</span>
              <button @click="increaseQuantity(item)" class="quantity-btn">+</button>
            </div>
            <button @click="removeItem(item)" class="remove-btn">
              <i class="fas fa-trash"></i> Xóa
            </button>
          </div>
        </div>
      </div>
      <div class="cost-estimate">
        <h2>Chi tiết thanh toán</h2>
        <div class="cost-details">
          <div class="cost-row">
            <span>Tạm tính</span>
            <span>{{ formatPrice(calculateSubtotal) }}</span>
          </div>
          <div class="cost-row">
            <span>Phí vận chuyển</span>
            <span>{{ formatPrice(shippingCost) }}</span>
          </div>
          <div class="cost-row">
            <span>Giảm giá</span>
            <span>-{{ formatPrice(discount) }}</span>
          </div>
          <div class="cost-row total">
            <span>Tổng cộng</span>
            <span>{{ formatPrice(calculateTotal) }}</span>
          </div>
        </div>
        <div class="payment-methods">
          <h3>Phương thức thanh toán</h3>
          <div class="payment-option">
            <input type="radio" id="cash" name="payment" value="cash" v-model="selectedPaymentMethod">
            <label for="cash">
              <i class="fas fa-money-bill"></i>
              Tiền mặt
            </label>
          </div>
          <div class="payment-option">
            <input type="radio" id="card" name="payment" value="card" v-model="selectedPaymentMethod">
            <label for="card">
              <i class="fas fa-credit-card"></i>
              Thẻ ngân hàng
            </label>
          </div>
        </div>
        <button @click="checkout" class="checkout-btn">
          <i class="fas fa-shopping-cart"></i> THANH TOÁN
        </button>
        <router-link to="/thucdon" class="continue-shopping-btn">
          <i class="fas fa-arrow-left"></i> Tiếp tục mua sắm
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import items from "../data/items"
import carts from "../data/cart"

export default {
  data() {
    return {
      carts: carts,
      shippingCost: 30000,
      discount: 0,
      items: items,
      selectedPaymentMethod: 'cash',
      currentUser: null,
      currentCart: []
    }
  },
  computed: {
    cart() {
      return this.currentCart
    },
    calculateSubtotal() {
      return this.cart.reduce((total, item) => {
        return total + this.calculateItemTotal(item)
      }, 0)
    },
    calculateTotal() {
      return this.calculateSubtotal + this.shippingCost - this.discount
    }
  },
  created() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'))
    if (!this.currentUser) {
      this.$router.push('/login')
    } else {
      this.initializeCart()
      this.currentCart = this.carts[this.currentUser.username] || []
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
    removeItem(item) {
      const index = this.cart.findIndex(i => i.id === item.id)
      if (index > -1) {
        const product = this.items.find(i => i.id === item.id)
        if (product) {
          product.quality += item.quantity
        }
        this.cart.splice(index, 1)
      }
    },
    decreaseQuantity(item) {
      if (item.quantity > 1) {
        item.quantity--
        const product = this.items.find(i => i.id === item.id)
        if (product) {
          product.quality++
        }
      } else {
        this.removeItem(item)
      }
    },
    increaseQuantity(item) {
      const product = this.items.find(i => i.id === item.id)
      if (product && product.quality > 0) {
        item.quantity++
        product.quality--
      }
    },
    checkout() {
      if (!this.selectedPaymentMethod) {
        alert('Vui lòng chọn phương thức thanh toán!')
        return
      }
      
      if (this.currentUser) {
        localStorage.setItem('currentCart', JSON.stringify(this.cart))
      }
      
      if (this.selectedPaymentMethod === 'card') {
        this.$router.push('/thanhtoan')
      } else {
        alert('Thanh toán bằng tiền mặt khi nhận hàng')
      }
    },
    goToPayment() {
      if (this.cart.length === 0) {
        alert('Giỏ hàng trống!')
        return
      }
      this.$router.push('/thanhtoan')
    },
    initializeCart() {
      if (this.currentUser && !this.carts[this.currentUser.username]) {
        this.carts[this.currentUser.username] = []
      }
    }
  }
}
</script>

<style scoped>
.shopping-cart {
  max-width: 1200px;
  margin: 80px auto 40px;
  padding: 0 20px;
}

.cart-title {
  text-align: left;
  margin-bottom: 30px;
  font-size: 2em;
  color: #333;
  border-bottom: 2px solid #8B4513;
  padding-bottom: 10px;
}

.empty-cart {
  text-align: center;
  padding: 50px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.continue-shopping {
  display: inline-block;
  margin-top: 20px;
  padding: 10px 20px;
  background: #8B4513;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background 0.3s;
}

.continue-shopping:hover {
  background: #693410;
}

.cart-container {
  display: flex;
  gap: 30px;
}

.cart-items {
  flex: 2;
}

.cart-item {
  display: flex;
  gap: 20px;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.cart-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.item-image {
  width: 150px;
  height: 150px;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
}

.item-details {
  flex: 1;
  text-align: left;
}

.item-details h2 {
  margin: 0 0 10px;
  color: #333;
  font-size: 1.2em;
}

.description {
  color: #666;
  margin-bottom: 10px;
  font-size: 0.9em;
}

.type {
  color: #8B4513;
  margin-bottom: 5px;
  font-weight: 500;
}

.price {
  font-weight: bold;
  color: #e44d26;
  margin-bottom: 15px;
  font-size: 1.1em;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.quantity-btn {
  width: 30px;
  height: 30px;
  border: none;
  background: #8B4513;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.quantity-btn:hover {
  background: #693410;
}

.quantity {
  padding: 0 10px;
  font-weight: 500;
}

.remove-btn {
  padding: 8px 15px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
  display: flex;
  align-items: center;
  gap: 5px;
}

.remove-btn:hover {
  background: #c82333;
}

.cost-estimate {
  flex: 1;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  height: fit-content;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 20px;
}

.cost-estimate h2 {
  color: #333;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #8B4513;
}

.cost-details {
  margin: 20px 0;
}

.cost-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
  color: #666;
}

.cost-row.total {
  font-weight: bold;
  border-top: 2px solid #333;
  border-bottom: none;
  margin-top: 10px;
  padding-top: 15px;
  color: #333;
  font-size: 1.2em;
}

.payment-methods {
  margin: 20px 0;
  padding: 15px 0;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
}

.payment-methods h3 {
  margin-bottom: 15px;
  color: #333;
  font-size: 1.1em;
}

.payment-option {
  display: flex;
  align-items: center;
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

.payment-option:hover {
  background-color: #f9f9f9;
}

.payment-option input[type="radio"] {
  margin-right: 10px;
}

.payment-option label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.payment-option i {
  color: #8B4513;
}

.checkout-btn {
  width: 100%;
  padding: 15px;
  background: #8B4513;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  margin-bottom: 10px;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.checkout-btn:hover {
  background: #693410;
  transform: translateY(-2px);
}

.continue-shopping-btn {
  display: block;
  width: 100%;
  max-width: 300px;
  padding: 10px;
  background: #fff;
  color: #8B4513;
  border: 2px solid #8B4513;
  border-radius: 4px;
  text-align: center;
  text-decoration: none;
  font-weight: bold;
  font-size: 0.9em;
  transition: all 0.3s;
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-sizing: border-box;
  margin: 10px auto;
}

.continue-shopping-btn:hover {
  background: #8B4513;
  color: white;
}

@media (max-width: 768px) {
  .cart-container {
    flex-direction: column;
  }

  .cart-item {
    flex-direction: column;
  }

  .item-image {
    width: 100%;
    height: 200px;
  }

  .cost-estimate {
    position: static;
  }
}
</style>