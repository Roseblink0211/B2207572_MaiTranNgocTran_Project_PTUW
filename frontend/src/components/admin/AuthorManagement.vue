<template>
  <div class="author-management app-page">
    <LoadingSpinner :show="loading" />

    <div class="app-card">
      <!-- HEADER TRANG -->
      <div class="section-header">
        <div>
          <h2 class="page-title">Quản lý tác giả</h2>
          <p class="page-subtitle">
            Thêm, chỉnh sửa và quản lý danh sách tác giả của thư viện.
          </p>
        </div>

        <div class="section-header-actions">
          <!-- Ô tìm kiếm -->
          <div class="input-group input-group-sm">
            <span class="input-group-text">
              <i class="fas fa-search"></i>
            </span>
            <input
              type="text"
              class="form-control"
              v-model="searchTerm"
              placeholder="Tìm theo tên hoặc mã tác giả..."
            />
          </div>

          <!-- Nút thêm tác giả -->
          <button
            class="btn btn-primary btn-sm ms-2"
            @click="showAddModal = true"
          >
            <i class="fas fa-plus-circle me-1"></i>
            Thêm tác giả
          </button>
        </div>
      </div>

      <!-- THÔNG BÁO LỖI CHUNG -->
      <div
        v-if="error"
        class="alert alert-danger alert-dismissible fade show mb-3"
        role="alert"
      >
        {{ error }}
        <button type="button" class="btn-close" @click="clearError"></button>
      </div>

      <!-- BẢNG DANH SÁCH TÁC GIẢ -->
      <div class="table-responsive">
        <table class="table table-hover align-middle">
          <thead>
            <tr>
              <th>Mã tác giả</th>
              <th>Tên tác giả</th>
              <th>Số điện thoại</th>
              <th>Địa chỉ</th>
              <th>Số sách đã xuất bản</th>
              <th class="text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="author in authors" :key="author._id">
              <td>{{ author.maTacGia }}</td>
              <td>{{ author.tenTacGia }}</td>
              <td>{{ author.soDienThoai || "-" }}</td>
              <td>{{ author.diaChi || "-" }}</td>
              <td>{{ getAuthorBookCount(author._id) }}</td>
              <td class="text-center">
                <button
                  class="action-btn edit me-1"
                  title="Sửa tác giả"
                  @click="editAuthor(author)"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button
                  class="action-btn delete"
                  title="Xóa tác giả"
                  @click="confirmDelete(author)"
                >
                  <i class="fas fa-trash-alt"></i>
                </button>
              </td>
            </tr>

            <tr v-if="!authors.length">
              <td colspan="6" class="text-center text-muted py-4">
                Không có tác giả nào phù hợp với từ khóa tìm kiếm.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- MODAL THÊM / SỬA TÁC GIẢ -->
    <div class="modal" tabindex="-1" :class="{ 'd-block': showAddModal }">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ editingAuthor ? "Sửa thông tin tác giả" : "Thêm tác giả" }}
            </h5>
            <button
              type="button"
              class="btn-close"
              @click="closeModal"
            ></button>
          </div>

          <div class="modal-body">
            <form @submit.prevent="handleSubmit" novalidate>
              <div class="mb-3">
                <label class="form-label">
                  Mã tác giả <span class="text-danger">*</span>
                </label>
                <input
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': errors.maTacGia }"
                  v-model="AuthorForm.maTacGia"
                  required
                />
                <div class="invalid-feedback" v-if="errors.maTacGia">
                  {{ errors.maTacGia }}
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label">
                  Tên tác giả <span class="text-danger">*</span>
                </label>
                <input
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': errors.tenTacGia }"
                  v-model="AuthorForm.tenTacGia"
                  required
                />
                <div class="invalid-feedback" v-if="errors.tenTacGia">
                  {{ errors.tenTacGia }}
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label">Số điện thoại</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="AuthorForm.soDienThoai"
                />
              </div>

              <div class="mb-3">
                <label class="form-label">Địa chỉ</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="AuthorForm.diaChi"
                />
              </div>

              <div class="text-end">
                <button
                  type="button"
                  class="btn btn-outline-secondary me-2"
                  @click="closeModal"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  class="btn btn-primary"
                  :disabled="loading"
                >
                  {{
                    loading
                      ? "Đang xử lý..."
                      : editingAuthor
                      ? "Cập nhật"
                      : "Thêm mới"
                  }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL XÁC NHẬN XÓA -->
    <div class="modal" tabindex="-1" :class="{ 'd-block': showDeleteModal }">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Xác nhận xóa tác giả</h5>
            <button
              type="button"
              class="btn-close"
              @click="closeDeteleModal"
            ></button>
          </div>
          <div class="modal-body">
            <p>
              Bạn có chắc chắn muốn xóa tác giả
              <strong>"{{ selectedAuthor?.tenTacGia }}"</strong>
              không?
            </p>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-outline-secondary"
              @click="closeDeteleModal"
            >
              Hủy
            </button>
            <button
              type="button"
              class="btn btn-danger"
              @click="handleDelete"
              :disabled="loading"
            >
              {{ loading ? "Đang xử lý..." : "Xóa" }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- BACKDROP CHO CẢ HAI MODAL -->
    <div class="modal-backdrop fade show" v-if="showAddModal"></div>
    <div class="modal-backdrop fade show" v-if="showDeleteModal"></div>
  </div>
</template>

<script>
import { ref, onMounted, computed, getCurrentInstance } from "vue";
import { useStore } from "vuex";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import { validateAuthorForm } from "@/utils/validation";
import { showError } from "@/utils/notifications";

export default {
  name: "AuthorManagement",
  components: { LoadingSpinner },
  setup() {
    const store = useStore();
    const { proxy } = getCurrentInstance(); // để dùng proxy.$toast

    const showAddModal = ref(false);
    const editingAuthor = ref(null);
    const searchTerm = ref("");
    const showDeleteModal = ref(false);
    const selectedAuthor = ref(null);

    const AuthorForm = ref({
      maTacGia: "",
      tenTacGia: "",
      soDienThoai: "",
      diaChi: "",
    });

    const errors = ref({});

    const authorsAll = computed(() => store.getters["author/allAuthors"]);
    const loading = computed(() => store.getters["author/isLoading"]);
    const error = computed(() => store.getters["author/error"]);

    // Lọc theo search
    const authors = computed(() => {
      if (!searchTerm.value.trim()) return authorsAll.value;
      const search = searchTerm.value.toLowerCase().trim();
      return authorsAll.value.filter(
        (author) =>
          author.tenTacGia.toLowerCase().includes(search) ||
          author.maTacGia.toLowerCase().includes(search)
      );
    });

    const fetchAuthors = async () => {
      await store.dispatch("author/fetchAuthors");
    };

    const confirmDelete = (author) => {
      selectedAuthor.value = author;
      showDeleteModal.value = true;
    };

    const closeDeteleModal = () => {
      showDeleteModal.value = false;
      selectedAuthor.value = null;
    };

    const handleDelete = async () => {
      try {
        await store.dispatch("author/deleteAuthor", selectedAuthor.value._id);
        await fetchAuthors();
        closeDeteleModal();
        proxy.$toast?.show("Xóa tác giả thành công", "success");
      } catch (err) {
        showError("Lỗi khi xóa tác giả: " + (err.message || ""));
      }
    };

    const closeModal = () => {
      showAddModal.value = false;
      editingAuthor.value = null;
      AuthorForm.value = {
        maTacGia: "",
        tenTacGia: "",
        soDienThoai: "",
        diaChi: "",
      };
      errors.value = {};
    };

    const allBooks = computed(() => store.getters["book/allBooks"]);

    const getAuthorBookCount = (authorId) => {
      return allBooks.value.filter((book) => book.maTacGia?._id === authorId)
        .length;
    };

    const fetchData = async () => {
      try {
        await Promise.all([
          store.dispatch("author/fetchAuthors"),
          store.dispatch("book/fetchBooks"),
        ]);
      } catch (err) {
        showError("Lỗi khi tải dữ liệu: " + (err.message || ""));
      }
    };

    const editAuthor = (author) => {
      editingAuthor.value = author;
      AuthorForm.value = {
        maTacGia: author.maTacGia || "",
        tenTacGia: author.tenTacGia || "",
        soDienThoai: author.soDienThoai || "",
        diaChi: author.diaChi || "",
      };
      errors.value = {};
      showAddModal.value = true;
    };

    const handleSubmit = async () => {
      try {
        const { isValid, errors: validationErrors } = validateAuthorForm(
          AuthorForm.value
        );
        if (!isValid) {
          errors.value = validationErrors;
          return;
        }

        if (editingAuthor.value) {
          await store.dispatch("author/updateAuthor", {
            id: editingAuthor.value._id,
            authorData: AuthorForm.value,
          });
          proxy.$toast?.show("Cập nhật tác giả thành công", "success");
        } else {
          await store.dispatch("author/createAuthor", AuthorForm.value);
          proxy.$toast?.show("Thêm tác giả thành công", "success");
        }

        await fetchAuthors();
        closeModal();
      } catch (err) {
        console.error("Error details:", err.response?.data || err.message);
        showError("Lỗi khi lưu tác giả: " + (err.message || ""));
      }
    };

    const clearError = () => {
      store.commit("author/SET_ERROR", null);
    };

    onMounted(fetchData);

    return {
      showAddModal,
      editingAuthor,
      AuthorForm,
      errors,
      loading,
      error,
      authors,
      searchTerm,
      closeModal,
      editAuthor,
      handleSubmit,
      clearError,
      getAuthorBookCount,
      showDeleteModal,
      selectedAuthor,
      confirmDelete,
      closeDeteleModal,
      handleDelete,
    };
  },
};
</script>

<style scoped>
.author-management {
  margin-top: 8px;
}

/* nút thao tác trong bảng */
.action-btn {
  border: none;
  background: transparent;
  padding: 4px 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.15s ease;
}

.action-btn.edit {
  color: #0369a1;
}
.action-btn.edit:hover {
  background: #e0f2fe;
}

.action-btn.delete {
  color: #b91c1c;
}
.action-btn.delete:hover {
  background: #fee2e2;
}

/* modal overlay */
.modal {
  background-color: rgba(0, 0, 0, 0.35);
}

/* text phụ */
.text-muted {
  font-size: 0.85em;
  font-style: italic;
}
</style>
