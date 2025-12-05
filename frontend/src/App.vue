<template>
  <div class="app-shell">
    <!-- Toast thông báo toàn app -->
    <Toast />

    <!-- Nội dung từng trang (theo router) -->
    <main class="app-main">
      <router-view />
    </main>
  </div>
</template>

<script>
// Import Toast component để hiển thị thông báo toàn cục
import Toast from "@/components/Toast.vue";

export default {
  name: "App",
  components: {
    Toast,
  },
};
</script>

<!-- Lưu ý: KHÔNG import Bootstrap/FortAwesome ở đây nữa
     vì bạn đã import chúng trong main.js rồi -->
<style scoped>
.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.app-main {
  flex: 1;
}
</style>
