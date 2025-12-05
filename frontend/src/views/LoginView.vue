<template>
  <div class="auth-page">
    <div class="auth-card shadow-lg">
      <div class="row g-0 h-100">
        <!-- Panel giới thiệu bên trái -->
        <div class="col-md-5 d-none d-md-flex auth-card__side">
          <div class="auth-card__side-content">
            <div class="auth-logo mb-3">
              <i class="fas fa-book-open"></i>
            </div>
            <h2 class="mb-2">Library Management</h2>
            <p class="mb-4 text-muted">
              Hệ thống quản lý thư viện dành cho sinh viên và thủ thư. Đăng nhập
              để quản lý sách, độc giả và các lượt mượn.
            </p>
            <ul class="auth-highlights list-unstyled">
              <li>
                <i class="fas fa-check-circle me-2 text-warning"></i>
                Quản lý mượn trả rõ ràng
              </li>
              <li>
                <i class="fas fa-check-circle me-2"></i>
                Thống kê, báo cáo nhanh
              </li>
              <li>
                <i class="fas fa-check-circle me-2"></i>
                Giao diện thân thiện, dễ dùng
              </li>
            </ul>
          </div>
        </div>

        <!-- Panel form đăng nhập bên phải -->
        <div class="col-md-7">
          <div class="auth-card__form">
            <div class="mb-4 text-center text-md-start">
              <h3 class="mb-1">Chào mừng trở lại 👋</h3>
              <p class="text-muted mb-0">
                Đăng nhập để truy cập bảng điều khiển thư viện.
              </p>
            </div>

            <!-- Form đăng nhập cũ của bạn -->
            <LoginForm />

            <div class="mt-4 text-center text-muted small">
              Chưa có tài khoản?
              <router-link :to="{ name: 'register' }">
                Đăng ký ngay
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LoginForm from "@/components/auth/LoginForm.vue";

export default {
  name: "LoginView",
  components: {
    LoginForm,
  },
};
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 12px;
}

.auth-card {
  background: #ffffff;
  border-radius: 1.5rem;
  max-width: 980px;
  width: 100%;
  overflow: hidden;
}

/* Panel giới thiệu bên trái – vàng tươi */
.auth-card__side {
  background: radial-gradient(circle at top left, #f9c33f, #fddc80);
  color: #5c4620;
  padding: 32px 28px;
}

.auth-card__side-content {
  margin-top: auto;
  margin-bottom: auto;
}

/* Logo khối vàng nhạt */
.auth-logo {
  width: 52px;
  height: 52px;
  border-radius: 16px;
  background: rgba(255, 250, 224, 0.8);
  color: #5c4620;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
}

/* Danh sách bullet */
.auth-highlights li {
  margin-bottom: 0.4rem;
  font-size: 0.9rem;
}

/* Icon check vàng hơi đậm để nổi */
.auth-highlights i {
  color: #d9a12c;
}

/* Panel form bên phải */
.auth-card__form {
  padding: 32px 28px;
}

@media (min-width: 992px) {
  .auth-card__form {
    padding: 40px 40px 40px 32px;
  }
}
</style>
