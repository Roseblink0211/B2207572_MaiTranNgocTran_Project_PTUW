<template>
  <div class="admin-layout">
    <!-- TOPBAR -->
    <header class="admin-topbar">
      <div class="topbar-left">
        <h5 class="mb-0">
          <i class="fas fa-book-reader me-2"></i>
          Quản trị thư viện
        </h5>
        <span class="topbar-sub">
          <slot name="subtitle">Quản lý toàn bộ hệ thống thư viện</slot>
        </span>
      </div>
      <div class="topbar-right">
        <span class="me-3 text-muted small">
          Xin chào <strong>{{ currentUser?.hoTenNV }}</strong>
        </span>
        <button class="btn btn-dark btn-sm" @click="handleLogout">
          <i class="fas fa-sign-out-alt me-1"></i> Đăng xuất
        </button>
      </div>
    </header>

    <div class="admin-body">
      <!-- SIDEBAR -->
      <aside class="admin-sidebar">
        <nav>
          <router-link
            v-for="(item, i) in menu"
            :key="i"
            :to="item.to"
            class="sidebar-link"
          >
            <i :class="item.icon + ' me-2'"></i>
            {{ item.label }}
          </router-link>
        </nav>
      </aside>

      <!-- CONTENT -->
      <main class="admin-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

export default {
  name: "AdminLayout",
  setup() {
    const store = useStore();
    const router = useRouter();

    const currentUser = computed(() => store.getters["auth/currentUser"]);

    const menu = [
      { label: "Trang chủ", icon: "fas fa-home", to: "/admin" },
      { label: "Sách", icon: "fas fa-book", to: "/admin/books" },
      { label: "Tác giả", icon: "fas fa-feather-alt", to: "/admin/authors" },
      { label: "NXB", icon: "fas fa-building", to: "/admin/publishers" },
      { label: "Độc giả", icon: "fas fa-users", to: "/admin/readers" },
      { label: "Mượn sách", icon: "fas fa-exchange-alt", to: "/admin/borrows" },
      { label: "Quá hạn", icon: "fas fa-clock", to: "/admin/overdue" },
      { label: "Nhân viên", icon: "fas fa-user-tie", to: "/admin/staffs" },
    ];

    const handleLogout = async () => {
      await store.dispatch("auth/logout");
      router.push("/login");
    };

    return { currentUser, menu, handleLogout };
  },
};
</script>

<style scoped>
.admin-layout {
  min-height: 100vh;
  background: #fff8d6;
  display: flex;
  flex-direction: column;
}

/* TOPBAR */
.admin-topbar {
  background: linear-gradient(90deg, #ffdd66, #ffc835);
  padding: 14px 20px;
  display: flex;
  justify-content: space-between;
  border-radius: 0 0 14px 14px;
}

.topbar-left h5 {
  font-weight: 700;
  color: #4b3b00;
}
.topbar-sub {
  font-size: 0.85rem;
  color: #6e5300;
}

.topbar-right {
  display: flex;
  align-items: center;
}

/* BODY */
.admin-body {
  display: flex;
  flex: 1;
}

/* SIDEBAR */
.admin-sidebar {
  width: 230px;
  padding: 16px 14px;
  border-right: 1px solid #ffe29b;
  background: #fffdf5;
}

.sidebar-link {
  display: block;
  padding: 10px 10px;
  border-radius: 8px;
  margin-bottom: 6px;
  font-size: 0.92rem;
  font-weight: 500;
  color: #4b3b00;
  transition: 0.2s;
}
.sidebar-link:hover {
  background: #ffeaa7;
}

/* CONTENT */
.admin-content {
  flex: 1;
  padding: 20px;
  min-height: calc(100vh - 70px);
  background: #fffdf5;
  border-left: 1px solid #ffe29b;
}
</style>
