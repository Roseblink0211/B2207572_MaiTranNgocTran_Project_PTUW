<template>
  <div class="auth-page">
    <div class="auth-card shadow-lg">
      <div class="row g-0 h-100">
        <!-- Panel giới thiệu bên trái -->
        <div class="col-md-5 d-none d-md-flex auth-card__side">
          <div class="auth-card__side-content">
            <div class="auth-logo mb-3">
              <i class="fas fa-id-card-alt"></i>
            </div>
            <h2 class="mb-2">Tạo tài khoản thư viện</h2>
            <p class="mb-4 text-muted">
              Đăng ký để có thể mượn sách, theo dõi lịch sử mượn và nhận thông
              báo nhắc trả sách đúng hạn.
            </p>
            <ul class="auth-highlights list-unstyled">
              <li>
                <i class="fas fa-book-reader me-2"></i>
                Tìm kiếm và mượn sách dễ dàng
              </li>
              <li>
                <i class="fas fa-history me-2"></i>
                Xem lại lịch sử mượn trả của bạn
              </li>
              <li>
                <i class="fas fa-bell me-2"></i>
                Nhận thông báo khi sắp tới hạn trả
              </li>
            </ul>
          </div>
        </div>

        <!-- Panel form bên phải -->
        <div class="col-md-7">
          <div class="auth-card__form">
            <div class="mb-4 text-center text-md-start">
              <h3 class="mb-1">Đăng ký tài khoản ✨</h3>
              <p class="text-muted mb-0">
                Điền đầy đủ thông tin bên dưới để tham gia hệ thống thư viện.
              </p>
            </div>

            <!-- Form đăng ký cũ của bạn -->
            <RegisterForm />

            <div class="mt-4 text-center text-muted small">
              Đã có tài khoản?
              <router-link :to="{ name: 'login' }">
                Đăng nhập ngay
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RegisterForm from "@/components/auth/RegisterForm.vue";

export default {
  name: "RegisterView",
  components: {
    RegisterForm,
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

/* PANEL TRÁI – VÀNG TƯƠI */
.auth-card__side {
  background: radial-gradient(circle at top left, #f9d342, #ffe68a);
  color: #5c4a1f;
  padding: 32px 28px;
}

.auth-card__side-content {
  margin-top: auto;
  margin-bottom: auto;
}

/* LOGO */
.auth-logo {
  width: 52px;
  height: 52px;
  border-radius: 16px;
  background: rgba(255, 239, 154, 0.8);
  color: #5c4a1f;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
}

/* LIST HIGHLIGHT */
.auth-highlights li {
  margin-bottom: 0.4rem;
  font-size: 0.9rem;
}

.auth-highlights i {
  color: #d1a200;
}

/* FORM PANEL */
.auth-card__form {
  padding: 32px 28px;
}

@media (min-width: 992px) {
  .auth-card__form {
    padding: 40px 40px 40px 32px;
  }
}
</style>
