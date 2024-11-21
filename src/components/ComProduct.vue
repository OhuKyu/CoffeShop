<template>
    <main>
        <div class="menu">
            <div class="menu-carousel">
                <div class="menu-item" v-for="product in products" :key="product.id">
                    <router-link :to="{ name: 'ProductDetail', params: { id: product.id } }">
                        <div class="image-container">
                            <img v-if="product && product.image" :src="product.image" alt="Product Image">
                            <img v-else src="assets/food_menu/Placeholder.png" alt="Placeholder Image">
                        </div>
                        <div class="menu-item-info">
                            <h3>{{ product.name }}</h3>
                            <p class="description">{{ product.description }}</p>
                            <p class="price">{{ product.price }} đ</p>
                        </div>
                    </router-link>
                </div>
            </div>
        </div>
    </main>
</template>

<script>
export default {
    props: ['products']
}
</script>

<style scoped>
.menu {
    padding: 40px 20px;
    background-color: #fff;
}

.menu-carousel {
    display: flex;
    overflow-x: auto;
    gap: 20px;
    max-width: 1200px;
    margin: 0 auto;
}

.menu-item {
    display: flex;
    flex-direction: column;
    min-width: 250px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    background-color: #f9f9f9;
}

.menu-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.image-container {
    width: 100%;
    padding-top: 90%;
    position: relative;
    overflow: hidden;
}

.image-container img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.menu-item-info {
    padding: 15px;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
}

.menu-item-info h3 {
    font-size: 18px;
    margin: 0 0 8px;
    color: #ffffff;
}

.menu-item-info .description {
    margin: 0 0 10px;
    color: #ffffff;
    font-size: 14px;
    flex-grow: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
}

.price {
    font-weight: bold;
    color: #fcb034;
    margin-top: auto;
    font-size: 16px;
}

a {
    text-decoration: none;
}

router-link {
    text-decoration: none;
}

@media (max-width: 768px) {
    .menu-carousel {
        gap: 15px;
    }
}

@media (max-width: 480px) {
    .menu-carousel {
        flex-direction: column;
    }

    .menu-item {
        max-width: 100%;
    }
}
</style>
