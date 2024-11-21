<template>
    <div class="page-container">
        <div class="carousel-section">
            <swiper v-if="isClient" :modules="[Pagination]" :slides-per-view="1" :pagination="{ clickable: true }"
                class="mySwiper" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave" @swiper="onSwiperInit">
                <swiper-slide v-for="(image, index) in images" :key="index">
                    <div class="image-wrapper">
                        <img :src="image" :alt="'Image ' + (index + 1)" @click="selectImage(index)" />
                    </div>
                </swiper-slide>
            </swiper>
        </div>
        <div class="featured-products" :class="{ visible: isVisible.featuredProducts }">
            <h2 class="section-title">Sản Phẩm Nổi Bật</h2>
            <div class="products-grid">
                <router-link v-for="product in randomProducts" :key="product.id" to="/thucdon" class="product-card">
                    <div class="product-image">
                        <img :src="product.image" :alt="product.name">
                        <div class="product-overlay">
                            <span class="view-more">Xem thêm</span>
                        </div>
                    </div>
                    <div class="product-info">
                        <h3>{{ product.name }}</h3>
                        <p class="price">{{ formatPrice(product.price) }}</p>
                    </div>
                </router-link>
            </div>
        </div>
        <div class="story-container" :class="{ visible: isVisible.storyContainer }">
            <div class="story-content">
                <div class="right-content">
                    <div class="title-container">
                        <span class="discover">Khám Phá</span>
                        <h2>CÂU CHUYỆN CỦA CHÚNG TÔI</h2>
                    </div>
                    <div class="description-box">
                        <p>
                            Chào mừng bạn đến với không gian cà phê của chúng tôi - nơi mỗi tách cà phê là một câu
                            chuyện, mỗi chiếc bánh là một tác phẩm nghệ thuật. Được thành lập từ niềm đam mê với hương
                            vị cà phê Việt Nam, chúng tôi không ngừng tìm kiếm và chọn lọc những hạt cà phê thượng hạng,
                            kết hợp với công thức pha chế độc đáo để mang đến cho bạn những trải nghiệm ẩm thực tuyệt
                            vời nhất.
                        </p>
                    </div>
                </div>
                <div class="left-content">
                    <img :src="require('@/assets/food_menu/Story.png')" alt="Story Image" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import items from '../data/items';

export default {
    name: 'ComHome',
    components: {
        Swiper,
        SwiperSlide
    },
    data() {
        return {
            images: [
                '/Images/CarouselImage/CarouselImage.png',
                '/Images/CarouselImage/CarouselImage1.png',
                '/Images/CarouselImage/CarouselImage2.png',
                '/Images/CarouselImage/CarouselImage3.png',
                '/Images/CarouselImage/CarouselImage4.png'
            ],
            currentIndex: 0,
            imageRotationInterval: null,
            swiperInstance: null,
            isClient: false,

            products: items,
            lastScrollPosition: 0,
            isVisible: {
                featuredProducts: false,
                storyContainer: false
            }
        };
    },
    computed: {
        randomProducts() {
            return this.shuffleArray([...this.products]).slice(0, 4);
        }
    },
    mounted() {
        this.isClient = true;
        this.startImageRotation();
        window.addEventListener('scroll', this.handleScroll);
        this.handleScroll();
    },
    beforeUnmount() {
        this.clearRotationInterval();
        window.removeEventListener('scroll', this.handleScroll);
    },
    methods: {
        onSwiperInit(swiper) {
            this.swiperInstance = swiper;
        },
        selectImage(index) {
            this.currentIndex = index;
            if (this.swiperInstance) {
                this.swiperInstance.slideTo(index);
            }
        },
        startImageRotation() {
            this.clearRotationInterval();
            this.imageRotationInterval = setInterval(() => {
                this.currentIndex = (this.currentIndex + 1) % this.images.length;
                if (this.swiperInstance) {
                    this.swiperInstance.slideTo(this.currentIndex);
                }
            }, 1500);
        },
        clearRotationInterval() {
            if (this.imageRotationInterval) {
                clearInterval(this.imageRotationInterval);
                this.imageRotationInterval = null;
            }
        },
        handleMouseEnter() {
            this.clearRotationInterval();
        },
        handleMouseLeave() {
            this.startImageRotation();
        },
        shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        },
        formatPrice(price) {
            return new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
            }).format(price * 1000)
        },
        handleScroll() {
            const featuredProducts = document.querySelector('.featured-products');
            const storyContainer = document.querySelector('.story-container');
            
            if (featuredProducts) {
                const rect = featuredProducts.getBoundingClientRect();
                this.isVisible.featuredProducts = rect.top < window.innerHeight - 100;
            }
            
            if (storyContainer) {
                const rect = storyContainer.getBoundingClientRect();
                this.isVisible.storyContainer = rect.top < window.innerHeight - 100;
            }
        }
    },
    setup() {
        return {
            Pagination
        };
    }
}
</script>

<style scoped>
.page-container {
    width: 100%;
    overflow-x: hidden;
}

.carousel-section {
    width: 100%;
    margin-bottom: 2.5rem;
    position: relative;
}

.carousel-section .swiper {
    width: 100%;
    height: auto;
}

.image-wrapper {
    position: relative;
    width: 100%;
    overflow: hidden;
}

.image-wrapper img {
    width: 100%;
    height: auto;
    object-fit: cover;
    transition: transform 0.3s ease-in-out;
}

