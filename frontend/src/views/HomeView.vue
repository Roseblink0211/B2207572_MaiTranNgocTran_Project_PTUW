<template>
  <div class="home-background">
    <div class="home-container">
      <!-- ,Left side - Content -->
      <div class="home-left">
        <div class="home-content">
          <div class="home-title">
            <h1>Hệ thống quản lý thư viện</h1>
            <p class="home-subtitle">
              Chào mừng bạn đến với thư viện trực tuyến
            </p>
          </div>
          <div class="home-description">
            <p>
              Khám phá kho tàng tri thức phong phú với hàng ngàn đầu sách đa
              dạng. Đăng nhập tài khoản để dễ dàng tìm kiếm, mượn và quản lý
              sách yêu thích của bạn.
            </p>
          </div>
          <div class="home-actions">
            <router-link to="/login" class="btn-primary">
              <i class="fas fa-user"></i>
              Đăng nhập
            </router-link>
            <router-link to="/register" class="btn-secondary">
              <i class="fas fa-user-plus"></i>
              Đăng ký
            </router-link>
          </div>
        </div>
      </div>
      <!-- Right side - Image/Illustration -->
      <div class="home-right">
        <div class="image-wrapper">
          <img src="../assets/Bibliophile-rafiki.png" class="home-image" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HomeView",
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.home-background {
  min-height: 100vh;
  background: linear-gradient(135deg, #fffde7 0%, #ffe082 50%, #ffca28 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  position: relative;
  overflow: hidden;
}

/* Container trắng ở giữa */
.home-container {
  display: flex;
  width: 100%;
  max-width: 1200px;
  min-height: 600px;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(255, 179, 0, 0.22);
  overflow: hidden;
  position: relative;
  z-index: 2;
}

/* Cột trái */
.home-left {
  flex: 1;
  padding: 50px 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: linear-gradient(135deg, #ffffff 0%, #fffdf5 100%);
}

.home-content {
  max-width: 500px;
}

.home-title {
  margin-bottom: 30px;
}

/* Tiêu đề chính */
.home-title h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 15px;
  line-height: 1.2;
  background: linear-gradient(135deg, #8d6e00 0%, #ffb300 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Sub title */
.home-subtitle {
  font-size: 1.2rem;
  color: #6d4c41;
  font-weight: 400;
  margin: 0;
}

/* Mô tả */
.home-description {
  margin-bottom: 35px;
}
.home-description p {
  font-size: 1rem;
  color: #5d4037;
  line-height: 1.6;
  margin: 0;
}

/* Action buttons */
.home-actions {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

/* Button base */
.btn-primary,
.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 32px;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 600;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

/* Primary: vàng gradient */
.btn-primary {
  background: linear-gradient(135deg, #ffd54f 0%, #ffb300 100%);
  color: #5d4037;
}
.btn-primary:hover {
  transform: translateY(-2px);
  background: linear-gradient(135deg, #ffb300 0%, #ffa000 100%);
  color: #ffffff;
}

/* Secondary: viền vàng */
.btn-secondary {
  background: transparent;
  color: #ffb300;
  border: 2px solid #ffb300;
}
.btn-secondary:hover {
  background: #ffb300;
  color: #ffffff;
  transform: translateY(-2px);
}

/* Cột phải */
.home-right {
  flex: 1;
  background: linear-gradient(135deg, #ffca28 0%, #ffb300 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  position: relative;
  overflow: hidden;
}

/* Ảnh minh họa */
.image-wrapper {
  max-width: 85%;
  z-index: 2;
  position: relative;
}
.home-image {
  width: 100%;
  height: auto;
  object-fit: contain;
  filter: drop-shadow(0 10px 30px rgba(255, 179, 0, 0.35));
}
</style>
