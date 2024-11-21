<template>
  <div class="menu-container">
    <div class="filter-sidebar">
      <h2 class="filter-title">Tìm kiếm</h2>
      <div class="filter-group">
        <label>Danh Mục:</label>
        <select v-model="selectedCategory" class="form-select">
          <option value="cafe">Cà phê</option>
          <option value="do_ngot">Đồ ngọt</option>
        </select>
      </div>
      <div class="filter-group">
        <label>Tên sản phẩm:</label>
        <input type="text" v-model="searchName" placeholder="Tìm kiếm..." class="form-input">
      </div>
      <div class="filter-group">
        <label>Giá:</label>
        <div class="price-range">
          <input type="range" v-model="priceRange" min="0" max="100" step="1" class="range-input">
          <span>{{ formatPrice(priceRange * 1000) }}</span>
        </div>
      </div>
    </div>
    <div class="products-section">
      <div class="category-section" v-if="filteredCoffeeProducts.length > 0">
        <h2 class="category-title">Cà Phê</h2>
        <div class="products-grid">
          <div class="product-card" v-for="item in paginatedCoffeeProducts" :key="item.id">
            <router-link :to="{ name: 'ProductDetail', params: { id: item.id } }">
              <div class="product-image">
                <img :src="item.image" :alt="item.name">
              </div>
              <div class="product-info">
                <h3>{{ item.name }}</h3>
                <p class="description">{{ item.description }}</p>
                <p class="price">{{ formatPrice(item.price * 1000) }}</p>
              </div>
            </router-link>
            <div class="quantity-controls">
              <button @click="decreaseQuantity(item)" class="quantity-btn">-</button>
              <span class="quantity">{{ item.quantity || 0 }}</span>
              <button @click="increaseQuantity(item)" class="quantity-btn">+</button>
            </div>
            <button class="add-to-cart-btn" @click="addToCart(item)" :disabled="!item.quantity">
              Thêm vào giỏ hàng
            </button>
          </div>
        </div>
        <div class="pagination" v-if="totalCoffeePages > 1">
          <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1" class="page-btn">
            &laquo;
          </button>
          <button v-for="page in totalCoffeePages" :key="page" @click="changePage(page)"
            :class="{ active: currentPage === page }" class="page-btn">
            {{ page }}
          </button>
          <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalCoffeePages" class="page-btn">
            &raquo;
          </button>
        </div>
      </div>
      <div class="category-section" v-if="filteredDessertProducts.length > 0">
        <h2 class="category-title">Đồ Ngọt</h2>
        <div class="products-grid">
          <div class="product-card" v-for="item in paginatedDessertProducts" :key="item.id">
            <router-link :to="{ name: 'ProductDetail', params: { id: item.id } }">
              <div class="product-image">
                <img :src="item.image" :alt="item.name">
              </div>
              <div class="product-info">
                <h3>{{ item.name }}</h3>
                <p class="description">{{ item.description }}</p>
                <p class="price">{{ formatPrice(item.price * 1000) }}</p>
              </div>
            </router-link>
            <div class="quantity-controls">
              <button @click="decreaseQuantity(item)" class="quantity-btn">-</button>
              <span class="quantity">{{ item.quantity || 0 }}</span>
              <button @click="increaseQuantity(item)" class="quantity-btn">+</button>
            </div>
            <button class="add-to-cart-btn" @click="addToCart(item)" :disabled="!item.quantity">
              Thêm vào giỏ hàng
            </button>
          </div>
        </div>
        <div class="pagination" v-if="totalDessertPages > 1">
          <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1" class="page-btn">
            &laquo;
          </button>
          <button v-for="page in totalDessertPages" :key="page" @click="changePage(page)"
            :class="{ active: currentPage === page }" class="page-btn">
            {{ page }}
          </button>
          <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalDessertPages" class="page-btn">
            &raquo;
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import items from '../data/items'
import carts from '../data/cart'
import eventBus from '@/eventBus'

