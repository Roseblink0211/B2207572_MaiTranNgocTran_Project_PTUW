<template>
  <div class="publisher-management app-page">
    <LoadingSpinner :show="loading" />

    <div class="app-card">
      <!-- HEADER TRANG -->
      <div class="section-header">
        <div>
          <h2 class="page-title">Quản lý nhà xuất bản</h2>
          <p class="page-subtitle">
            Quản lý thông tin các nhà xuất bản, phục vụ cho việc nhập và tra cứu
            sách.
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
              placeholder="Tìm theo mã NXB hoặc tên NXB..."
            />
          </div>

          <!-- Nút thêm NXB -->
          <button
            class="btn btn-primary btn-sm ms-2"
            @click="showAddModal = true"
          >
            <i class="fas fa-plus-circle me-1"></i>
            Thêm nhà xuất bản
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

      <!-- BẢNG DANH SÁCH NXB -->
      <div class="table-responsive">
        <table class="table table-hover align-middle">
          <thead>
            <tr>
              <th>Mã NXB</th>
              <th>Tên NXB</th>
              <th>Địa chỉ</th>
              <th>Số sách đã xuất bản</th>
              <th class="text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="publisher in publishers" :key="publisher._id">
              <td>{{ publisher.maNXB }}</td>
              <td>{{ publisher.tenNXB }}</td>
              <td>{{ publisher.diaChi || "-" }}</td>
              <td>{{ getPublisherBookCount(publisher._id) }}</td>
              <td class="text-center">
                <button
                  class="action-btn edit me-1"
                  title="Sửa NXB"
                  @click="editPublisher(publisher)"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button
                  class="action-btn delete"
                  title="Xóa NXB"
                  @click="confirmDelete(publisher)"
                >
                  <i class="fas fa-trash-alt"></i>
                </button>
              </td>
            </tr>

            <tr v-if="!publishers.length">
              <td colspan="5" class="text-center text-muted py-4">
                Không có nhà xuất bản nào phù hợp với từ khóa tìm kiếm.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- MODAL THÊM / SỬA NXB -->
    <div class="modal" tabindex="-1" :class="{ 'd-block': showAddModal }">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{
                editingPublisher
                  ? "Sửa thông tin nhà xuất bản"
                  : "Thêm nhà xuất bản mới"
              }}
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
                  Mã NXB <span class="text-danger">*</span>
                </label>
                <input
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': errors.maNXB }"
                  v-model="publisherForm.maNXB"
                  required
                />
                <div class="invalid-feedback" v-if="errors.maNXB">
                  {{ errors.maNXB }}
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label">
                  Tên NXB <span class="text-danger">*</span>
                </label>
                <input
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': errors.tenNXB }"
                  v-model="publisherForm.tenNXB"
                  required
                />
                <div class="invalid-feedback" v-if="errors.tenNXB">
                  {{ errors.tenNXB }}
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label">
                  Địa chỉ <span class="text-danger">*</span>
                </label>
                <input
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': errors.diaChi }"
                  v-model="publisherForm.diaChi"
                  required
                />
                <div class="invalid-feedback" v-if="errors.diaChi">
                  {{ errors.diaChi }}
                </div>
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
                      : editingPublisher
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
            <h5 class="modal-title">Xác nhận xóa</h5>
            <button
              type="button"
              class="btn-close"
              @click="closeDeleteModal"
            ></button>
          </div>
          <div class="modal-body">
            <p>
              Bạn có chắc chắn muốn xóa nhà xuất bản
              <strong>"{{ selectedPublisher?.tenNXB }}"</strong>
              không?
            </p>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-outline-secondary"
              @click="closeDeleteModal"
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
import { validatePublisherForm } from "@/utils/validation";
import { showError } from "@/utils/notifications";

