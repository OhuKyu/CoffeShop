<template>
  <div class="about-container">
    <div class="hero-section">
      <h1 class="main-title">Về Chúng Tôi</h1>
      <p class="subtitle">Nơi Hương Vị Gặp Gỡ Đam Mê</p>
    </div>
    <div class="content-section">
      <div class="team-intro">
        <div class="image-container">
          <img src="@/assets/about/group.png" alt="Our Team" class="team-image">
        </div>
        <div class="text-content">
          <h2>Đội Ngũ Của Chúng Tôi</h2>
          <p>
            Web này được làm ra khi em bắt đầu thấy bị dồn môn và bắt đầu suy nghĩ mình có bị rớt môn không,
            còn đây là ảnh nhóm khi đi chơi vì em không có ảnh cá nhân. Thôi đừng đọc nữa em hết biết ghi gì
            rồi. Đã bảo đừng đọc nữa mà ;-;;
          </p>
          <div class="stats">
            <div class="stat-item">
              <span class="number">5+</span>
              <span class="label">Năm Kinh Nghiệm</span>
            </div>
            <div class="stat-item">
              <span class="number">1000+</span>
              <span class="label">Khách Hàng Hài Lòng</span>
            </div>
            <div class="stat-item">
              <span class="number">50+</span>
              <span class="label">Sản Phẩm Độc Đáo</span>
            </div>
          </div>
        </div>
      </div>
      <div class="values-section">
        <h2>Giá Trị Cốt Lõi</h2>
        <div class="values-grid">
          <div class="value-item">
            <i class="fas fa-coffee"></i>
            <h3>Chất Lượng</h3>
            <p>Cam kết sử dụng nguyên liệu tươi ngon nhất để tạo ra những sản phẩm hoàn hảo</p>
          </div>
          <div class="value-item">
            <i class="fas fa-heart"></i>
            <h3>Đam Mê</h3>
            <p>Làm việc với tình yêu và sự tận tâm để mang đến trải nghiệm tuyệt vời nhất</p>
          </div>
          <div class="value-item">
            <i class="fas fa-users"></i>
            <h3>Phục Vụ</h3>
            <p>Luôn lắng nghe và đáp ứng mọi nhu cầu của khách hàng một cách tốt nhất</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ComGioiTh'
}
</script>

<style scoped>
.about-container {
  padding: 40px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.hero-section {
  text-align: center;
  margin-bottom: 60px;
  padding: 60px 0;
  background: linear-gradient(rgba(139, 69, 19, 0.1), rgba(139, 69, 19, 0.1));
  border-radius: 12px;
}

.main-title {
  font-size: 3em;
  color: #8B4513;
  margin-bottom: 20px;
}

.subtitle {
  font-size: 1.5em;
  color: #666;
}

.content-section {
  margin-top: 40px;
}

.team-intro {
  display: flex;
  gap: 40px;
  align-items: center;
  margin-bottom: 60px;
}

.image-container {
  flex: 1;
}

.team-image {
  width: 100%;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.text-content {
  flex: 1;
}

.text-content h2 {
  font-size: 2em;
  color: #8B4513;
  margin-bottom: 20px;
}

.text-content p {
  line-height: 1.6;
  color: #666;
  margin-bottom: 30px;
}

.stats {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
}

.stat-item {
  text-align: center;
}

.number {
  display: block;
  font-size: 2.5em;
  font-weight: bold;
  color: #8B4513;
}

.label {
  color: #666;
  font-size: 0.9em;
}

.values-section {
  text-align: center;
  margin-top: 60px;
}

.values-section h2 {
  font-size: 2em;
  color: #8B4513;
  margin-bottom: 40px;
}

.values-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

.value-item {
  padding: 30px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.value-item:hover {
  transform: translateY(-5px);
}

.value-item i {
  font-size: 2em;
  color: #8B4513;
  margin-bottom: 20px;
}

.value-item h3 {
  font-size: 1.5em;
  color: #333;
  margin-bottom: 15px;
}

.value-item p {
  color: #666;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .team-intro {
    flex-direction: column;
  }

  .values-grid {
    grid-template-columns: 1fr;
  }

  .stats {
    flex-direction: column;
    gap: 20px;
  }
}
</style>