export default {
  name: 'ComThucDon',
  data() {
    return {
      products: items,
      selectedCategory: 'cafe',
      searchName: '',
      priceRange: 100,
      carts: carts,
      currentPage: 1,
      itemsPerPage: 4,
      currentUser: null
    }
  },
  computed: {
    filteredProducts() {
      return this.products.filter(product => {
        const matchCategory = this.selectedCategory ? product.category === this.selectedCategory : true
        const matchName = product.name.toLowerCase().includes(this.searchName.toLowerCase())
        const matchPrice = product.price <= this.priceRange
        return matchCategory && matchName && matchPrice
      })
    },
    filteredCoffeeProducts() {
      return this.filteredProducts.filter(product => product.category === 'cafe')
    },
    filteredDessertProducts() {
      return this.filteredProducts.filter(product => product.category === 'do_ngot')
    },
    paginatedCoffeeProducts() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      return this.filteredCoffeeProducts.slice(startIndex, startIndex + this.itemsPerPage);
    },
    paginatedDessertProducts() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      return this.filteredDessertProducts.slice(startIndex, startIndex + this.itemsPerPage);
    },
    totalCoffeePages() {
      return Math.ceil(this.filteredCoffeeProducts.length / this.itemsPerPage);
    },
    totalDessertPages() {
      return Math.ceil(this.filteredDessertProducts.length / this.itemsPerPage);
    }
  },
  created() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'))
    if (!this.currentUser) {
      this.$router.push('/login')
    }
  },
  methods: {
    formatPrice(price) {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(price)
    },
    decreaseQuantity(item) {
      if (!item.quantity) item.quantity = 0
      if (item.quantity > 0) item.quantity--
    },
    increaseQuantity(item) {
      if (!item.quantity) item.quantity = 0
      if (item.quantity < item.quality) item.quantity++
    },
    addToCart(item) {
      if (item.quantity > 0) {
        const cart = this.getUserCart()
        const existingItem = cart.find(cartItem => cartItem.id === item.id)
        if (existingItem) {
          existingItem.quantity += item.quantity
        } else {
          cart.push({ ...item, quantity: item.quantity })
        }
        item.quality -= item.quantity
        item.quantity = 0
        eventBus.emit('cartUpdated')
        alert('Đã thêm vào giỏ hàng!')
      }
    },
    getUserCart() {
      if (!this.currentUser) return []
      if (!this.carts[this.currentUser.username]) {
        this.carts[this.currentUser.username] = []
      }
      return this.carts[this.currentUser.username]
    },
    changePage(page) {
      this.currentPage = page
    }
  }
}
</script>

<style scoped>
.menu-container {
  display: flex;
  gap: 30px;
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.filter-sidebar {
  flex: 0 0 250px;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: fit-content;
  position: sticky;
  top: 20px;
  align-self: flex-start;
}

.filter-title {
  font-size: 1.5em;
  margin-bottom: 20px;
  color: #8B4513;
  border-bottom: 2px solid #8B4513;
  padding-bottom: 10px;
}

.filter-group {
  margin-bottom: 20px;
}

.filter-group label {
  display: block;
  margin-bottom: 8px;
  color: #666;
  font-weight: 500;
}

.form-select,
.form-input {
  width: 100%;
  max-width: 200px;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.range-input {
  width: 100%;
  max-width: 200px;
  margin: 10px 0;
}

.products-section {
  flex: 1;
}

.category-section {
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.category-title {
  font-size: 2em;
  color: #8B4513;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #8B4513;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.product-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.product-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 30px rgba(0,0,0,0.1);
}

.product-image {
  height: 200px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.product-card:hover .product-image img {
  transform: scale(1.1);
}

.product-info {
  padding: 15px;
}

.product-info h3 {
  margin: 0 0 10px;
  font-size: 18px;
  color: #333;
}

.description {
  color: #666;
  font-size: 14px;
  margin-bottom: 15px;
  height: 40px;
  overflow: hidden;
}

.price {
  color: #e44d26;
  font-weight: bold;
  font-size: 16px;
  margin: 10px 0;
}

.quantity-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin: 15px;
}

.quantity-btn {
  width: 30px;
  height: 30px;
  border: none;
  background: #8B4513;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.quantity {
  font-size: 16px;
  min-width: 30px;
  text-align: center;
}

.add-to-cart-btn {
  width: calc(100% - 30px);
  margin: 0 15px 15px;
  padding: 10px;
  background: #8B4513;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;
}

.add-to-cart-btn:hover {
  background: #693410;
}

.add-to-cart-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

a {
  text-decoration: none;
}

router-link {
  text-decoration: none;
}

@media (max-width: 768px) {
  .menu-container {
    flex-direction: column;
  }

  .filter-sidebar {
    position: static;
    width: 100%;
  }

  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 30px;
}

.page-btn {
  padding: 8px 16px;
  border: 1px solid #8B4513;
  background: white;
  color: #8B4513;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.page-btn:hover {
  background: #8B4513;
  color: white;
}

.page-btn.active {
  background: #8B4513;
  color: white;
}
</style>