.image-wrapper:hover img {
    transform: scale(1.05);
}

.story-container {
    background-color: var(--bg-color, rgba(255, 255, 255, 0.95));
    padding: 4rem 1.25rem;
    position: relative;
    opacity: 0;
    transform: translateY(50px);
    transition: all 0.8s ease-out;
}

.story-container.visible {
    opacity: 1;
    transform: translateY(0);
}

.story-content {
    max-width: 75rem;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 3.75rem;
    align-items: start;
}

.left-content {
    display: flex;
    justify-content: center;
}

.left-content img {
    width: 100%;
    height: auto;
    border-radius: 0.5rem;
    box-shadow: 0 0.25rem 1rem rgba(0, 0, 0, 0.15);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.left-content img:hover {
    transform: translateY(-0.5rem);
    box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.2);
}

.right-content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding-top: 1.25rem;
}

.title-container {
    margin-bottom: 2rem;
    position: relative;
}

.discover {
    font-family: 'Playball', cursive;
    color: var(--accent-color, #d4af37);
    font-size: 2.625rem;
    display: block;
    margin-bottom: -0.9375rem;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.title-container h2 {
    font-size: 3.5rem;
    font-weight: 700;
    margin: 0;
    color: var(--text-color, rgb(0, 0, 0));
    font-family: 'Montserrat', sans-serif;
    letter-spacing: 0.1875rem;
    text-transform: uppercase;
}

.description-box {
    background-color: var(--box-bg-color, rgba(0, 0, 0, 0.8));
    border-radius: 0.5rem;
    padding: 2rem;
    margin-top: 1.25rem;
    width: 90%;
    box-shadow: 0 0.25rem 1rem rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(8px);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.description-box:hover {
    transform: translateY(-0.25rem);
    box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.25);
}

.description-box p {
    font-size: 1rem;
    line-height: 1.8;
    color: var(--text-light, rgba(255, 255, 255, 0.7));
    margin: 0;
    text-align: justify;
    font-family: 'Open Sans', sans-serif;
}

:deep(.swiper-pagination-bullet) {
    width: 0.5rem;
    height: 0.5rem;
    background: var(--bullet-color, #cacaca);
    opacity: 0.5;
    transition: all 0.3s ease;
}

:deep(.swiper-pagination-bullet-active) {
    background: var(--bullet-active-color, #fff);
    opacity: 1;
    transform: scale(1.2);
}

@media (max-width: 1024px) {
    .story-content {
        gap: 2rem;
    }

    .title-container h2 {
        font-size: 3rem;
    }
}

@media (max-width: 768px) {
    .story-content {
        grid-template-columns: 1fr;
        gap: 2.5rem;
    }

    .right-content {
        align-items: center;
        text-align: center;
    }

    .description-box {
        width: 100%;
    }

    .title-container {
        text-align: center;
    }

    .discover {
        font-size: 2.25rem;
    }

    .title-container h2 {
        font-size: 2.5rem;
    }
}

@media (max-width: 480px) {
    .story-container {
        padding: 2rem 1rem;
    }

    .discover {
        font-size: 2rem;
    }

    .title-container h2 {
        font-size: 2rem;
        letter-spacing: 0.125rem;
    }

    .description-box {
        padding: 1.5rem;
    }
}

.featured-products {
    padding: 4rem 1.25rem;
    background-color: var(--bg-color, #fff);
    opacity: 0;
    transform: translateY(50px);
    transition: all 0.8s ease-out;
}

.featured-products.visible {
    opacity: 1;
    transform: translateY(0);
}

.section-title {
    text-align: center;
    font-size: 2.5rem;
    color: var(--text-color, #2c3e50);
    margin-bottom: 3rem;
    font-family: 'Montserrat', sans-serif;
    position: relative;
}

.section-title::after {
    content: '';
    position: absolute;
    bottom: -0.5rem;
    left: 50%;
    transform: translateX(-50%);
    width: 5rem;
    height: 0.25rem;
    background-color: var(--accent-color, #8B4513);
    border-radius: 0.125rem;
}

.products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    max-width: 75rem;
    margin: 0 auto;
}

.product-card {
    background: white;
    border-radius: 0.5rem;
    overflow: hidden;
    box-shadow: 0 0.25rem 1rem rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    text-decoration: none;
    color: inherit;
}

.product-card:hover {
    transform: translateY(-0.5rem);
    box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.2);
}

.product-image {
    position: relative;
    padding-top: 75%;
    overflow: hidden;
}

.product-image img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.product-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.product-card:hover .product-overlay {
    opacity: 1;
}

.view-more {
    color: white;
    font-size: 1rem;
    padding: 0.75rem 1.5rem;
    border: 2px solid white;
    border-radius: 2rem;
    transition: all 0.3s ease;
}

.product-info {
    padding: 1.25rem;
    text-align: center;
}

.product-info h3 {
    margin: 0;
    font-size: 1.25rem;
    color: var(--text-color, #2c3e50);
    margin-bottom: 0.5rem;
}

.price {
    color: var(--accent-color, #8B4513);
    font-weight: 600;
    font-size: 1.125rem;
}

@media (max-width: 768px) {
    .products-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
        padding: 0 1rem;
    }

    .section-title {
        font-size: 2rem;
    }
}

@media (max-width: 480px) {
    .products-grid {
        grid-template-columns: 1fr;
    }

    .section-title {
        font-size: 1.75rem;
    }
}
</style>