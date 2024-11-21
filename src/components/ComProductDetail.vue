<template>
  <main class="product-detail-container">
    <div class="product-detail" v-if="product">
      <div class="product-image">
        <img :src="product.image" :alt="product.name">
      </div>
      <div class="product-info">
        <div class="product-header">
          <h1>{{ product.name }}</h1>
          <p class="sku">SKU: {{ generateSKU(product.name) }}</p>
          <div class="price">${{ formatPrice(calculateTotalPrice) }}</div>
          <div class="stock-status" :class="{ 'out-of-stock': !product.quality }">
            {{ product.quality > 0 ? `Còn lại: ${product.quality}` : 'Hết hàng' }}
          </div>
        </div>
        <p class="description">{{ product.description }}</p>
        <div class="size-selection">
          <h3>Chọn kích thước:</h3>
          <div class="size-buttons">
            <button v-for="size in product.sizes" :key="size.label" :class="{ active: selectedSize === size.label }"
              @click="selectSize(size)">
              {{ size.label }}
              <span class="size-price">(+{{ formatPrice(size.price) }})</span>
            </button>
          </div>
        </div>
        <div class="quantity-control">
          <span class="quantity-label">Số lượng:</span>
          <button @click="decreaseQuantity" class="quantity-btn" :disabled="quantity <= 1">−</button>
          <span class="quantity">{{ quantity }}</span>
          <button @click="increaseQuantity" class="quantity-btn" :disabled="quantity >= product.quality">+</button>
        </div>
        <div class="total-section">
          <span class="total-label">Tổng tiền:</span>
          <span class="total-price">{{ formatPrice(calculateTotalPrice * quantity) }}</span>
        </div>
        <button class="add-to-cart" @click="addToCart" :disabled="!product.quality">
          <i class="fas fa-shopping-cart"></i>
          {{ product.quality ? 'Thêm vào giỏ hàng' : 'Hết hàng' }}
        </button>
      </div>
    </div>
    <div class="related-products" v-if="product && relatedProducts.length">
      <h2>Sản phẩm liên quan</h2>
      <swiper :modules="[Navigation, Pagination]" :slides-per-view="slidesPerView" :space-between="30"
        :navigation="true" :pagination="{ clickable: true }">
        <swiper-slide v-for="item in relatedProducts" :key="item.id">
          <div class="related-product-card">
            <router-link :to="{ name: 'ProductDetail', params: { id: item.id } }">
              <div class="card-image">
                <img :src="item.image" :alt="item.name">
              </div>
              <div class="card-content">
                <h3>{{ item.name }}</h3>
                <p class="price">{{ formatPrice(item.price) }}</p>
              </div>
            </router-link>
          </div>
        </swiper-slide>
      </swiper>
    </div>
  </main>
</template>

<script>
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import items from "../data/items";
import carts from "../data/cart";
import eventBus from '@/eventBus'

export default {
  components: {
    Swiper,
    SwiperSlide
  },
  data() {
    return {
      product: null,
      quantity: 1,
      selectedSize: null,
      Navigation,
      Pagination,
      carts: carts,
      currentUser: null
    };
  },
  computed: {
    calculateTotalPrice() {
      if (!this.product) return 0;
      const basePrice = this.product.price || 0;
      const sizePrice = this.product.sizes?.find(s => s.label === this.selectedSize)?.price || 0;
      return basePrice + sizePrice;
    },
    relatedProducts() {
      if (!this.product) return [];

      const relatedProducts = items.filter(item =>
        item.category === this.product.category &&
        item.id !== this.product.id
      );

      return this.shuffleArray([...relatedProducts]).slice(0, 4);
    },
    slidesPerView() {
      return window.innerWidth < 768 ? 1 :
        window.innerWidth < 1024 ? 2 :
          window.innerWidth < 1200 ? 3 : 4;
    },
    cart() {
      if (!this.currentUser) return []
      return this.carts[this.currentUser.username] || []
    }
  },
  mounted() {
    const id = this.$route.params.id;
    this.product = items.find((item) => item.id == id) || null;
    if (this.product?.sizes?.length) {
      this.selectedSize = this.product.sizes[0].label;
    }
  },
  created() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'))
    if (!this.currentUser) {
      this.$router.push('/login')
    } else {
      this.initializeCart()
    }
  },
  methods: {
    formatPrice(price) {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(price * 1000);
    },
    generateSKU(name) {
      if (!name) return '';
      return name.toLowerCase().replace(/\s+/g, '-') + '-' +
        Math.random().toString(36).substring(2, 7);
    },
    selectSize(size) {
      this.selectedSize = size.label;
    },
    decreaseQuantity() {
      if (this.quantity > 1) this.quantity--;
    },
    increaseQuantity() {
      if (this.quantity < this.product.quality) this.quantity++;
    },
    addToCart() {
      if (!this.product.quality) {
        alert("Sản phẩm đ hết hàng");
        return;
      }

      const cartItem = {
        ...this.product,
        quantity: this.quantity,
        selectedSize: this.selectedSize,
        totalPrice: this.calculateTotalPrice * this.quantity
      };

      const existingItemIndex = this.cart.findIndex(item =>
        item.id === this.product.id && item.selectedSize === this.selectedSize
      );

      if (existingItemIndex !== -1) {
        const newQuantity = this.cart[existingItemIndex].quantity + this.quantity;
        if (newQuantity > this.product.quality) {
          alert("Không đủ số lượng trong kho!");
          return;
        }
        this.cart[existingItemIndex].quantity = newQuantity;
        this.cart[existingItemIndex].totalPrice = this.calculateTotalPrice * newQuantity;
      } else {
        this.cart.push(cartItem);
      }

      this.product.quality -= this.quantity;
      this.quantity = 1;
      eventBus.emit('cartUpdated')
      alert('Đã thêm vào giỏ hàng!');
    },
    shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    },
    initializeCart() {
      if (this.currentUser && !this.carts[this.currentUser.username]) {
        this.carts[this.currentUser.username] = []
      }
    }
  },
  watch: {
    '$route.params.id': {
      handler(newId) {
        this.product = items.find((item) => item.id == newId) || null;
        if (this.product?.sizes?.length) {
          this.selectedSize = this.product.sizes[0].label;
        }
        this.quantity = 1;
        window.scrollTo(0, 0);
      },
      immediate: true
    }
  }
};
</script>

