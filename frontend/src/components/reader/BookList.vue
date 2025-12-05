<template>
  <div class="book-list">
    <LoadingSpinner :show="loading" />

    <h2>Danh sách sách</h2>

    <div
      v-if="error"
      class="alert alert-danger alert-dismissible fade show"
      role="alert"
    >
      {{ error }}
      <button type="button" class="btn-close" @click="clearError"></button>
    </div>

    <!-- Confirmation Modal. -->
    <div class="modal" tabindex="-1" :class="{ 'd-block': showConfirmModal }">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Xác nhận mượn sách</h5>
            <button
              type="button"
              class="btn-close"
              @click="closeConfirmModal"
            ></button>
          </div>
          <div class="modal-body">
            <p>Bạn muốn mượn '{{ selectedBook?.tenSach }}'?</p>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              @click="closeConfirmModal"
            >
              Hủy
            </button>
            <button
              type="button"
              class="btn btn-primary"
              @click="handleConfirmBorrow"
              :disabled="loading"
            >
              {{ loading ? "Đang xử lý..." : "Mượn sách" }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade show" v-if="showConfirmModal"></div>

    <!-- Tìm kiếm -->
    <div class="row mb-4">
      <div class="col-md-6">
        <div class="input-group">
          <input
            type="text"
            class="form-control"
            v-model="searchTerm"
            placeholder="Tìm kiếm theo tên sách, mã sách, tên NXB, tên tác giả"
          />
          <span class="input-group-text">
            <i class="fas fa-search"></i>
          </span>
        </div>
      </div>
    </div>

    <!-- Danh sách sách -->
    <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
      <div class="col" v-for="book in books" :key="book._id">
        <div class="card h-100 book-card">
          <div class="card-img-container">
            <img
              :src="`${API_URL}${
                book.imagePath || '/uploads/default-book.jpg'
              }`"
              class="card-img-top"
              alt="Book cover"
              @error="handleImageError"
            />
          </div>
          <div class="card-body p-3">
            <h6 class="card-title">{{ book.tenSach }}</h6>
            <p class="card-text small mb-1">
              <span class="text-muted">{{ book.maSach }}</span>
            </p>
            <p class="card-text small mb-1">
              <strong>NXB:</strong> {{ book.maNXB?.tenNXB || "N/A" }}
            </p>
            <p class="card-text small mb-1">
              <strong>Năm:</strong> {{ book.namXuatBan }}
            </p>
            <p class="card-text small mb-1">
              <strong>Tác giả:</strong>
              {{ book.maTacGia?.tenTacGia || "Chưa có" }}
            </p>
            <p class="card-text small mb-1">
              <strong>Nguồn:</strong> {{ book.nguonGoc }}
            </p>
            <p class="card-text small mb-2">
              <strong>Còn:</strong>
              <span
                :class="{
                  'text-danger fw-bold': book.soQuyen === 0,
                  'text-warning fw-bold': book.soQuyen > 0 && book.soQuyen < 3,
                  'text-success': book.soQuyen >= 3,
                }"
                >{{ book.soQuyen }}</span
              >
              <br />
              <small class="text-muted status-text" v-if="book.soQuyen < 3">
                {{ book.soQuyen === 0 ? "Hết sách" : "Sắp hết" }}
              </small>
            </p>
          </div>
          <div class="card-footer p-3">
            <button
              class="btn btn-primary btn-sm w-100"
              @click="borrowBook(book._id)"
              :disabled="book.soQuyen === 0 || loading"
            >
              {{ loading ? "Đang xử lý..." : "Mượn sách" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed, getCurrentInstance } from "vue";
import { useStore } from "vuex";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import { showSuccess, showError } from "@/utils/notifications";

export default {
  name: "BookList",
  components: { LoadingSpinner },
  setup() {
    const { proxy } = getCurrentInstance();
    const error = ref(null);
    const loading = ref(false);
    const searchTerm = ref("");
    const selectedBook = ref(null);
    const selectedBookId = ref(null);
    const showConfirmModal = ref(false);
    const store = useStore();
    const API_URL = import.meta.env.VITE_API_IMAGE_URL;
    const allBooks = computed(() => store.getters["book/allBooks"]);

    const books = computed(() => {
      if (!searchTerm.value) return allBooks.value;

      const search = searchTerm.value.toLowerCase().trim();
      return allBooks.value.filter(
        (book) =>
          book.tenSach.toLowerCase().includes(search) ||
          book.maSach.toLowerCase().includes(search) ||
          book.maNXB?.tenNXB.toLowerCase().includes(search) ||
          book.nguonGoc.toLowerCase().includes(search) ||
          (book.maTacGia?.tenTacGia &&
            book.maTacGia.tenTacGia.toLowerCase().includes(search))
      );
    });

    const fetchBooks = async () => {
      try {
        loading.value = true;
        await store.dispatch("book/fetchBooks");
        // books.value = store.getters['book/allBooks'];
      } catch (err) {
        error.value = err.message;
        console.error("Error fetching books:", err);
      } finally {
        loading.value = false;
      }
    };

    const borrowBook = (bookId) => {
      selectedBook.value = books.value.find((book) => book._id === bookId);
      selectedBookId.value = bookId;
      showConfirmModal.value = true;
    };

    const closeConfirmModal = () => {
      showConfirmModal.value = false;
      selectedBookId.value = null;
      selectedBook.value = null;
    };

    const handleConfirmBorrow = async () => {
      try {
        loading.value = true;
        await store.dispatch(
          "borrow/createBorrowRequest",
          selectedBookId.value
        );
        proxy.$toast.show(
          "Yêu cầu mượn sách đã được gửi. Vui lòng chờ quản lý duyệt!",
          "success"
        );
        closeConfirmModal();
        await fetchBooks();
      } catch (error) {
        proxy.$toast.show(
          error.response?.data?.message || "Có lỗi xảy ra",
          "danger"
        );
      } finally {
        loading.value = false;
      }
    };

    const clearError = () => {
      error.value = null;
      store.commit("book/SET_ERROR", null);
    };

    const handleImageError = (event) => {
      event.target.src = `${API_URL}/uploads/default-book.jpg`;
    };

    onMounted(fetchBooks);

    return {
      books,
      loading,
      error,
      searchTerm,
      borrowBook,
      showConfirmModal,
      closeConfirmModal,
      handleConfirmBorrow,
      selectedBook,
      clearError,
      handleImageError,
      API_URL,
    };
  },
};
</script>

<style scoped>
.book-card {
  max-width: 280px;
  margin: 0 auto;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #ffe082; /* vàng nhạt */
  background-color: #fffdf5; /* nền sáng */
}

.book-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 14px rgba(255, 179, 0, 0.25);
}

/* Hình ảnh */
.card-img-container {
  height: 200px;
  overflow: hidden;
  background-color: #fff8e1;
}

.card-img-top {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: transform 0.3s ease;
}

.book-card:hover .card-img-top {
  transform: scale(1.06);
}

/* Tiêu đề sách */
.card-title {
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.2;
  margin-bottom: 0.5rem;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  color: #8d6e00; /* vàng đậm */
}

/* Nội dung */
.card-text {
  line-height: 1.3;
  color: #5d4037; /* nâu ấm */
}

.card-text strong {
  font-weight: 600;
  font-size: 0.8rem;
}

.small {
  font-size: 0.85rem;
  color: #6d4c41;
}

/* Footer card */
.card-footer {
  background-color: #fff8e1;
  border-top: 1px solid #ffe082;
}

/* Input tìm kiếm */
.input-group {
  max-width: 500px;
}

.input-group-text {
  background-color: #fff8e1;
  border-left: none;
  color: #8d6e00;
  border-radius: 0 6px 6px 0;
  border: 1px solid #ffecb3;
  border-left: 0;
}

.form-control {
  border-right: none;
  border-radius: 6px 0 0 6px;
  border: 1px solid #ffecb3;
  transition: border-color 0.2s ease;
  font-size: 0.95rem;
  background-color: #ffffff;
}

.form-control:focus {
  border-color: #ffb300;
  box-shadow: 0 0 0 2px rgba(255, 179, 0, 0.2);
  outline: none;
}

.form-control:focus + .input-group-text {
  border-color: #ffb300;
}

/* Trạng thái */
.text-danger {
  font-weight: bold;
  background-color: rgba(244, 67, 54, 0.08);
  color: #c62828 !important;
  border-radius: 4px;
  padding: 2px 4px;
}

.text-warning {
  background-color: rgba(255, 193, 7, 0.14);
  color: #f57c00 !important;
  border-radius: 4px;
  padding: 2px 4px;
}

.text-success {
  color: #2e7d32 !important;
}

.text-muted {
  color: #6c757d !important;
}

.status-text {
  font-size: 0.7rem;
  font-style: italic;
  color: #8d6e00;
}

/* Button chính màu vàng tươi */
.btn-primary {
  background: linear-gradient(135deg, #ffd54f 0%, #ffb300 100%);
  border: none;
  font-weight: 500;
  transition: all 0.2s ease;
  border-radius: 6px;
  font-size: 0.9rem;
  padding: 8px 16px;
  color: #5d4037;
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #ffb300 0%, #ffa000 100%);
  transform: translateY(-1px);
  color: #ffffff;
}

.btn-primary:disabled {
  opacity: 0.6;
  background: #ffe082;
  color: #8d6e00;
}
</style>