export default {
  name: "PublisherManagement",
  components: { LoadingSpinner },
  setup() {
    const store = useStore();
    const { proxy } = getCurrentInstance(); // dùng proxy.$toast

    const showAddModal = ref(false);
    const editingPublisher = ref(null);
    const searchTerm = ref("");
    const showDeleteModal = ref(false);
    const selectedPublisher = ref(null);

    const publisherForm = ref({
      maNXB: "",
      tenNXB: "",
      diaChi: "",
    });

    const errors = ref({});

    const publishersAll = computed(
      () => store.getters["publisher/allPublishers"]
    );
    const loading = computed(() => store.getters["publisher/isLoading"]);
    const error = computed(() => store.getters["publisher/error"]);
    const allBooks = computed(() => store.getters["book/allBooks"]);

    // Lọc theo search
    const publishers = computed(() => {
      if (!searchTerm.value) return publishersAll.value;
      const search = searchTerm.value.toLowerCase().trim();
      return publishersAll.value.filter(
        (pub) =>
          pub.maNXB.toLowerCase().includes(search) ||
          pub.tenNXB.toLowerCase().includes(search)
      );
    });

    const getPublisherBookCount = (publisherId) => {
      return allBooks.value.filter((book) => book.maNXB?._id === publisherId)
        .length;
    };

    const fetchData = async () => {
      try {
        await Promise.all([
          store.dispatch("publisher/fetchPublishers"),
          store.dispatch("book/fetchBooks"),
        ]);
      } catch (err) {
        showError("Lỗi khi tải dữ liệu: " + (err.message || ""));
      }
    };

    const confirmDelete = (publisher) => {
      selectedPublisher.value = publisher;
      showDeleteModal.value = true;
    };

    const closeDeleteModal = () => {
      showDeleteModal.value = false;
      selectedPublisher.value = null;
    };

    const handleDelete = async () => {
      try {
        await store.dispatch(
          "publisher/deletePublisher",
          selectedPublisher.value._id
        );
        await fetchData();
        closeDeleteModal();
        proxy.$toast?.show("Xóa nhà xuất bản thành công", "success");
      } catch (err) {
        showError("Lỗi khi xóa nhà xuất bản: " + (err.message || ""));
      }
    };

    const closeModal = () => {
      showAddModal.value = false;
      editingPublisher.value = null;
      publisherForm.value = {
        maNXB: "",
        tenNXB: "",
        diaChi: "",
      };
      errors.value = {};
    };

    const editPublisher = (publisher) => {
      editingPublisher.value = publisher;
      publisherForm.value = {
        maNXB: publisher.maNXB || "",
        tenNXB: publisher.tenNXB || "",
        diaChi: publisher.diaChi || "",
      };
      errors.value = {};
      showAddModal.value = true;
    };

    const handleSubmit = async () => {
      try {
        const { isValid, errors: validationErrors } = validatePublisherForm(
          publisherForm.value
        );
        if (!isValid) {
          errors.value = validationErrors;
          return;
        }

        if (editingPublisher.value) {
          await store.dispatch("publisher/updatePublisher", {
            id: editingPublisher.value._id,
            publisherData: publisherForm.value,
          });
          proxy.$toast?.show("Cập nhật nhà xuất bản thành công", "success");
        } else {
          await store.dispatch(
            "publisher/createPublisher",
            publisherForm.value
          );
          proxy.$toast?.show("Thêm nhà xuất bản thành công", "success");
        }

        await fetchData();
        closeModal();
      } catch (err) {
        showError("Lỗi khi lưu nhà xuất bản: " + (err.message || ""));
      }
    };

    const clearError = () => {
      store.commit("publisher/SET_ERROR", null);
    };

    onMounted(fetchData);

    return {
      showAddModal,
      editingPublisher,
      publisherForm,
      errors,
      loading,
      error,
      publishers,
      searchTerm,
      closeModal,
      editPublisher,
      handleSubmit,
      clearError,
      getPublisherBookCount,
      showDeleteModal,
      selectedPublisher,
      confirmDelete,
      closeDeleteModal,
      handleDelete,
    };
  },
};
</script>

<style scoped>
.publisher-management {
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