<style scoped>
.product-detail-container {
  padding: 40px 20px;
  background: #f8f9fa;
  min-height: 100vh;
}

.product-detail {
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
  gap: 60px;
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.product-image {
  flex: 1;
  border-radius: 8px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-image img:hover {
  transform: scale(1.05);
}

.product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.product-header h1 {
  font-size: 32px;
  color: #2c3e50;
  margin-bottom: 8px;
}

.sku {
  color: #6c757d;
  font-size: 14px;
  margin-bottom: 16px;
}

.price {
  font-size: 28px;
  color: #e44d26;
  font-weight: bold;
}

.stock-status {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 4px;
  background: #28a745;
  color: white;
  font-size: 14px;
  margin-top: 8px;
}

.stock-status.out-of-stock {
  background: #dc3545;
}

.description {
  font-size: 16px;
  line-height: 1.6;
  color: #4a5568;
  margin: 20px 0;
}

.size-selection {
  margin-bottom: 24px;
}

.size-selection h3 {
  margin-bottom: 12px;
  color: #2c3e50;
}

.size-buttons {
  display: flex;
  gap: 12px;
}

.size-buttons button {
  padding: 10px 20px;
  border: 2px solid #ddd;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.size-buttons button.active {
  border-color: #8B4513;
  background: #8B4513;
  color: white;
}

.size-price {
  font-size: 12px;
  opacity: 0.8;
}

.quantity-control {
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 24px 0;
}

.quantity-label {
  font-weight: 500;
  color: #2c3e50;
}

.quantity-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: #8B4513;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.quantity-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.quantity {
  font-size: 18px;
  font-weight: 500;
  min-width: 40px;
  text-align: center;
}

.total-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-top: 1px solid #eee;
  margin-top: 16px;
}

.total-label {
  font-size: 18px;
  font-weight: 500;
  color: #2c3e50;
}

.total-price {
  font-size: 24px;
  font-weight: bold;
  color: #e44d26;
}

.add-to-cart {
  width: 100%;
  padding: 16px;
  background: #8B4513;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.add-to-cart:hover {
  background: #693410;
  transform: translateY(-2px);
}

.add-to-cart:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
}

.related-products {
  max-width: 1200px;
  margin: 60px auto;
  padding: 40px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.related-products h2 {
  font-size: 24px;
  color: #2c3e50;
  margin-bottom: 30px;
  text-align: left;
}

.related-product-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  height: 100%;
}

.related-product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.card-image {
  position: relative;
  padding-top: 75%;
  overflow: hidden;
}

.card-image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-content {
  padding: 16px;
}

.card-content h3 {
  font-size: 16px;
  color: #2c3e50;
  margin-bottom: 8px;
  text-decoration: none;
}

.related-product-card a {
  text-decoration: none;
}

.card-content .price {
  text-decoration: none;
  font-size: 16px;
  color: #e44d26;
}

:deep(.swiper-button-next),
:deep(.swiper-button-prev) {
  color: #8B4513;
  background: white;
  padding: 20px;
  border-radius: 50%;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

:deep(.swiper-pagination-bullet-active) {
  background: #8B4513;
}

@media (max-width: 768px) {
  .product-detail {
    flex-direction: column;
    padding: 20px;
  }

  .product-image {
    max-height: 400px;
  }

  .size-buttons {
    flex-wrap: wrap;
  }

  .related-products {
    padding: 20px;
  }
}
</style>