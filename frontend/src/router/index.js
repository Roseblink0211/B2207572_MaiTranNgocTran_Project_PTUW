// Import các hàm tạo router và lịch sử từ Vue Router
import { createRouter, createWebHistory } from "vue-router";

// Import các view
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import ReaderDashboard from "../views/ReaderDashboard.vue";

// Layout admin
import AdminLayout from "@/layouts/AdminLayout.vue";

// Import các component admin dùng trong nested routes
import AdminHomePage from "@/components/admin/AdminHomePage.vue";
import BookManagement from "@/components/admin/BookManagement.vue";
import AuthorManagement from "@/components/admin/AuthorManagement.vue";
import PublisherManagement from "@/components/admin/PublisherManagement.vue";
import ReaderManagement from "@/components/admin/ReaderManagement.vue";
import StaffManagement from "@/components/admin/StaffManagement.vue";
import BorrowManagement from "@/components/admin/BorrowManagement.vue";
import OverdueBook from "@/components/admin/OverdueBook.vue";

// Import Vuex store để kiểm tra trạng thái đăng nhập và vai trò
import store from "../store";

// Khai báo các route (đường dẫn URL và component tương ứng)
const routes = [
  // Vào "/" thì tự redirect sang /login cho đỡ trắng
  {
    path: "/",
    redirect: "/login",
  },

  {
    path: "/home",
    name: "home",
    component: HomeView,
    meta: { guestOnly: true },
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
    meta: { guestOnly: true },
  },
  {
    path: "/register",
    name: "register",
    component: RegisterView,
    meta: { guestOnly: true },
  },

  // Khu vực ADMIN dùng layout AdminLayout + nested routes
  {
    path: "/admin",
    component: AdminLayout,
    meta: { requiresAuth: true, adminOnly: true },
    children: [
      { path: "", name: "admin-home", component: AdminHomePage },
      { path: "books", name: "admin-books", component: BookManagement },
      { path: "authors", name: "admin-authors", component: AuthorManagement },
      {
        path: "publishers",
        name: "admin-publishers",
        component: PublisherManagement,
      },
      { path: "readers", name: "admin-readers", component: ReaderManagement },
      { path: "borrows", name: "admin-borrows", component: BorrowManagement },
      { path: "overdue", name: "admin-overdue", component: OverdueBook },
      { path: "staffs", name: "admin-staffs", component: StaffManagement },
    ],
  },

  // Dashboard dành cho độc giả
  {
    path: "/reader",
    name: "reader",
    component: ReaderDashboard,
    meta: { requiresAuth: true }, // chỉ cần đăng nhập
  },
];

// Tạo đối tượng router với lịch sử HTML5 và danh sách route
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Hàm khởi tạo auth từ localStorage (dùng cho làm mới trang hoặc reload)
const initializeAuth = () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const userType = localStorage.getItem("userType");

  if (token && user) {
    store.commit("auth/SET_TOKEN", token);
    store.commit("auth/SET_USER", user);
    store.commit("auth/SET_USER_TYPE", userType);
  }
};

// Navigation guard trước mỗi lần chuyển trang
router.beforeEach((to, from, next) => {
  initializeAuth();

  const isAuthenticated = store.getters["auth/isAuthenticated"];
  const isAdmin = store.getters["auth/isAdmin"];

  if (to.meta.requiresAuth && !isAuthenticated) {
    // Chưa đăng nhập mà vào trang cần login
    next("/login");
  } else if (to.meta.adminOnly && !isAdmin) {
    // Không phải admin mà vào khu admin
    next("/");
  } else if (to.meta.guestOnly && isAuthenticated) {
    // Đã login mà vào login/register/home → đẩy về dashboard phù hợp
    next(isAdmin ? "/admin" : "/reader");
  } else {
    next();
  }
});

export default router;
